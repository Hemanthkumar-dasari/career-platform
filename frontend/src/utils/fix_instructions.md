Fix these 3 issues:

1. DASHBOARD - Add a contact form section at the bottom with fields: Name, Email, Message and a Send button. Style it consistently with the rest of the dashboard (dark theme, tailwind).

2. PAGE STATE LOSS - When navigating between pages, the generated results (learning paths, project ideas, resume analysis, interview) get wiped. Fix this by lifting the state up to App.jsx or using a simple React context to persist each page's last result in memory for the duration of the session (no localStorage needed).

3. SLOW RESPONSE - Add streaming support to the LLM service. Use anthropic client's stream() method so responses stream token by token to the frontend. Update the relevant API endpoints and frontend pages to handle streaming (use fetch with ReadableStream instead of axios for streaming endpoints).

4. DASHBOARD REDESIGN - Make the dashboard visually stunning. Add:
- A hero section with a gradient welcome banner showing the user's name
- Animated gradient cards for each feature (Learning Paths, Project Ideas, Resume Analyzer, Interview Prep) with hover effects
- Stats section showing counts (paths generated, resumes analyzed, interviews done)
- Modern glassmorphism card style with subtle borders and shadows
- Smooth fade-in animations on load
- Overall dark theme with blue/purple gradient accents
Make it look like a premium SaaS product dashboard.