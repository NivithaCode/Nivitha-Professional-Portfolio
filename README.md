# Nivitha S - Developer Portfolio Website

A clean, minimal, premium single-page portfolio website for **Nivitha S** (Aspiring Software Developer | Java, Python & Web Skills).

Built with semantic HTML5, modern vanilla CSS3, and lightweight vanilla JavaScript. **No frameworks, no build step, no npm dependencies.** It opens directly in any browser and is 100% ready for GitHub Pages or Netlify.

---

## 🌟 Key Features

- **Single Page Architecture**: 10 continuous sections with smooth scrolling anchor navigation (`#home`, `#about`, `#skills`, `#projects`, `#experience`, `#education`, `#certifications`, `#achievements`, `#contact`).
- **Dark Theme by Default with Light/Dark Mode Toggle**: Persistent theme state with `localStorage` and system color scheme support.
- **Modern Design Language**: Charcoal/navy background, electric teal & cyan accents, glassmorphism cards (`backdrop-filter: blur`), subtle borders and glowing hover states.
- **Typing Animation**: Dynamic hero typing effect rotating through roles ("Web Developer", "Java Programmer", "Problem Solver").
- **Sticky Navbar with ScrollSpy**: Automatically tracks active section and highlights corresponding nav links while scrolling.
- **Mobile Responsive & Accessible**: Custom animated hamburger drawer, touch-friendly tap targets, semantic HTML elements, ARIA attributes, and SEO meta tags.
- **Interactive Timeline**: Clean chronological timeline for Experience/Training and Education milestones.
- **Functional Contact Form & Links**: Directly triggers `mailto:` client with subject and message prefilled, plus direct GitHub, LinkedIn, and Email cards.
- **Floating Back-to-Top Button**: Appears smoothly as user scrolls down.

---

## 📁 Project Structure

```
nivitha-portfolio/
│
├── index.html                  # Main continuous single-page markup with comments for every section
├── style.css                   # Custom CSS with design tokens, glassmorphism, responsive queries
├── script.js                   # Vanilla JS (Theme switch, ScrollSpy, typing effect, mobile nav)
├── assets/
│   ├── avatar-placeholder.svg  # Crisp modern SVG avatar placeholder
│   └── resume-placeholder.pdf  # Sample resume PDF placeholder
└── README.md                   # Documentation & deployment guide
```

---

## ✏️ How to Customize

All files include clear HTML comments marking where you can update your details:

1. **Profile Picture**:
   - Place your real photo (e.g. `my-photo.jpg`) inside the `assets/` folder.
   - Open [index.html](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/nivitha-portfolio/index.html) and update line 125:
     ```html
     <img src="assets/my-photo.jpg" alt="Nivitha S" class="avatar-img" width="340" height="340">
     ```
2. **Resume PDF**:
   - Save your official resume PDF as `Nivitha_S_Resume.pdf` inside `assets/`.
   - Update line 79 in [index.html](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/nivitha-portfolio/index.html):
     ```html
     <a href="assets/Nivitha_S_Resume.pdf" download="Nivitha_S_Resume.pdf" class="btn btn-secondary">
     ```
3. **Project Live Demo Link**:
   - In [index.html](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/nivitha-portfolio/index.html), search for `demo-placeholder-btn` and update `href="#"` to your actual live hosted project URL.

---

## 🚀 Deployment Instructions

### Option 1: GitHub Pages (Recommended - 100% Free)

1. Create a new repository on [GitHub](https://github.com/new) named `nivitha-portfolio` (or `NivithaCode.github.io`).
2. In your local terminal, navigate to this directory:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/NivithaCode/nivitha-portfolio.git
   git push -u origin main
   ```
3. On GitHub, go to your repository **Settings** > **Pages** (under the "Code and automation" sidebar).
4. Under **Source**, choose **Deploy from a branch**.
5. Set the branch to `main` and folder to `/ (root)`, then click **Save**.
6. Within 1–2 minutes, your website will be live at:
   `https://NivithaCode.github.io/nivitha-portfolio/`

---

### Option 2: Netlify (Drag & Drop in 30 Seconds)

1. Go to [Netlify](https://app.netlify.com/) and log in (or sign up with GitHub).
2. Go to the **Sites** tab.
3. Drag and drop the `nivitha-portfolio` folder directly into the designated Netlify upload box.
4. Netlify will instantly publish your site with a live preview URL and free SSL!
5. (Optional) In **Site configuration** > **Change site name**, customize the domain (e.g. `nivitha-portfolio.netlify.app`).
