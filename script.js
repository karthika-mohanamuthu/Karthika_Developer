// Reveal sections as they enter the viewport
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

// Reading progress and current year
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
}, { passive: true });
document.getElementById('year').textContent = new Date().getFullYear();

// Subtle 3D pointer tilt on the portrait
const portrait = document.querySelector('.portrait-frame');
const visual = document.querySelector('.hero-visual');
if (window.matchMedia('(pointer:fine)').matches) {
  visual.addEventListener('mousemove', (event) => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    portrait.style.transform = `rotateY(${x * 12 - 5}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
  });
  visual.addEventListener('mouseleave', () => portrait.style.transform = '');
}

// Three.js floating particle field — decorative enhancement, with graceful fallback
if (window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 100);
  camera.position.z = 18;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.48';
  document.body.prepend(renderer.domElement);
  const count = 170;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - .5) * 38;
    positions[i*3+1] = (Math.random() - .5) * 25;
    positions[i*3+2] = (Math.random() - .5) * 18;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xb99aff, size: .035, transparent: true, opacity: .7 });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  let mouseX = 0, mouseY = 0;
  window.addEventListener('pointermove', e => {
    mouseX = (e.clientX / window.innerWidth - .5) * .35;
    mouseY = (e.clientY / window.innerHeight - .5) * .25;
  }, { passive: true });
  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += .00035;
    particles.rotation.x += .00015;
    camera.position.x += (mouseX - camera.position.x) * .015;
    camera.position.y += (-mouseY - camera.position.y) * .015;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
