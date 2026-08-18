document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const allLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const form = document.getElementById('contact-form');
  const langToggle = document.getElementById('lang-toggle');

  let translations = {};
  let currentLang = localStorage.getItem('lang') === 'es' ? 'es' : 'en';

  async function loadTranslations() {
    try {
      const res = await fetch('data/translations.json');
      translations = await res.json();
      applyTranslations(currentLang);
    } catch (err) {
      console.error('Error loading translations:', err);
    }
  }

  function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key] && translations[key][lang]) {
        el.innerHTML = translations[key][lang];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[key] && translations[key][lang]) {
        el.placeholder = translations[key][lang];
      }
    });
    const cvLink = document.getElementById('cv-link');
    if (cvLink) {
      cvLink.href = lang === 'es'
        ? 'https://drive.google.com/file/d/1f8SRUOa5fnHLrU_u4GSBYYYCQ_5SyfLI/view?usp=sharing'
        : 'https://drive.google.com/file/d/1CHxCLq-ZYE1xVv3JFR_Th_CoHBLo0Dvc/view?usp=sharing';
    }
    if (langToggle) {
      langToggle.textContent = lang === 'es' ? 'ES' : 'EN';
    }
  }

  function reloadPortfolioData() {
    loadPortfolioData(currentLang);
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      localStorage.setItem('lang', currentLang);
      applyTranslations(currentLang);
      reloadPortfolioData();
    });
  }

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    let scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        allLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      const errMsgs = {
        en: { name: 'Please enter your name.', email: 'Please enter a valid email.', message: 'Please write a message.' },
        es: { name: 'Por favor, ingresá tu nombre.', email: 'Por favor, ingresá un email válido.', message: 'Por favor, escribí un mensaje.' }
      };
      const msg = errMsgs[currentLang] || errMsgs.en;

      if (!name) { alert(msg.name); return; }
      if (!email || !emailRegex.test(email)) { alert(msg.email); return; }
      if (!message) { alert(msg.message); return; }

      const label = currentLang === 'es' ? 'Contacto desde portfolio' : 'Portfolio contact';
      const subject = encodeURIComponent(`${label} - ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:fabricioporcelli@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  loadTranslations();
  reloadPortfolioData();
});

async function loadPortfolioData(lang) {
  try {
    const res = await fetch('data/data.json');
    const data = await res.json();
    renderSkills(data.skills, lang || 'en');
    renderProjects(data.projects, lang || 'en');
  } catch (err) {
    console.error('Error loading portfolio data:', err);
  }
}

function renderSkills(skillsData, lang) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  const categories = skillsData.categories || [];

  grid.innerHTML = categories.map(cat => {
    const catName = cat.name[lang] || cat.name.en;
    const items = cat.items.map(item =>
      `<span class="skill-tag"><span class="skill-dot" style="color: ${cat.color}">●</span> ${item}</span>`
    ).join('');
    return `
      <div class="skill-category">
        <h4 class="skill-category-title">${catName}</h4>
        <div class="skill-items">${items}</div>
      </div>
    `;
  }).join('');
}

function renderProjects(projects, lang) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map(p => {
    const desc = typeof p.description === 'object' ? (p.description[lang] || p.description.en) : p.description;

    const githubLink = p.githubUrl
      ? `<a href="${p.githubUrl}" class="project-ext-link" title="GitHub" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>`
      : '';

    const externalLink = p.externalUrl && p.externalUrl !== '#'
      ? `<a href="${p.externalUrl}" class="project-ext-link" title="External link" aria-label="External link" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>`
      : '';

    const tags = p.tags.map(t => `<li class="project-tag">${t}</li>`).join('');

    const workingBadge = p.working
      ? `<span class="project-working"><span class="working-dot"></span>working</span>`
      : '';

    return `
      <article class="project-card">
        <div class="project-header">
          <svg class="project-folder" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          ${workingBadge}
          <div class="project-ext-links">
            ${githubLink}
            ${externalLink}
          </div>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${desc}</p>
        <ul class="project-tags">${tags}</ul>
      </article>
    `;
  }).join('');
}
