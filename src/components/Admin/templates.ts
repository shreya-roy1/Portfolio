// Industry-Standard Jake's Resume LaTeX Template tailored for Shreya Roy
export const JAKE_RESUME_TEMPLATE = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{\\$\\vcenter{\\hbox{\\tiny\\$\\bullet\\$}}\\$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-4pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape Shreya Roy} \\\\ \\vspace{2pt}
    \\small \\faEnvelope\\ \\href{mailto:shreya.roy1818@gmail.com}{\\underline{shreya.roy1818@gmail.com}} $|$ 
    \\faGithub\\ \\href{https://github.com/shreya-roy1}{\\underline{github.com/shreya-roy1}} $|$
    \\faLinkedin\\ \\href{https://linkedin.com/in/shreya-roy1}{\\underline{linkedin.com/in/shreya-roy1}} \\\\
    \\vspace{2pt}
    \\small Full-Stack Engineer $|$ Cybersecurity \\& Machine Learning Specialist
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {Bachelor of Technology in Computer Science \\& Engineering}{2022 -- 2026}
      {Undergraduate Studies; CGPA: 8.8 / 10.0}{Kolkata, India}
  \\resumeSubHeadingListEnd

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: Python, C++, TypeScript, JavaScript, SQL, HTML5/CSS3} \\\\
     \\textbf{Frameworks \\& Libraries}{: React.js, Vite, Node.js, Express, Tailwind CSS, Framer Motion} \\\\
     \\textbf{Developer Tools \\& Cloud}{: Git, GitHub, PostgreSQL, Docker, Linux, RESTful APIs, AWS S3} \\\\
     \\textbf{Core Competencies}{: Cybersecurity, Threat Detection, Cryptography, Machine Learning, Data Structures \\& Algorithms}
    }}
 \\end{itemize}

\\section{Featured Projects}
    \\resumeSubHeadingListStart
      
      \\resumeProjectHeading
          {\\textbf{Phishing-Sentinel} $|$ \\emph{Python, Machine Learning, Scikit-Learn, Security} $|$ \\faGithub\\ \\href{https://github.com/shreya-roy1/Phishing-Sentinel}{\\textbf{GitHub}}}{2025}
          \\resumeItemListStart
            \\resumeItem{Architected a machine learning detection model identifying zero-day phishing attacks with over 96\\% classification accuracy.}
            \\resumeItem{Extracted 30+ linguistic and structural features from URL datasets to mitigate domain spoofing in real time.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{EchoMind} $|$ \\emph{TypeScript, React, Node.js, NLP, Tailwind CSS} $|$ \\faGithub\\ \\href{https://github.com/shreya-roy1/EchoMind}{\\textbf{GitHub}}}{2025}
          \\resumeItemListStart
            \\resumeItem{Developed an AI-driven conversational intelligence workspace delivering real-time sentiment telemetry and query assistance.}
            \\resumeItem{Engineered clean reactive components with optimized re-renders and sub-100ms state synchronization.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{OmniShield} $|$ \\emph{Python, Network Protocol Analysis, System Security} $|$ \\faGithub\\ \\href{https://github.com/shreya-roy1/OmniShield}{\\textbf{GitHub}}}{2024}
          \\resumeItemListStart
            \\resumeItem{Constructed a comprehensive system protection and endpoint monitoring suite analyzing network packets to intercept unauthorized access.}
            \\resumeItem{Automated real-time anomaly alerting and firewall rule updates to shield local environments from intrusion.}
          \\resumeItemListEnd

      \\resumeProjectHeading
          {\\textbf{websocket-kanban} $|$ \\emph{React, WebSockets, Node.js, Express} $|$ \\faGithub\\ \\href{https://github.com/shreya-roy1/websocket-kanban}{\\textbf{GitHub}}}{2024}
          \\resumeItemListStart
            \\resumeItem{Engineered a real-time collaborative task management board utilizing WebSockets for multi-client concurrent synchronization.}
            \\resumeItem{Implemented optimistic UI updates and state management to guarantee smooth drag-and-drop interactions.}
          \\resumeItemListEnd

    \\resumeSubHeadingListEnd

\\section{Certifications \\& Honors}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Cybersecurity Defense Competency}{: Recognized in regional security hackathons for vulnerability exploitation prevention.} \\\\
     \\textbf{Open Source Contributor}{: Actively maintaining 25+ open-source repositories spanning security models, tools, and modern web apps.}
    }}
  \\end{itemize}

\\end{document}
`;

export const MODERN_TECH_TEMPLATE = `\\documentclass[letterpaper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=0.6in}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\definecolor{primary}{RGB}{79, 70, 229}
\\definecolor{darkgray}{RGB}{50, 50, 50}

\\hypersetup{
    colorlinks=true,
    linkcolor=primary,
    urlcolor=primary,
}

\\titleformat{\\section}{\\large\\bfseries\\color{primary}}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{4pt}

\\setlist[itemize]{leftmargin=*,noitemsep,topsep=2pt}

\\begin{document}
\\pagestyle{empty}

\\begin{center}
    {\\Huge\\bfseries Shreya Roy} \\\\ [3pt]
    \\small\\color{darkgray}
    Email: \\href{mailto:shreya.roy1818@gmail.com}{shreya.roy1818@gmail.com} \\; | \\;
    GitHub: \\href{https://github.com/shreya-roy1}{github.com/shreya-roy1} \\; | \\;
    LinkedIn: \\href{https://linkedin.com/in/shreya-roy1}{linkedin.com/in/shreya-roy1}
\\end{center}

\\section{Profile Summary}
Cybersecurity researcher, Machine Learning engineer, and Full-Stack developer passionate about building resilient security architectures and high-performance web systems.

\\section{Technical Stack}
\\begin{itemize}
    \\item \\textbf{Languages:} Python, C++, TypeScript, JavaScript, SQL, Bash
    \\item \\textbf{Frameworks \\& Web:} React.js, Vite, Node.js, Express, Tailwind CSS
    \\item \\textbf{Tools \\& Systems:} PostgreSQL, AWS S3, Git, Docker, Linux
\\end{itemize}

\\section{Key Projects}
\\textbf{Phishing-Sentinel} $|$ \\emph{Python, Machine Learning} \\hfill \\href{https://github.com/shreya-roy1/Phishing-Sentinel}{Code}
\\begin{itemize}
    \\item Trained classification models achieving 96\\% accuracy in identifying malicious URLs and domains.
\\end{itemize}

\\textbf{EchoMind} $|$ \\emph{TypeScript, React, AI Telemetry} \\hfill \\href{https://github.com/shreya-roy1/EchoMind}{Code}
\\begin{itemize}
    \\item Built interactive conversational platform with low-latency client rendering.
\\end{itemize}

\\section{Education}
\\textbf{Bachelor of Technology in Computer Science \\& Engineering} \\hfill \\textbf{2022 -- 2026}

\\end{document}
`;

export const TEMPLATES = [
  { key: 'jake-resume', name: "Jake's Resume (Industry Standard ATS)", template: JAKE_RESUME_TEMPLATE },
  { key: 'modern-tech', name: 'Modern Tech (Indigo Accent)', template: MODERN_TECH_TEMPLATE },
];
