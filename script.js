// Restore particles.js interactive background and custom cursor follow animation

// Initialize particles.js
window.addEventListener('DOMContentLoaded', () => {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 800 } },
        color: { value: ['#4d7cff', '#6e42c1', '#00c896'] },
        shape: { type: 'circle' },
        opacity: { value: 0.6, random: true, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.8 } },
        line_linked: { enable: true, distance: 150, color: '#7ba0ff', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'repulse' },
          resize: true
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.8 } },
          repulse: { distance: 250, duration: 0.4 },
          bubble: { distance: 200, size: 8, duration: 2, opacity: 0.6 }
        }
      },
      retina_detect: true
    });
  }

  // Custom cursor disabled as requested
  document.querySelectorAll('.cursor-dot, .cursor-outline').forEach(el => el.remove());

  // Header shrink on scroll
  const header = document.querySelector('header');
  const onScroll = () => {
    if (!header) return;
    const scrolled = window.scrollY > 10;
    header.classList.toggle('scrolled', scrolled);
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('light-mode')) {
      icon?.classList.replace('fa-moon', 'fa-sun');
    } else {
      icon?.classList.replace('fa-sun', 'fa-moon');
    }
  });

  // Mobile nav toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  menuToggle?.addEventListener('click', () => {
    nav?.classList.toggle('active');
  });

  // Close mobile nav when a nav-link is clicked (better UX)
  document.querySelectorAll('nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav?.classList.contains('active')) {
        nav.classList.remove('active');
      }
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const highlightNav = () => {
    let currentId = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = sec.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const id = href.startsWith('#') ? href.substring(1) : '';
      link.classList.toggle('active', id === currentId);
    });
  };
  document.addEventListener('scroll', highlightNav);
  highlightNav();

  // Reveal animations for sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeIn 0.6s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section').forEach(sec => observer.observe(sec));

  // Avatar image fallback: hide placeholder if image loads; show if image fails
  const avatarImg = document.querySelector('.avatar-img');
  const avatarPlaceholder = document.querySelector('.avatar-placeholder');
  if (avatarImg) {
    const hidePlaceholder = () => {
      if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
    };
    const showPlaceholder = () => {
      if (avatarPlaceholder) avatarPlaceholder.style.display = 'flex';
    };
    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      hidePlaceholder();
    } else {
      // wait for events
      avatarImg.addEventListener('load', hidePlaceholder);
      avatarImg.addEventListener('error', showPlaceholder);
    }
  }

  // Scroll-to-top button behavior
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const onScrollForTop = () => {
    const show = window.scrollY > 300;
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', show);
  };
  document.addEventListener('scroll', onScrollForTop);
  onScrollForTop();
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Formspree AJAX submit handling
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm) return;
    if (formStatus) {
      formStatus.textContent = 'Sending...';
      formStatus.className = 'form-status sending';
    }
    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: contactForm.method || 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        contactForm.reset();
        if (formStatus) {
          formStatus.textContent = 'Thanks! Your message has been sent.';
          formStatus.className = 'form-status success';
        }
      } else {
        let message = 'Oops, something went wrong. Please try again.';
        try {
          const json = await res.json();
          if (json && json.errors) {
            message = json.errors.map((e) => e.message).join(', ');
          }
        } catch {}
        if (formStatus) {
          formStatus.textContent = message;
          formStatus.className = 'form-status error';
        }
      }
    } catch (err) {
      if (formStatus) {
        formStatus.textContent = 'Network error. Please try again later.';
        formStatus.className = 'form-status error';
      }
    }
  });
});