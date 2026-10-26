const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');
const { neon } = require('@neondatabase/serverless');
const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

// Database & Storage Setup
const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!dbUrl) {
  console.error('FATAL: DATABASE_URL is not set.');
}
const sql = neon(dbUrl);

const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});
const S3_BUCKET = process.env.NEON_S3_BUCKET_NAME || 'resume-storage';

// In-memory compiler cache for published PDF
let publishedPdfCache = { key: null, buffer: null };

async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

// LaTeX Compiler function
async function compileLatexToPdf(latexCode) {
  try {
    const response = await axios.post(
      'https://latex.ytotech.com/builds/sync',
      {
        compiler: 'pdflatex',
        resources: [{ main: true, content: latexCode }],
      },
      { responseType: 'arraybuffer', timeout: 35000 }
    );
    return Buffer.from(response.data);
  } catch (err) {
    // Fallback engine
    const fallbackRes = await axios.post(
      'https://latexonline.cc/compile',
      latexCode,
      {
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'arraybuffer',
        timeout: 35000,
      }
    );
    return Buffer.from(fallbackRes.data);
  }
}

// Auth Helper
async function verifySession(req) {
  try {
    let token = req.cookies?.neon_session_token;
    const authHeader = req.headers?.authorization;
    if (!token && authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
    if (!token) return { authenticated: false };

    const sessions = await sql`
      SELECT s.id AS session_id, s.token, s."expiresAt", u.id AS user_id, u.name, u.email, u.role
      FROM neon_auth.session s
      JOIN neon_auth.user u ON s."userId" = u.id
      WHERE s.token = ${token} AND s."expiresAt" > NOW() AND (u.banned IS NULL OR u.banned = false)
      LIMIT 1;
    `;
    if (sessions.length === 0) return { authenticated: false };
    const s = sessions[0];
    return {
      authenticated: true,
      user: { id: s.user_id, name: s.name, email: s.email, role: s.role || 'admin' },
      sessionId: s.session_id,
    };
  } catch (err) {
    return { authenticated: false, error: err.message };
  }
}

// -----------------------------------------------------------------------------
// AUTH ROUTES
// -----------------------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    let normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === 'shreya-roy1818@gmail.com') {
      normalizedEmail = 'shreya.roy1818@gmail.com';
    }
    const users = await sql`
      SELECT u.id, u.name, u.email, u.role, u.banned, a.id AS account_id, a.password AS password_hash
      FROM neon_auth.user u
      LEFT JOIN neon_auth.account a ON a."userId" = u.id AND a."providerId" = 'credential'
      WHERE LOWER(u.email) = ${normalizedEmail}
      LIMIT 1;
    `;

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email not authorized in Neon Auth.' });
    }

    const user = users[0];
    if (user.banned) {
      return res.status(403).json({ error: 'Account suspended.' });
    }

    // Password verification
    let valid = false;
    if (user.password_hash && user.password_hash.includes('.')) {
      const [expectedHash, salt] = user.password_hash.split('.');
      const actualKey = crypto.scryptSync(password, salt, 64);
      valid = crypto.timingSafeEqual(actualKey, Buffer.from(expectedHash, 'hex'));
    } else if (user.password_hash) {
      valid = user.password_hash === password;
    } else {
      // First-time setup: store hash
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = `${crypto.scryptSync(password, salt, 64).toString('hex')}.${salt}`;
      if (user.account_id) {
        await sql`UPDATE neon_auth.account SET password = ${hash}, "updatedAt" = NOW() WHERE id = ${user.account_id}`;
      } else {
        await sql`
          INSERT INTO neon_auth.account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
          VALUES (${crypto.randomUUID()}, ${user.id}, 'credential', ${user.id}, ${hash}, NOW(), NOW())
        `;
      }
      valid = true;
    }

    if (!valid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Create session
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await sql`
      INSERT INTO neon_auth.session (id, "expiresAt", token, "createdAt", "updatedAt", "userId")
      VALUES (${crypto.randomUUID()}, ${expiresAt}, ${token}, NOW(), NOW(), ${user.id});
    `;

    res.cookie('neon_session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });

    return res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'admin' },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/session', async (req, res) => {
  const session = await verifySession(req);
  return res.json(session);
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.cookies?.neon_session_token;
    if (token) {
      await sql`DELETE FROM neon_auth.session WHERE token = ${token}`;
    }
  } catch (e) {}
  res.clearCookie('neon_session_token', { path: '/' });
  return res.json({ success: true });
});

