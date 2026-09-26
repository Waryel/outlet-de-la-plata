/* ============================================================
   OUTLET DE LA PLATA — Hero 3D
   Anillo de plata 925 interactivo.
   - Gira solo por defecto
   - Click + arrastrar → el usuario toma el control
   - Rueda del ratón → scroll normal de la página
   - Tras 3s sin interacción, retoma el giro automático
   ============================================================ */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ------------------------------------------------------------
   Configuración
   ------------------------------------------------------------ */
const CONFIG = {
  modelPath: '/models/anillo-hero.glb',
  modelScale: 1.6,

  /* Posición del anillo: 0 = centro del canvas.
     El desplazamiento visual a la derecha lo hace el CSS. */
  ringOffsetX: 0.0,
  ringOffsetY: 0.0,

  /* Cámara */
  cameraZ: 6.0,

  /* Orientación inicial del modelo */
  modelRotationX: 0,
  modelRotationY: Math.PI / 2,
  modelRotationZ: 0,

  /* OrbitControls */
  autoRotateSpeed: 1.2,      // velocidad del giro automático (más rápido que antes)
  resumeDelay: 3000,         // ms sin interacción antes de retomar el giro
  rotateSpeed: 0.8,          // sensibilidad al arrastrar

  /* Animación de flotar */
  floatAmplitude: 0.06,
  floatSpeed: 0.8,
};

/* ------------------------------------------------------------
   Detección previa
   ------------------------------------------------------------ */
function canRender3D() {
  if (typeof WebGLRenderingContext === 'undefined') return false;
  const test = document.createElement('canvas');
  const gl =
    test.getContext('webgl2') ||
    test.getContext('webgl') ||
    test.getContext('experimental-webgl');
  if (!gl) return false;
  if (navigator.connection?.saveData === true) return false;
  if (navigator.connection?.effectiveType?.includes('2g')) return false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isSmall = window.innerWidth < 768;
  if (isTouch && isSmall) return false;

  return true;
}

const canvas = document.getElementById('hero-canvas');

if (canvas && !canRender3D()) {
  canvas.classList.add('no-webgl');
  document.documentElement.classList.add('no-3d');
}

if (canvas && canRender3D()) {
  initHero(canvas);
}

/* ============================================================
   Init
   ============================================================ */
