/* Initialize mobile navigation menu toggle and smooth scroll behavior */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navMenu) {
        navMenu.classList.remove('active');
      }
    });
  });
}

/* Initialize intersection observer for fade-in animations on scroll */
function initScrollAnimation() {
  const animatedElements = document.querySelectorAll('.fade-in-element');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach(function (element) {
      observer.observe(element);
    });
  } else {
    animatedElements.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }
}

/* Validate email address format using standard regular expression pattern */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* Handle contact form validation and display success feedback without backend API call */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formFeedback = document.getElementById('formFeedback');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (formFeedback) {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
    }

    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = '[Name is required]';
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = '[Email is required]';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) emailError.textContent = '[Please enter a valid email address]';
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = '[Message is required]';
      isValid = false;
    }

    if (isValid) {
      if (formFeedback) {
        formFeedback.classList.add('success');
        formFeedback.textContent = '[Thank you! Your message has been sent successfully.]';
      }
      contactForm.reset();
    }
  });
}

/* Run initializations when the DOM content is fully loaded */
document.addEventListener('DOMContentLoaded', function () {
  initNavigation();
  initScrollAnimation();
  initContactForm();
});