// -----------------------------------------------------------------------------
// PROJECTS ROUTES (portfolio_project table)
// -----------------------------------------------------------------------------
app.get('/api/projects', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  try {
    const session = await verifySession(req);
    // If admin is authenticated, return all projects; otherwise only visible ones
    let projects;
    if (session.authenticated) {
      projects = await sql`SELECT * FROM portfolio_project ORDER BY priority ASC, updated_at DESC`;
    } else {
      projects = await sql`SELECT * FROM portfolio_project WHERE is_visible = true ORDER BY priority ASC, updated_at DESC`;
    }
    return res.json(projects);
  } catch (err) {
    console.error('Projects GET error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const body = req.body;
    // Batch update priorities
    if (Array.isArray(body)) {
      await Promise.all(
        body.map((item) => {
          if (!item.repo_name) return null;
          return sql`
            INSERT INTO portfolio_project (repo_name, display_title, priority, updated_at)
            VALUES (${item.repo_name}, ${item.display_title || item.repo_name}, ${item.priority ?? 0}, NOW())
            ON CONFLICT (repo_name) DO UPDATE
            SET priority = EXCLUDED.priority, updated_at = NOW();
          `;
        })
      );
      return res.json({ success: true, count: body.length });
    }

    // Single item update
    const { repo_name, display_title, custom_description, custom_image_url, demo_url, is_visible, priority } = body;
    if (!repo_name) return res.status(400).json({ error: 'repo_name is required' });

    const result = await sql`
      INSERT INTO portfolio_project (
        repo_name, display_title, custom_description, custom_image_url, demo_url, is_visible, priority, updated_at
      ) VALUES (
        ${repo_name},
        ${display_title || null},
        ${custom_description || null},
        ${custom_image_url || null},
        ${demo_url || null},
        ${is_visible ?? true},
        ${priority ?? 0},
        NOW()
      )
      ON CONFLICT (repo_name) DO UPDATE SET
        display_title = COALESCE(EXCLUDED.display_title, portfolio_project.display_title),
        custom_description = COALESCE(EXCLUDED.custom_description, portfolio_project.custom_description),
        custom_image_url = COALESCE(EXCLUDED.custom_image_url, portfolio_project.custom_image_url),
        demo_url = EXCLUDED.demo_url,
        is_visible = COALESCE(EXCLUDED.is_visible, portfolio_project.is_visible),
        priority = COALESCE(EXCLUDED.priority, portfolio_project.priority),
        updated_at = NOW()
      RETURNING *;
    `;
    return res.json({ success: true, project: result[0] });
  } catch (err) {
    console.error('Projects POST error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// RESUMES ROUTES (portfolio_resume table + S3)
// -----------------------------------------------------------------------------
app.get('/api/resumes', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const rows = await sql`SELECT * FROM portfolio_resume ORDER BY updated_at DESC`;
    return res.json({ resumes: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/resumes', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  const { title, latex, target_role, target_company, jd_text } = req.body;
  if (!title || !latex) return res.status(400).json({ error: 'Title and LaTeX code are required' });

  try {
    const id = 'shreya_' + Date.now();
    const s3Key = `resumes/${id}.tex`;

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: latex,
      ContentType: 'text/x-tex',
    }));

    const result = await sql`
      INSERT INTO portfolio_resume (id, title, s3_key, template_name, target_role, target_company, jd_text, is_published, created_at, updated_at)
      VALUES (${id}, ${title}, ${s3Key}, 'jake-resume', ${target_role || null}, ${target_company || null}, ${jd_text || null}, false, NOW(), NOW())
      RETURNING *;
    `;
    return res.json({ success: true, resume: result[0] });
  } catch (err) {
    console.error('Save resume error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/resumes', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  const { id, title, latex, is_published, target_role, target_company, jd_text } = req.body;
  if (!id) return res.status(400).json({ error: 'Resume id is required' });

  try {
    // If setting as published, toggle others off
    if (is_published === true) {
      await sql`UPDATE portfolio_resume SET is_published = false`;
      await sql`UPDATE portfolio_resume SET is_published = true, updated_at = NOW() WHERE id = ${id}`;
      publishedPdfCache = { key: null, buffer: null };
      return res.json({ success: true, message: 'Resume set as active public display' });
    }

    // Overwrite latex content in S3 if provided
    let resume = await sql`SELECT * FROM portfolio_resume WHERE id = ${id} LIMIT 1`;
    if (resume.length === 0) return res.status(404).json({ error: 'Resume not found' });

    if (latex) {
      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: resume[0].s3_key,
        Body: latex,
        ContentType: 'text/x-tex',
      }));
    }

    const updated = await sql`
      UPDATE portfolio_resume SET
        title = COALESCE(${title}, title),
        target_role = COALESCE(${target_role}, target_role),
        target_company = COALESCE(${target_company}, target_company),
        jd_text = COALESCE(${jd_text}, jd_text),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    publishedPdfCache = { key: null, buffer: null };
    return res.json({ success: true, resume: updated[0] });
  } catch (err) {
    console.error('Update resume error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/resumes', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Resume id is required' });

  try {
    const resume = await sql`SELECT * FROM portfolio_resume WHERE id = ${id} LIMIT 1`;
    if (resume.length > 0) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: resume[0].s3_key }));
      } catch (e) {}
      await sql`DELETE FROM portfolio_resume WHERE id = ${id}`;
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Dynamic Public Resume PDF Stream
app.get('/api/resumes/published-pdf', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const rows = await sql`
      SELECT id, title, s3_key, updated_at
      FROM portfolio_resume
      ORDER BY is_published DESC, updated_at DESC
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No published resume found in database.' });
    }

    const resume = rows[0];
    const cacheKey = `${resume.id}_${new Date(resume.updated_at).getTime()}`;

    if (publishedPdfCache.key === cacheKey && publishedPdfCache.buffer) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${(resume.title || 'Shreya_Roy_Resume').replace(/\.tex$/i, '')}.pdf"`);
      return res.send(publishedPdfCache.buffer);
    }

    const s3Res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: resume.s3_key }));
    const latex = await streamToString(s3Res.Body);
    const pdfBuffer = await compileLatexToPdf(latex);

    publishedPdfCache = { key: cacheKey, buffer: pdfBuffer };
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${(resume.title || 'Shreya_Roy_Resume').replace(/\.tex$/i, '')}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Published PDF error:', err);
    return res.status(500).json({ error: 'Compilation failed: ' + err.message });
  }
});