function initHero(canvas) {
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Renderer ---------- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  /* ---------- Scene & Camera ---------- */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight || 1,
    0.1,
    100
  );

  /* Cámara centrada mirando al origen */
  camera.position.set(0, 0, CONFIG.cameraZ);

  requestAnimationFrame(() => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  /* ---------- Environment ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;

  /* ---------- Grupo del anillo (centrado) ---------- */
  const group = new THREE.Group();
  group.position.x = CONFIG.ringOffsetX;
  group.position.y = CONFIG.ringOffsetY;
  scene.add(group);

  /* ---------- Material plata 925 ---------- */
  const silverMat = new THREE.MeshPhysicalMaterial({
    color: 0xE5E4E2,
    metalness: 1.0,
    roughness: 0.14,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    reflectivity: 1.0,
    envMapIntensity: 1.4,
  });

  /* ---------- Carga del GLB ---------- */
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

  loader.load(
    CONFIG.modelPath,
    (gltf) => {
      const ring = gltf.scene;

      ring.traverse((child) => {
        if (child.isMesh) {
          child.material = silverMat;
        }
      });

      const box = new THREE.Box3().setFromObject(ring);
      const center = box.getCenter(new THREE.Vector3());
      ring.position.sub(center);

      ring.scale.setScalar(CONFIG.modelScale);
      ring.rotation.x = CONFIG.modelRotationX;
      ring.rotation.y = CONFIG.modelRotationY;
      ring.rotation.z = CONFIG.modelRotationZ;

      group.add(ring);
      group.userData.ring = ring;

      console.debug('[3D] Anillo GLB cargado correctamente.');
    },
    (xhr) => {
      if (xhr.total) {
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        if (pct < 100) console.debug(`[3D] Anillo cargando: ${pct}%`);
      }
    },
    (error) => {
      console.warn('[3D] No se pudo cargar el GLB, usando fallback procedural.', error);
      buildProceduralFallback(group, silverMat);
    }
  );

  /* ---------- Fallback procedural ---------- */
  function buildProceduralFallback(parent, material) {
    const ringGeo = new THREE.TorusGeometry(1.6, 0.22, 64, 256);
    const pos = ringGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      pos.setZ(i, z * 0.35);
    }
    ringGeo.computeVertexNormals();

    const mainRing = new THREE.Mesh(ringGeo, material);
    parent.add(mainRing);

    const innerGeo = new THREE.TorusGeometry(1.35, 0.045, 48, 200);
    const innerRing = new THREE.Mesh(innerGeo, material);
    innerRing.rotation.x = Math.PI / 2.2;
    innerRing.rotation.y = Math.PI / 3;
    parent.add(innerRing);

    parent.userData.ring = mainRing;
  }

  /* ---------- Luces ---------- */
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-5, 3, 4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xE5E4E2, 1.8);
  rim.position.set(6, -2, -4);
  scene.add(rim);

  const fill = new THREE.PointLight(0xD4AF7A, 0.7, 20);
  fill.position.set(3, 3, 4);
  scene.add(fill);

  /* ============================================================
     ORBIT CONTROLS — órbita alrededor del anillo
     ============================================================ */
  const controls = new OrbitControls(camera, canvas);

  /* Rotación automática activada por defecto */
  controls.autoRotate = !prefersReducedMotion;
  controls.autoRotateSpeed = CONFIG.autoRotateSpeed;

  /* Sin zoom con rueda — la rueda hace scroll de la página */
  controls.enableZoom = false;

  /* Arrastrar para rotar */
  controls.enableRotate = true;
  controls.rotateSpeed = CONFIG.rotateSpeed;

  /* Sin pan (no se puede desplazar el anillo) */
  controls.enablePan = false;

  /* Suavizado premium */
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  /* Límites verticales: no se puede volcar completamente */
  controls.minPolarAngle = Math.PI * 0.30;
  controls.maxPolarAngle = Math.PI * 0.70;

  /* El target es el centro del anillo (que está en el centro del canvas) */
  controls.target.set(0, 0, 0);
  controls.update();

  /* ----------------------------------------------------------
     Auto-rotate: se pausa al interactuar, se reanuda tras 3s
     ---------------------------------------------------------- */
  let resumeTimer = null;

  function pauseAutoRotate() {
    controls.autoRotate = false;
    if (resumeTimer) clearTimeout(resumeTimer);
  }

  function scheduleResume() {
    if (prefersReducedMotion) return;
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      controls.autoRotate = true;
    }, CONFIG.resumeDelay);
  }

  /* Pausa al empezar a arrastrar o al usar la rueda */
  canvas.addEventListener('pointerdown', pauseAutoRotate);
  canvas.addEventListener('wheel', pauseAutoRotate, { passive: true });

  /* Reanuda cuando el usuario suelta el ratón */
  controls.addEventListener('end', scheduleResume);

  /* También reanuda si el ratón sale del canvas */
  canvas.addEventListener('pointerleave', scheduleResume);

  /* ============================================================
     Loop de render
     ============================================================ */
  const clock = new THREE.Clock();

  let visible = true;
  const heroObs = new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }
  );
  heroObs.observe(canvas);

  let tabVisible = true;
  document.addEventListener('visibilitychange', () => {
    tabVisible = !document.hidden;
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!visible || !tabVisible) return;

    /* Los controls necesitan update() en cada frame con damping */
    controls.update();

    /* Flotación vertical sutil */
    if (!prefersReducedMotion) {
      const t = clock.getElapsedTime();
      group.position.y = CONFIG.ringOffsetY + Math.sin(t * CONFIG.floatSpeed) * CONFIG.floatAmplitude;
    }

    renderer.render(scene, camera);
  }
  animate();

  /* ============================================================
     Resize
     ============================================================ */
  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
  }, { passive: true });
}