// ─── 3D Particle Background ───
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const color1 = new THREE.Color('#6366f1');
    const color2 = new THREE.Color('#ec4899');
    const color3 = new THREE.Color('#06b6d4');

    for (let i = 0; i < count; i++) {
        positions[i*3] = (Math.random() - 0.5) * 30;
        positions[i*3+1] = (Math.random() - 0.5) * 30;
        positions[i*3+2] = (Math.random() - 0.5) * 30;
        const c = Math.random();
        const col = c < 0.33 ? color1 : c < 0.66 ? color2 : color3;
        colors[i*3] = col.r;
        colors[i*3+1] = col.g;
        colors[i*3+2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 12;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.__toggleParticles = function(isLight) {
        material.opacity = isLight ? 0.3 : 0.8;
    };
})();

// ─── Typing Effect ───
(function() {
    const el = document.getElementById('typed-text');
    const cursor = document.getElementById('cursor');
    if (!el) return;
    const words = ['Web Developer', 'Designer', 'Freelancer', 'Next.js Developer'];
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = words[wordIdx];
        if (isDeleting) {
            el.textContent = current.substring(0, charIdx--);
            if (charIdx < 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, 40);
        } else {
            el.textContent = current.substring(0, charIdx++);
            if (charIdx > current.length) {
                isDeleting = true;
                setTimeout(type, 1500);
                return;
            }
            setTimeout(type, 80);
        }
    }
    type();
})();

// ─── Navbar Scroll ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── Active Nav Highlight ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            active?.classList.add('active');
        }
    });
}, { threshold: 0.3, rootMargin: '-60px 0px 0px 0px' });
sections.forEach(s => navObserver.observe(s));

// ─── Back to Top ───
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (!backBtn) return;
    if (window.scrollY > 400) {
        backBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
        backBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
        backBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
        backBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
    }
});
backBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Mobile Menu ───
document.getElementById('menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.remove('hidden');
});
document.getElementById('close-menu')?.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('hidden');
});
document.querySelectorAll('.close-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// ─── Dark / Light Mode ───
let isLight = false;
const modeIcon = document.getElementById('mode-icon');
document.getElementById('toggle-mode')?.addEventListener('click', () => {
    isLight = !isLight;
    document.body.classList.toggle('light-mode', isLight);
    modeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    if (window.__toggleParticles) window.__toggleParticles(isLight);
});

// ─── 3D Tilt Effect on Cards ───
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
});

// ─── Reveal on Scroll ───
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

// ─── Skill Bar Animation ───
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const pct = fill.closest('.skill-bar').previousElementSibling.querySelector('.skill-pct');
            const width = parseInt(pct.textContent);
            fill.style.width = width + '%';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-bar-fill').forEach(el => {
    skillObserver.observe(el);
});

// ─── Contact Form ───
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    btn.disabled = true;
    fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        headers: { 'Accept': 'application/json' }
    }).then(r => r.json()).then(data => {
        if (data.ok) {
            btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
            this.reset();
        } else {
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal';
        }
    }).catch(() => {
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
    }).finally(() => {
        setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 3000);
    });
});