// Preview PDF by ID
app.get('/api/resumes/preview-pdf', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id is required' });

  try {
    const rows = await sql`SELECT s3_key, title FROM portfolio_resume WHERE id = ${id} LIMIT 1`;
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const s3Res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: rows[0].s3_key }));
    const latex = await streamToString(s3Res.Body);
    const pdfBuffer = await compileLatexToPdf(latex);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${rows[0].title}.pdf"`);
    return res.send(pdfBuffer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// MASTER CONTEXT & COMPILATION ROUTES
// -----------------------------------------------------------------------------
app.get('/api/storage/master-context', async (req, res) => {
  try {
    const s3Res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: 'shreya_master_context.md' }));
    const content = await streamToString(s3Res.Body);
    return res.json({ content });
  } catch (err) {
    // If not yet uploaded, return default template
    return res.json({ content: '# Shreya Roy — Master Career Context\n\n## Professional Summary\nCybersecurity specialist, Machine Learning practitioner, and Full-Stack Developer.\n\n## Projects\n- **EchoMind**: AI conversational insights.\n- **Phishing-Sentinel**: ML-powered phishing attack detection.\n- **OmniShield**: Comprehensive defense suite.\n' });
  }
});

app.post('/api/storage/master-context', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  const { content } = req.body;
  try {
    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: 'shreya_master_context.md',
      Body: content || '',
      ContentType: 'text/markdown',
    }));
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/compile', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'code is required' });

  const startTime = Date.now();
  try {
    const pdfBuffer = await compileLatexToPdf(code);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    return res.json({
      success: true,
      pdfBase64: pdfBuffer.toString('base64'),
      duration: `${duration}s`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// GOOGLE GEMINI AI STUDIO
// -----------------------------------------------------------------------------
app.post('/api/ai/generate', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  const { masterContext, targetRole, targetCompany, jobDescription, templateLatex } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in .env.local' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an elite executive resume writer and ATS optimization specialist.
Generate a high-impact, single-page LaTeX resume tailored precisely to the target role.

TARGET ROLE: ${targetRole || 'Software Engineer'}
TARGET COMPANY: ${targetCompany || 'Top Tech'}
JOB DESCRIPTION:
${jobDescription || 'Standard software engineering qualifications'}

MASTER CONTEXT & CAREER HISTORY:
${masterContext || 'Shreya Roy - Full-stack developer and cybersecurity specialist'}

BASE LATEX TEMPLATE:
${templateLatex || ''}

RULES:
1. Output ONLY valid, compilable LaTeX code.
2. DO NOT wrap output in markdown codeblocks (no \`\`\`latex or \`\`\`). Return raw LaTeX only.
3. Keep margins and formatting strictly ATS-friendly.
4. Ensure every LaTeX command is properly closed. Escape special symbols (%, &, $, _, #) correctly.
`;

    const result = await model.generateContent(prompt);
    let output = result.response.text().trim();
    if (output.startsWith('```latex')) output = output.replace(/^```latex\s*/, '');
    if (output.startsWith('```')) output = output.replace(/^```\s*/, '');
    if (output.endsWith('```')) output = output.replace(/\s*```$/, '');

    return res.json({ success: true, latex: output });
  } catch (err) {
    console.error('AI Generate error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/refine', async (req, res) => {
  const session = await verifySession(req);
  if (!session.authenticated) return res.status(401).json({ error: 'Unauthorized' });

  const { currentLatex, prompt: userPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const instruction = `
You are an expert LaTeX developer.
Refine the following LaTeX resume document according to the user's instructions.

USER INSTRUCTION:
${userPrompt}

CURRENT LATEX CODE:
${currentLatex}

RULES:
1. Return ONLY the complete, updated compilable LaTeX code.
2. Do NOT include markdown code blocks (no \`\`\`latex).
3. Preserve all document class, packages, and syntax integrity.
`;

    const result = await model.generateContent(instruction);
    let output = result.response.text().trim();
    if (output.startsWith('```latex')) output = output.replace(/^```latex\s*/, '');
    if (output.startsWith('```')) output = output.replace(/^```\s*/, '');
    if (output.endsWith('```')) output = output.replace(/\s*```$/, '');

    return res.json({ success: true, latex: output });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Backend API server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
