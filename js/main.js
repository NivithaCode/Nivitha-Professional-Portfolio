/**
 * PORTFOLIO SCRIPT - NIVITHA S
 * Design Direction: "3D-Driven Editorial Tech"
 * Vanilla JavaScript + Three.js + GSAP ScrollTrigger (UMD CDN / file:// compatible)
 * Zero frameworks. Pure browser standards with defensive fallbacks.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Page-Load 3D Intro (< 1.5s)
     ========================================================================== */
  const preloader = document.getElementById('page-preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('is-hidden');
      }, 700);
    });
    // Fallback if load event already fired
    setTimeout(() => {
      if (!preloader.classList.contains('is-hidden')) {
        preloader.classList.add('is-hidden');
      }
    }, 1200);
  }

  /* ==========================================================================
     2. Theme Switcher (Dark Ink #0A0A0C <-> Warm Off-White #FAF7F2)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0A0A0C' : '#FAF7F2');
    }

    // Inform 3D scenes if theme changes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  /* ==========================================================================
     3. Scroll Progress Bar
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ==========================================================================
     4. Custom Desktop Soft Cursor Glow (Pointer: Fine Only)
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (cursorGlow && isFinePointer && !prefersReducedMotion) {
    document.body.classList.add('has-cursor');

    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isMoving) {
        isMoving = true;
        renderCursor();
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
    });

    function renderCursor() {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;

      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        requestAnimationFrame(renderCursor);
      } else {
        isMoving = false;
      }
    }
  }

  /* ==========================================================================
     5. Three.js 3D Hero Scene (Interactive Cluster + Particles)
     ========================================================================== */
  function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    const container = document.getElementById('hero-canvas-container');
    if (!canvas || !container || typeof THREE === 'undefined') return;

    let scene, camera, renderer, mainCluster, particlesMesh;
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    let isHeroVisible = true;
    let animId = null;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
      camera.position.z = 12;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xff8a3d, 1.6);
      dirLight1.position.set(5, 8, 5);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xff5e3a, 1.2);
      dirLight2.position.set(-6, -4, 4);
      scene.add(dirLight2);

      // Main Geometric Cluster Group
      mainCluster = new THREE.Group();
      scene.add(mainCluster);

      // 1. Faceted Icosahedron Core (Translucent Glass + Warm Edge)
      const coreGeo = new THREE.IcosahedronGeometry(2.3, 0);
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0x1f1b18,
        emissive: 0xff8a3d,
        emissiveIntensity: 0.15,
        specular: 0xff8a3d,
        shininess: 80,
        flatShading: true,
        transparent: true,
        opacity: 0.88
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      mainCluster.add(coreMesh);

      // Wireframe overlay for the core
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xff8a3d,
        wireframe: true,
        transparent: true,
        opacity: 0.38
      });
      const wireMesh = new THREE.Mesh(coreGeo, wireMat);
      wireMesh.scale.setScalar(1.002);
      mainCluster.add(wireMesh);

      // 2. Inner Glowing Octahedron
      const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xff5e3a,
        wireframe: true
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      mainCluster.add(innerMesh);

      // 3. Orbiting Torus Ring
      const ringGeo = new THREE.TorusGeometry(3.6, 0.035, 16, 90);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xff8a3d,
        transparent: true,
        opacity: 0.5
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      ringMesh.rotation.y = Math.PI / 6;
      mainCluster.add(ringMesh);

      // 4. Orbiting Small Satellites
      const satGroup = new THREE.Group();
      const satGeo = new THREE.TetrahedronGeometry(0.35, 0);
      const satMat = new THREE.MeshPhongMaterial({
        color: 0xff5e3a,
        flatShading: true,
        shininess: 100
      });

      for (let i = 0; i < 4; i++) {
        const satMesh = new THREE.Mesh(satGeo, satMat);
        const angle = (i / 4) * Math.PI * 2;
        satMesh.position.set(Math.cos(angle) * 3.4, Math.sin(angle) * 2.2, Math.sin(angle) * 1.5);
        satGroup.add(satMesh);
      }
      mainCluster.add(satGroup);

      // 5. Ambient 3D Particle Cloud
      const particleCount = 130;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 18;
        positions[i + 1] = (Math.random() - 0.5) * 14;
        positions[i + 2] = (Math.random() - 0.5) * 12;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xff8a3d,
        size: 0.08,
        transparent: true,
        opacity: 0.6
      });
      particlesMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particlesMesh);

      // Theme Change Listener
      window.addEventListener('themeChanged', (e) => {
        const isLight = e.detail.theme === 'light';
        if (coreMat) {
          coreMat.color.setHex(isLight ? 0xf0e6d6 : 0x1f1b18);
          coreMat.emissiveIntensity = isLight ? 0.08 : 0.15;
        }
      });

      // Mouse Parallax
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = x * 0.45;
        targetY = y * 0.35;
      }, { passive: true });

      // Handle Resize
      window.addEventListener('resize', () => {
        if (!container || !camera || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      });

      // Pause when off-screen
      const heroSection = document.getElementById('home');
      if (heroSection && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          isHeroVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        obs.observe(heroSection);
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) isHeroVisible = false;
        else if (heroSection) {
          const rect = heroSection.getBoundingClientRect();
          isHeroVisible = rect.bottom > 0 && rect.top < window.innerHeight;
        }
      });

      // Animation Loop
      function animate() {
        animId = requestAnimationFrame(animate);

        if (!isHeroVisible || prefersReducedMotion) return;

        // Smooth cursor lerp
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Cluster rotation
        mainCluster.rotation.y += 0.004;
        mainCluster.rotation.x += 0.002;

        innerMesh.rotation.y -= 0.006;
        ringMesh.rotation.z += 0.003;
        satGroup.rotation.y += 0.005;

        // Parallax reaction
        mainCluster.position.x = mouseX * 2.2;
        mainCluster.position.y = mouseY * 1.8;
        camera.position.x = mouseX * 0.8;
        camera.position.y = mouseY * 0.6;
        camera.lookAt(0, 0, 0);

        // Gentle particle drift
        if (particlesMesh) {
          particlesMesh.rotation.y += 0.0006;
        }

        renderer.render(scene, camera);
      }

      animate();

    } catch (err) {
      console.warn('Three.js hero initialized with fallback:', err);
    }
  }

  initThreeHero();

  /* ==========================================================================
     6. Typing Animation in Hero
     ========================================================================== */
  const typedTextEl = document.getElementById('typed-text');
  const phrases = [
    'Web Developer',
    'Java Programmer',
    'Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 50;
  const delayBetweenPhrases = 1900;

  function typeEffect() {
    if (!typedTextEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      currentSpeed = delayBetweenPhrases;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      currentSpeed = 380;
    }

    setTimeout(typeEffect, currentSpeed);
  }

  typeEffect();

  /* ==========================================================================
     7. Interactive 3D Skill Sphere / Cloud Canvas
     ========================================================================== */
  function initSkillSphere() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = 170;

    const skillsData = [
      { text: 'Java', category: 'languages', color: '#FF8A3D' },
      { text: 'Python', category: 'languages', color: '#FFB347' },
      { text: 'JavaScript', category: 'languages', color: '#F7DF1E' },
      { text: 'HTML5', category: 'frontend', color: '#FF5E3A' },
      { text: 'CSS3', category: 'frontend', color: '#4DA6FF' },
      { text: 'React.js', category: 'frontend', color: '#61DAFB' },
      { text: 'Bootstrap', category: 'frontend', color: '#9B51E0' },
      { text: 'Data Structures', category: 'languages', color: '#FF8A3D' },
      { text: 'Critical Thinking', category: 'soft', color: '#9BD1B0' },
      { text: 'Problem Solving', category: 'soft', color: '#9BD1B0' },
      { text: 'Collaboration', category: 'soft', color: '#9BD1B0' },
      { text: 'Leadership', category: 'soft', color: '#9BD1B0' },
      { text: 'Teamwork', category: 'soft', color: '#9BD1B0' },
      { text: 'LeetCode', category: 'languages', color: '#FFA116' },
      { text: 'Algorithms', category: 'languages', color: '#FF8A3D' }
    ];

    // Compute spherical coordinates using Fibonacci distribution
    const tags = skillsData.map((item, i) => {
      const phi = Math.acos(-1 + (2 * i) / skillsData.length);
      const theta = Math.sqrt(skillsData.length * Math.PI) * phi;
      return {
        ...item,
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        screenX: 0,
        screenY: 0,
        scale: 1,
        alpha: 1
      };
    });

    let angleX = 0.0025;
    let angleY = 0.0025;
    let activeFilter = 'all';
    let isMouseOver = false;

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.skill-tab-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeFilter = btn.getAttribute('data-filter') || 'all';
      });
    });

    // Mouse Interaction for Sphere Rotation
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;
      angleY = (mouseX / width) * 0.02;
      angleX = -(mouseY / height) * 0.02;
      isMouseOver = true;
    });

    canvas.addEventListener('mouseleave', () => {
      angleX = 0.0025;
      angleY = 0.0025;
      isMouseOver = false;
    });

    function rotateSphere() {
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      tags.forEach(tag => {
        // Rotate Y
        const x1 = tag.x * cosY - tag.z * sinY;
        const z1 = tag.z * cosY + tag.x * sinY;

        // Rotate X
        const y2 = tag.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + tag.y * sinX;

        tag.x = x1;
        tag.y = y2;
        tag.z = z2;

        const fov = 340;
        tag.scale = fov / (fov + tag.z);
        tag.alpha = Math.max(0.2, (tag.z + radius) / (2 * radius));
        tag.screenX = width / 2 + tag.x * tag.scale;
        tag.screenY = height / 2 + tag.y * tag.scale;
      });
    }

    function renderSphere() {
      ctx.clearRect(0, 0, width, height);

      rotateSphere();

      // Sort by Z for proper depth rendering
      tags.sort((a, b) => a.z - b.z);

      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      tags.forEach(tag => {
        const matches = activeFilter === 'all' || tag.category === activeFilter;
        const fontSize = Math.max(11, 14 * tag.scale);

        ctx.font = `600 ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (matches) {
          ctx.fillStyle = tag.color;
          ctx.globalAlpha = Math.min(1, tag.alpha + 0.3);
          // Subtle glow on matching items
          ctx.shadowColor = tag.color;
          ctx.shadowBlur = 8 * tag.scale;
        } else {
          ctx.fillStyle = isLight ? '#A09D98' : '#45434A';
          ctx.globalAlpha = 0.25;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(tag.text, tag.screenX, tag.screenY);
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderSphere);
    }

    renderSphere();
  }

  initSkillSphere();

  /* ==========================================================================
     8. 3D Tilt Micro-interactions on [data-tilt] Elements
     ========================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (isFinePointer && !prefersReducedMotion) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -7;
        const rotateY = ((cardX - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;

        // Update sheen position
        card.style.setProperty('--sheen-x', `${cardX}px`);
        card.style.setProperty('--sheen-y', `${cardY}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  /* ==========================================================================
     9. Timeline Dynamic Scroll Progress Line Fill
     ========================================================================== */
  const timelineContainer = document.getElementById('timeline-container');
  const timelineFill = document.getElementById('timeline-fill');

  function updateTimelineProgress() {
    if (!timelineContainer || !timelineFill) return;
    const rect = timelineContainer.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.top <= windowH * 0.7 && rect.bottom >= 0) {
      const totalH = rect.height;
      const scrolled = (windowH * 0.7) - rect.top;
      const pct = Math.min(100, Math.max(0, (scrolled / totalH) * 100));
      timelineFill.style.height = `${pct}%`;
    } else if (rect.top > windowH * 0.7) {
      timelineFill.style.height = '0%';
    } else if (rect.bottom < 0) {
      timelineFill.style.height = '100%';
    }
  }

  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  updateTimelineProgress();

  /* ==========================================================================
     10. Education 3D Stacked-Card Carousel
     ========================================================================== */
  const eduCards = document.querySelectorAll('.edu-carousel-card');
  const eduDots = document.querySelectorAll('.carousel-dot');
  const eduPrevBtn = document.getElementById('edu-prev');
  const eduNextBtn = document.getElementById('edu-next');
  let currentEduIndex = 0;

  function updateEduCarousel(index) {
    currentEduIndex = (index + eduCards.length) % eduCards.length;

    eduCards.forEach((card, idx) => {
      card.classList.remove('is-active', 'is-prev', 'is-next');
      if (idx === currentEduIndex) {
        card.classList.add('is-active');
      } else if (idx === (currentEduIndex - 1 + eduCards.length) % eduCards.length) {
        card.classList.add('is-prev');
      } else {
        card.classList.add('is-next');
      }
    });

    eduDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentEduIndex);
    });
  }

  if (eduPrevBtn && eduNextBtn) {
    eduPrevBtn.addEventListener('click', () => updateEduCarousel(currentEduIndex - 1));
    eduNextBtn.addEventListener('click', () => updateEduCarousel(currentEduIndex + 1));

    eduDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
        updateEduCarousel(slideIndex);
      });
    });

    // Keyboard Arrow navigation for carousel
    window.addEventListener('keydown', (e) => {
      const carouselEl = document.getElementById('edu-carousel');
      if (!carouselEl) return;
      const rect = carouselEl.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInView) {
        if (e.key === 'ArrowLeft') updateEduCarousel(currentEduIndex - 1);
        if (e.key === 'ArrowRight') updateEduCarousel(currentEduIndex + 1);
      }
    });
  }

  /* ==========================================================================
     11. Achievement Animated Count-Up Numbers
     ========================================================================== */
  const countElements = document.querySelectorAll('.achievement-counter-number[data-count]');

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const hasPlus = el.textContent.includes('+');
          const hasHash = el.textContent.includes('#');

          let start = 0;
          const duration = 1200;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              start = target;
              clearInterval(timer);
            }
            let display = Math.floor(start).toString();
            if (hasHash) display = '#' + display;
            if (hasPlus) display = display + '+';
            el.textContent = display;
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    countElements.forEach(el => countObserver.observe(el));
  }

  /* ==========================================================================
     12. Animated Proficiency Bars Filling on Scroll
     ========================================================================== */
  const profBars = document.querySelectorAll('.prof-bar-fill');

  if ('IntersectionObserver' in window) {
    const profObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width') || '85%';
          bar.style.width = width;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    profBars.forEach(bar => profObserver.observe(bar));
  } else {
    profBars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width') || '85%';
    });
  }

  /* ==========================================================================
     13. Mobile Navigation & Hamburger Menu
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      hamburgerBtn.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          hamburgerBtn.classList.remove('is-active');
          navMenu.classList.remove('is-open');
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        if (navMenu.classList.contains('is-open')) {
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          hamburgerBtn.classList.remove('is-active');
          navMenu.classList.remove('is-open');
        }
      }
    });
  }

  /* ==========================================================================
     14. ScrollSpy: Active Section Highlighting
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + 130;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
  updateActiveNavOnScroll();

  /* ==========================================================================
     15. GSAP ScrollTrigger or IntersectionObserver Scroll-Reveal
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    revealElements.forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            onEnter: () => el.classList.add('is-revealed')
          }
        }
      );
    });
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     16. Floating Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     17. Contact Form Handling (mailto generation + field validation)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      let isValid = true;

      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        nameInput.parentElement.classList.remove('has-error');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        emailInput.parentElement.classList.remove('has-error');
      }

      if (!subjectInput.value.trim()) {
        subjectInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        subjectInput.parentElement.classList.remove('has-error');
      }

      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      } else {
        messageInput.parentElement.classList.remove('has-error');
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please fill out all required fields with valid details.';
        }
        return;
      }

      // Construct mailto link
      const recipient = 'nivithasuresh6@gmail.com';
      const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()} - from ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `Name: ${nameInput.value.trim()}\n` +
        `Email: ${emailInput.value.trim()}\n\n` +
        `Message:\n${messageInput.value.trim()}`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Opening your email client to send your message to Nivitha S... Thank you!';
      }

      window.location.href = mailtoUrl;

      setTimeout(() => {
        contactForm.reset();
      }, 1500);
    });

    ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          input.parentElement.classList.remove('has-error');
          if (formFeedback && formFeedback.classList.contains('error')) {
            formFeedback.style.display = 'none';
          }
        });
      }
    });
  }

});