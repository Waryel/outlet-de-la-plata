/* ============================================================
   OUTLET DE LA PLATA — Parallax divisor
   Cadena escultórica de anillos de plata 925.
   ============================================================ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('parallax-canvas');
if (!canvas) throw new Error('parallax-canvas no encontrado');

const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  28,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  100
);
camera.position.set(0, 0, 9);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

/* Material plata */
const silverMat = new THREE.MeshPhysicalMaterial({
  color: 0xE5E4E2,
  metalness: 1,
  roughness: 0.16,
  envMapIntensity: 1.3,
});

/* Cadena de 9 anillos entrelazados */
const chain = new THREE.Group();
const ringCount = 9;
const spacing = 0.9;

for (let i = 0; i < ringCount; i++) {
  const r = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.055, 32, 96),
    silverMat
  );
  r.position.x = (i - (ringCount - 1) / 2) * spacing;
  r.rotation.x = Math.PI / 2;
  r.rotation.z = (i % 2) * (Math.PI / 2);
  chain.add(r);
}
scene.add(chain);

/* Luces */
scene.add(new THREE.DirectionalLight(0xffffff, 2.0).translateX(-6));
scene.add(new THREE.DirectionalLight(0xE5E4E2, 1.2).translateX(6).translateY(-3));

/* Luz puntual dorada */
const goldLight = new THREE.PointLight(0xD4AF7A, 0.8, 14);
goldLight.position.set(0, 2, 3);
scene.add(goldLight);

/* Parallax con scroll */
let scrollY = 0;
let targetScroll = 0;

window.addEventListener('scroll', () => {
  const rect = canvas.getBoundingClientRect();
  targetScroll = -rect.top * 0.08;
}, { passive: true });

/* Solo renderiza cuando es visible */
let visible = false;
const obs = new IntersectionObserver(
  ([e]) => { visible = e.isIntersecting; },
  { threshold: 0 }
);
obs.observe(canvas);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  if (!visible) return;

  const t = clock.getElapsedTime();
  scrollY += (targetScroll - scrollY) * 0.06;

  if (!prefersReducedMotion) {
    chain.rotation.z = Math.sin(t * 0.1) * 0.05 + scrollY * 0.15;
    chain.rotation.y = scrollY * 0.4;
    chain.position.y = scrollY * 0.3;
  }

  renderer.render(scene, camera);
}
animate();

/* Resize */
let raf;
window.addEventListener('resize', () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}, { passive: true });