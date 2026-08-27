import React, { useState, useEffect } from "react";
import SmoothScroll from "./components/scroll/SmoothScroll";
import ElasticCursor from "./components/cursor/ElasticCursor";
import ParticlesBackground from "./components/background/ParticlesBackground";
import Spline3DBackground from "./components/background/Spline3DBackground";

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [bgMode, setBgMode] = useState<"particles" | "spline">("particles");

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize IntersectionObserver for smooth fade-in-on-scroll animations
  useEffect(() => {
    const animatedElements = document.querySelectorAll(".fade-in-element");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        { threshold: 0.12 }
      );

      animatedElements.forEach((element) => observer.observe(element));
      return () => observer.disconnect();
    } else {
      animatedElements.forEach((element) => element.classList.add("is-visible"));
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) newErrors.name = "[Name is required]";
    if (!formData.email.trim()) {
      newErrors.email = "[Email is required]";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "[Please enter a valid email address]";
    }
    if (!formData.message.trim()) newErrors.message = "[Message is required]";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFeedback("[Thank you! Your message has been sent successfully.]");
      setFormData({ name: "", email: "", message: "" });
    } else {
      setFeedback(null);
    }
  };

  return (
    <SmoothScroll duration={1.5}>
      {/* Elastic Fluid Jelly Cursor */}
      <ElasticCursor hoverClassName="cursor-can-hover" noCursorAttribute="data-no-custom-cursor" />

      {/* Dynamic Interactive Background */}
      {bgMode === "particles" ? (
        <ParticlesBackground quantity={50} staticity={35} ease={40} />
      ) : (
        <Spline3DBackground sceneUrl="/assets/skills-keyboard.spline" />
      )}

      {/* Background Switcher Controller */}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 p-1.5 rounded-full text-xs font-semibold shadow-2xl">
        <button
          onClick={() => setBgMode("particles")}
          className={`cursor-can-hover px-3 py-1.5 rounded-full transition-all ${
            bgMode === "particles"
              ? "bg-indigo-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ✨ 2D Particles
        </button>
        <button
          onClick={() => setBgMode("spline")}
          className={`cursor-can-hover px-3 py-1.5 rounded-full transition-all ${
            bgMode === "spline"
              ? "bg-indigo-600 text-white shadow"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🎹 3D Keyboard Scene
        </button>
      </div>

      {/* Navigation bar section */}
      <header className="navbar-header">
        <nav className="navbar">
          <a href="#hero" className="nav-brand cursor-can-hover">
            Nitin
          </a>
          <button
            className="nav-toggle cursor-can-hover"
            id="navToggle"
            aria-label="Toggle navigation menu"
            onClick={() => setNavOpen(!navOpen)}
          >
            &#9776;
          </button>
          <ul className={`nav-menu ${navOpen ? "active" : ""}`} id="navMenu">
            <li>
              <a href="#hero" className="nav-link cursor-can-hover" onClick={() => setNavOpen(false)}>
                [Home]
              </a>
            </li>
            <li>
              <a href="#about" className="nav-link cursor-can-hover" onClick={() => setNavOpen(false)}>
                [About Me]
              </a>
            </li>
            <li>
              <a href="#skills" className="nav-link cursor-can-hover" onClick={() => setNavOpen(false)}>
                [Skills]
              </a>
            </li>
            <li>
              <a href="#projects" className="nav-link cursor-can-hover" onClick={() => setNavOpen(false)}>
                [Projects]
              </a>
            </li>
            <li>
              <a href="#education" className="nav-link cursor-can-hover" onClick={() => setNavOpen(false)}>
                [Education]
              </a>
            </li>
            <li>
              <a href="#contact" className="nav-link cursor-can-hover" onClick={() => setNavOpen(false)}>
                [Contact]
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero section */}
        <section id="hero" className="hero-section fade-in-element">
          <div className="container hero-content">
            <h1 className="hero-name">Nitin</h1>
            <h2 className="hero-title">[Your Title]</h2>
            <p className="hero-intro">
              I am a passionate aspiring software engineer with full stack experience.
            </p>
            <a href="#contact" className="btn btn-primary cursor-can-hover">
              [Get In Touch]
            </a>
          </div>
        </section>

        {/* About Me section */}
        <section id="about" className="about-section fade-in-element">
          <div className="container">
            <h2 className="section-title">[About Me]</h2>
            <div className="about-grid">
              <div className="about-image-wrapper">
                <div className="photo-placeholder cursor-can-hover" role="img" aria-label="Nitin photo placeholder">
                  [Photo Placeholder]
                </div>
              </div>
              <div className="about-text">
                <p className="about-bio">
                  [Insert your professional biography here detailing your background, experience, and what drives you as a software engineer.]
                </p>
                <ul className="about-highlights">
                  <li>[Highlight 1: 3+ years of experience in modern full-stack web development]</li>
                  <li>[Highlight 2: Specialized in clean architecture and responsive frontend design]</li>
                  <li>[Highlight 3: Continuous learner committed to performance and accessibility]</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Skills section */}
        <section id="skills" className="skills-section fade-in-element">
          <div className="container">
            <h2 className="section-title">[Skills]</h2>
            <div className="skills-grid">
              <div className="skill-category cursor-can-hover">
                <h3 className="category-title">[Languages]</h3>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[JavaScript]</span>
                    <span>[90%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[TypeScript]</span>
                    <span>[85%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[HTML5 / CSS3]</span>
                    <span>[95%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>

              <div className="skill-category cursor-can-hover">
                <h3 className="category-title">[Frameworks]</h3>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[React]</span>
                    <span>[88%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "88%" }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[Node.js]</span>
                    <span>[80%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "80%" }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[Express]</span>
                    <span>[82%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "82%" }}></div>
                  </div>
                </div>
              </div>

              <div className="skill-category cursor-can-hover">
                <h3 className="category-title">[Tools]</h3>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[Git / GitHub]</span>
                    <span>[90%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "90%" }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[Docker]</span>
                    <span>[70%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "70%" }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <div className="skill-info">
                    <span>[Webpack / Vite]</span>
                    <span>[85%]</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects section */}
        <section id="projects" className="projects-section fade-in-element">
          <div className="container">
            <h2 className="section-title">[Projects]</h2>
            <div className="projects-grid">
              <article className="project-card cursor-can-hover">
                <h3 className="project-title">[Project Title 1]</h3>
                <p className="project-description">
                  [A web application built to solve real-world tasks with interactive UI elements.]
                  <br />
                  [Features real-time state synchronization and responsive component layout.]
                </p>
                <div className="tech-tags">
                  <span className="tech-pill">[React]</span>
                  <span className="tech-pill">[TypeScript]</span>
                  <span className="tech-pill">[CSS Grid]</span>
                </div>
                <div className="project-links">
                  <a href="#" className="btn-link cursor-can-hover">
                    [Live Demo]
                  </a>
                  <a href="#" className="btn-link cursor-can-hover">
                    [GitHub Repo]
                  </a>
                </div>
              </article>

              <article className="project-card cursor-can-hover">
                <h3 className="project-title">[Project Title 2]</h3>
                <p className="project-description">
                  [A RESTful API dashboard application delivering efficient data queries.]
                  <br />
                  [Designed with structured metrics display and clean user controls.]
                </p>
                <div className="tech-tags">
                  <span className="tech-pill">[Node.js]</span>
                  <span className="tech-pill">[Express]</span>
                  <span className="tech-pill">[JavaScript]</span>
                </div>
                <div className="project-links">
                  <a href="#" className="btn-link cursor-can-hover">
                    [Live Demo]
                  </a>
                  <a href="#" className="btn-link cursor-can-hover">
                    [GitHub Repo]
                  </a>
                </div>
              </article>

              <article className="project-card cursor-can-hover">
                <h3 className="project-title">[Project Title 3]</h3>
                <p className="project-description">
                  [A cross-platform productivity tool focused on fast execution and speed.]
                  <br />
                  [Optimized for accessibility and lightweight rendering across all screens.]
                </p>
                <div className="tech-tags">
                  <span className="tech-pill">[HTML5]</span>
                  <span className="tech-pill">[CSS3]</span>
                  <span className="tech-pill">[Vanilla JS]</span>
                </div>
                <div className="project-links">
                  <a href="#" className="btn-link cursor-can-hover">
                    [Live Demo]
                  </a>
                  <a href="#" className="btn-link cursor-can-hover">
                    [GitHub Repo]
                  </a>
                </div>
              </article>

              <article className="project-card cursor-can-hover">
                <h3 className="project-title">[Project Title 4]</h3>
                <p className="project-description">
                  [An open-source developer utility for automated component generation.]
                  <br />
                  [Includes modular design architecture and automated build scripts.]
                </p>
                <div className="tech-tags">
                  <span className="tech-pill">[TypeScript]</span>
                  <span className="tech-pill">[Vite]</span>
                  <span className="tech-pill">[Git]</span>
                </div>
                <div className="project-links">
                  <a href="#" className="btn-link cursor-can-hover">
                    [Live Demo]
                  </a>
                  <a href="#" className="btn-link cursor-can-hover">
                    [GitHub Repo]
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Education section */}
        <section id="education" className="education-section fade-in-element">
          <div className="container">
            <h2 className="section-title">[Education]</h2>
            <div className="education-timeline">
              <div className="education-card cursor-can-hover">
                <h3 className="education-degree">[Degree Name / Bachelor of Science in Computer Science]</h3>
                <h4 className="education-institution">[Institution Name]</h4>
                <span className="education-dates">[Dates: 2020 - 2024]</span>
              </div>
              <div className="education-card cursor-can-hover">
                <h3 className="education-degree">[Certification / Full-Stack Web Development]</h3>
                <h4 className="education-institution">[Institution Name / Certification Provider]</h4>
                <span className="education-dates">[Dates: 2023]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact form section */}
        <section id="contact" className="contact-section fade-in-element">
          <div className="container">
            <h2 className="section-title">[Contact]</h2>
            <form id="contactForm" className="contact-form" onSubmit={handleSubmit} data-no-custom-cursor="true">
              <div className="form-group">
                <label htmlFor="contactName">[Name]</label>
                <input
                  type="text"
                  id="contactName"
                  name="name"
                  placeholder="[Your Full Name]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">[Email]</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  placeholder="[Your Email Address]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="contactMessage">[Message]</label>
                <textarea
                  id="contactMessage"
                  name="message"
                  rows={5}
                  placeholder="[Your Message]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
                {errors.message && <span className="error-msg">{errors.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary cursor-can-hover">
                [Send Message]
              </button>
              {feedback && (
                <div id="formFeedback" className="form-feedback success" aria-live="polite">
                  {feedback}
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer section */}
      <footer className="footer">
        <div className="container footer-content">
          <p className="copyright">&copy; [2026] Nitin. [All rights reserved.]</p>
          <div className="social-links">
            <a href="#" className="social-link cursor-can-hover" aria-label="GitHub">
              [GitHub]
            </a>
            <a href="#" className="social-link cursor-can-hover" aria-label="LinkedIn">
              [LinkedIn]
            </a>
            <a href="#" className="social-link cursor-can-hover" aria-label="Twitter">
              [Twitter / X]
            </a>
          </div>
        </div>
      </footer>
    </SmoothScroll>
  );
}
