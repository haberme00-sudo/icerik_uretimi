// 3D Maket stili — ÖRNEK UYGULAMA (konu: "Çatıya güneş paneli nasıl sabitlenir?"). Yeni konuda sahneyi, parçaları,
// çekimleri, başlıkları ve çağrıları konuya göre yeniden yaz; motoru (renderer, ışık ön ayarları, dokular, hap/yol/altyazı/başlık
// çizimi, gren) koru. Logo + kapanış kartı bu dosyada yok: logo.md'ye göre 2D katmana ekle.
// window.seek(t): t saniyesindeki kareyi deterministik çizer (Three.js + 2D yazı katmanı).
// Tasarım çizelgesi u (0–30); seslendirme varsa SES.harita u'yu gerçek saniyeye bağlar.
import * as THREE from "three";
import { RoomEnvironment } from "./lib/RoomEnvironment.js";
import { RoundedBoxGeometry } from "./lib/RoundedBoxGeometry.js";

const W = 1080, H = 1920, PLAN = 30;
const SES = window.SES || null;
const DURATION = SES ? SES.sure : 32;

// ───────── yardımcılar
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ara = (u, a, b) => clamp((u - a) / (b - a));
const eOC = (t) => 1 - Math.pow(1 - t, 3);
const eIOC = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eIOS = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const eBack = (t) => { const c1 = 1.25, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const D = Math.PI / 180;

// zaman haritası: t (sn) ↔ u
function tToU(t) {
  if (!SES) return (t / DURATION) * PLAN;
  const h = SES.harita;
  for (let i = 0; i < h.length - 1; i++) if (t <= h[i + 1][0]) return h[i][1] + ((t - h[i][0]) / (h[i + 1][0] - h[i][0])) * (h[i + 1][1] - h[i][1]);
  return PLAN;
}
function uToT(u) {
  if (!SES) return (u / PLAN) * DURATION;
  const h = SES.harita;
  for (let i = 0; i < h.length - 1; i++) if (u <= h[i + 1][1]) return h[i][0] + ((u - h[i][1]) / (h[i + 1][1] - h[i][1])) * (h[i + 1][0] - h[i][0]);
  return DURATION;
}

// ───────── renderer
const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
gl.setPixelRatio(1);
gl.setSize(W, H, false);
gl.outputColorSpace = THREE.SRGBColorSpace;
gl.toneMapping = THREE.ACESFilmicToneMapping;
gl.shadowMap.enabled = true;
gl.shadowMap.type = THREE.PCFSoftShadowMap;
gl.setClearColor(0x000000, 0);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(gl);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.fog = new THREE.Fog(0x0d1422, 5, 16);
const camera = new THREE.PerspectiveCamera(36, W / H, 0.02, 60);

const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.012;
key.shadow.radius = 5;
scene.add(key, key.target);
const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 1);
scene.add(hemi);
const rim = new THREE.DirectionalLight(0xffd7a0, 1);
scene.add(rim, rim.target);

// ───────── prosedürel dokular (tohumlu, bir kez)
function tuval(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function dokuYap(c, srgb = true, tekrar) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (tekrar) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...tekrar); }
  return t;
}
// panel camı: monokristal hücreler (6×10, yarım hücre), pahlı köşeler, busbar
const hucreDoku = (() => {
  const c = tuval(1024, 1600), x = c.getContext("2d"), r = mulberry32(7);
  x.fillStyle = "#151b27"; x.fillRect(0, 0, 1024, 1600);
  const mx = 18, my = 20, kol = 6, sat = 20, g = 6;
  const cw = (1024 - 2 * mx - (kol - 1) * g) / kol, ch = (1600 - 2 * my - (sat - 1) * g - 14) / sat;
  for (let j = 0; j < sat; j++) for (let i = 0; i < kol; i++) {
    const x0 = mx + i * (cw + g), y0 = my + j * (ch + g) + (j >= sat / 2 ? 14 : 0);
    const k = 12, v = r() * 10;
    x.beginPath();
    x.moveTo(x0 + k, y0); x.lineTo(x0 + cw - k, y0); x.lineTo(x0 + cw, y0 + k); x.lineTo(x0 + cw, y0 + ch - k);
    x.lineTo(x0 + cw - k, y0 + ch); x.lineTo(x0 + k, y0 + ch); x.lineTo(x0, y0 + ch - k); x.lineTo(x0, y0 + k); x.closePath();
    const gr = x.createLinearGradient(x0, y0, x0 + cw, y0 + ch);
    gr.addColorStop(0, `rgb(${16 + v},${22 + v},${36 + v})`); gr.addColorStop(1, `rgb(${10 + v},${14 + v},${26 + v})`);
    x.fillStyle = gr; x.fill();
    x.save(); x.clip();
    x.strokeStyle = "rgba(120,140,175,0.13)"; x.lineWidth = 1;
    for (let yy = y0 + 3; yy < y0 + ch; yy += 5) { x.beginPath(); x.moveTo(x0, yy); x.lineTo(x0 + cw, yy); x.stroke(); }
    x.strokeStyle = "rgba(200,208,220,0.42)"; x.lineWidth = 2.2;
    for (let b = 1; b <= 5; b++) { const bx = x0 + (cw * b) / 6; x.beginPath(); x.moveTo(bx, y0); x.lineTo(bx, y0 + ch); x.stroke(); }
    x.restore();
  }
  return dokuYap(c);
})();
// beton kiremit greni
const kiremitDoku = (() => {
  const c = tuval(256, 256), x = c.getContext("2d"), r = mulberry32(11), d = x.createImageData(256, 256);
  for (let i = 0; i < 256 * 256; i++) { const v = 200 + r() * 55; d.data[i * 4] = v; d.data[i * 4 + 1] = v; d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
  x.putImageData(d, 0, 0);
  return dokuYap(c, true, [2, 2]);
})();
// ahşap lif
const ahsapDoku = (() => {
  const c = tuval(128, 1024), x = c.getContext("2d"), r = mulberry32(5);
  x.fillStyle = "#b9905f"; x.fillRect(0, 0, 128, 1024);
  for (let i = 0; i < 70; i++) {
    const px = r() * 128, a = 0.08 + r() * 0.18;
    x.strokeStyle = r() < 0.5 ? `rgba(110,72,38,${a})` : `rgba(230,200,150,${a})`;
    x.lineWidth = 0.6 + r() * 2.2;
    x.beginPath(); x.moveTo(px, 0);
    for (let y = 0; y <= 1024; y += 32) x.lineTo(px + Math.sin(y * 0.01 + i) * 3, y);
    x.stroke();
  }
  return dokuYap(c);
})();
// fırçalanmış metal pürüzlülüğü
const fircaDoku = (() => {
  const c = tuval(512, 64), x = c.getContext("2d"), r = mulberry32(3);
  x.fillStyle = "#666"; x.fillRect(0, 0, 512, 64);
  for (let i = 0; i < 160; i++) { const v = 70 + r() * 90; x.fillStyle = `rgb(${v},${v},${v})`; x.fillRect(0, r() * 64, 512, 0.6 + r()); }
  return dokuYap(c, false, [1, 1]);
})();

// ───────── malzemeler
const M = {
  kiremit: new THREE.MeshStandardMaterial({ color: 0x41454c, map: kiremitDoku, roughness: 0.82, metalness: 0 }),
  kiremitKesit: new THREE.MeshStandardMaterial({ color: 0x41454c, map: kiremitDoku, roughness: 0.82, metalness: 0, transparent: true }),
  ahsap: new THREE.MeshStandardMaterial({ map: ahsapDoku, roughness: 0.78 }),
  lata: new THREE.MeshStandardMaterial({ map: ahsapDoku, color: 0xd9c7a8, roughness: 0.8 }),
  alt: new THREE.MeshStandardMaterial({ color: 0x2a2e35, roughness: 0.95 }),
  celik: new THREE.MeshPhysicalMaterial({ color: 0xcdd2d8, metalness: 1, roughness: 0.3, roughnessMap: fircaDoku }),
  alu: new THREE.MeshPhysicalMaterial({ color: 0xc3c8ce, metalness: 0.92, roughness: 0.36, roughnessMap: fircaDoku }),
  cerceve: new THREE.MeshPhysicalMaterial({ color: 0xa9b0b8, metalness: 0.85, roughness: 0.32 }),
  cam: new THREE.MeshPhysicalMaterial({ map: hucreDoku, metalness: 0.05, roughness: 0.12, clearcoat: 0.5, clearcoatRoughness: 0.08, envMapIntensity: 0.55 }),
  arka: new THREE.MeshStandardMaterial({ color: 0xe8e8e4, roughness: 0.9 }),
  lastik: new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.92 }),
};
function mesh(geo, mat, parent) { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; if (parent) parent.add(m); return m; }
const RB = (w, h, d, r = 0.002, s = 2) => new RoundedBoxGeometry(w, h, d, s, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));

// ───────── çatı (yerel eksen: x saçak boyunca, +z aşağı eğim/saçağa, y çatı normali)
const cati = new THREE.Group();
cati.rotation.x = 25 * D;
scene.add(cati);

const MERTEKLER = [-1.05, -0.35, 0.35, 1.05];
const RAYLAR = [-0.495, 0.495];
const LATALAR = []; for (let k = -4; k <= 6; k++) LATALAR.push(-0.435 + 0.33 * k);

const altKaplama = mesh(new THREE.BoxGeometry(6.0, 0.01, 3.7), M.alt, cati); altKaplama.position.set(0, -0.165, 0.05);
for (const x of MERTEKLER.concat([-1.75, 1.75, -2.45, 2.45])) { const m = mesh(RB(0.08, 0.16, 3.7, 0.006), M.ahsap, cati); m.position.set(x, -0.08, 0.05); }
for (const z of LATALAR) { const m = mesh(RB(6.0, 0.03, 0.05, 0.004), M.lata, cati); m.position.set(0, 0.015, z); }

// kiremit profili: tek dalgalı beton kiremit
const TW = 0.3, TL = 0.37, TK = 0.012;
const kiremitGeo = (() => {
  const s = new THREE.Shape(), n = 22, ust = [];
  for (let i = 0; i <= n; i++) { const x = (i / n) * TW; ust.push([x - TW / 2, 0.034 * 0.5 * (1 - Math.cos((2 * Math.PI * x) / TW)) + TK]); }
  s.moveTo(ust[0][0], ust[0][1]);
  for (const p of ust) s.lineTo(p[0], p[1]);
  for (let i = n; i >= 0; i--) s.lineTo(ust[i][0], ust[i][1] - TK);
  const g = new THREE.ExtrudeGeometry(s, { depth: TL, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1 });
  return g;
})();
const kiremitler = [], kesitKiremit = [];
for (const zb of LATALAR) for (let i = 0; i < 20; i++) {
  const x = -2.85 + i * TW;
  const kesit = (x > -0.61 && x < 0.01) && zb > -1.2 && zb < -0.3;
  (kesit ? kesitKiremit : kiremitler).push({ x, z: zb - 0.02 });
}
function kiremitMatris(o, dy = 0, dz = 0, ry = 0) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.atan(0.016 / TL), ry, 0));
  m.compose(new THREE.Vector3(o.x, 0.03 + dy, o.z + dz), q, new THREE.Vector3(1, 1, 1));
  return m;
}
const kiremitIM = new THREE.InstancedMesh(kiremitGeo, M.kiremit, kiremitler.length);
kiremitler.forEach((o, i) => kiremitIM.setMatrixAt(i, kiremitMatris(o)));
kiremitIM.castShadow = kiremitIM.receiveShadow = true;
cati.add(kiremitIM);
const kesitIM = new THREE.InstancedMesh(kiremitGeo, M.kiremitKesit, kesitKiremit.length);
kesitIM.castShadow = kesitIM.receiveShadow = true;
cati.add(kesitIM);

// çatı kancaları (paslanmaz çelik)
function vidaYap() {
  const g = new THREE.Group();
  mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.005, 6), M.celik, g).position.y = 0.0045;
  mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.0015, 20), M.celik, g).position.y = 0.0015;
  const s = mesh(new THREE.CylinderGeometry(0.0028, 0.0018, 0.08, 10), M.celik, g); s.position.y = -0.04;
  return g;
}
const kancalar = [];
for (const zr of RAYLAR) for (const x of MERTEKLER) {
  const g = new THREE.Group();
  mesh(RB(0.04, 0.006, 0.15, 0.002), M.celik, g).position.set(0, 0.003, -0.105);
  const yuk = mesh(RB(0.04, 0.132, 0.006, 0.002), M.celik, g); yuk.position.set(0, 0.066, -0.032);
  mesh(RB(0.04, 0.006, 0.075, 0.002), M.celik, g).position.set(0, 0.129, 0.0);
  const vidalar = [vidaYap(), vidaYap()];
  vidalar[0].position.set(0, 0.006, -0.155); vidalar[1].position.set(0, 0.006, -0.085);
  for (const v of vidalar) g.add(v);
  g.position.set(x, 0, zr);
  cati.add(g);
  kancalar.push({ g, x, zr, vidalar });
}
const kanca0 = kancalar.find((k) => k.x === -0.35 && k.zr === -0.495);

// alüminyum raylar
const rayGeo = (() => {
  const s = new THREE.Shape();
  const p = [[-0.02, 0], [0.02, 0], [0.02, 0.045], [0.007, 0.045], [0.007, 0.036], [-0.007, 0.036], [-0.007, 0.045], [-0.02, 0.045]];
  s.moveTo(...p[0]); for (const q of p.slice(1)) s.lineTo(...q);
  const g = new THREE.ExtrudeGeometry(s, { depth: 2.66, bevelEnabled: true, bevelThickness: 0.0015, bevelSize: 0.0015, bevelSegments: 1 });
  g.rotateY(Math.PI / 2); g.translate(-1.33, 0, 0);
  return g;
})();
const raylar = RAYLAR.map((zr) => { const m = mesh(rayGeo, M.alu, cati); m.position.set(0, 0.132, zr); return { m, zr }; });

// paneller (dikey yerleşim: uzun kenar eğim boyunca)
const PW = 1.134, PL = 1.722, PH = 0.035, RAY_UST = 0.177;
function panelYap(M) {
  const g = new THREE.Group(), f = 0.03;
  mesh(RB(PW, PH, f, 0.003), M.cerceve, g).position.set(0, PH / 2, -PL / 2 + f / 2);
  mesh(RB(PW, PH, f, 0.003), M.cerceve, g).position.set(0, PH / 2, PL / 2 - f / 2);
  mesh(RB(f, PH, PL - 2 * f, 0.003), M.cerceve, g).position.set(-PW / 2 + f / 2, PH / 2, 0);
  mesh(RB(f, PH, PL - 2 * f, 0.003), M.cerceve, g).position.set(PW / 2 - f / 2, PH / 2, 0);
  const cam = mesh(new THREE.BoxGeometry(PW - 2 * f + 0.004, 0.005, PL - 2 * f + 0.004), [M.cerceve, M.cerceve, M.cam, M.arka, M.cerceve, M.cerceve], g);
  cam.position.y = PH - 0.006;
  mesh(new THREE.BoxGeometry(PW - 0.07, 0.002, PL - 0.07), M.arka, g).position.y = 0.004;
  return g;
}
// A paneli yük yolu sahnesinde saydamlaşır (altındaki kanca/mertek görünsün)
const MA = { ...M, cerceve: M.cerceve.clone(), cam: M.cam.clone(), arka: M.arka.clone() };
for (const k of ["cerceve", "cam", "arka"]) MA[k].transparent = true;
const paneller = [-0.578, 0.578].map((x, i) => { const g = panelYap(i === 0 ? MA : M); g.position.set(x, RAY_UST, 0); cati.add(g); return { g, x }; });

// kelepçeler
function civataYap() { const g = new THREE.Group(); mesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.006, 6), M.celik, g).position.y = 0.003; return g; }
const kelepceler = [];
for (const zr of RAYLAR) {
  for (const s of [-1, 1]) {
    const g = new THREE.Group();
    mesh(RB(0.022, 0.04, 0.05, 0.003), M.alu, g).position.set(s * 0.011, 0.02, 0);
    mesh(RB(0.034, 0.006, 0.05, 0.002), M.alu, g).position.set(-s * 0.003, PH + 0.003, 0);
    const c = civataYap(); c.position.set(-s * 0.002, PH + 0.006, 0); g.add(c);
    g.position.set(s * (PW + 0.011 + 0.0005), RAY_UST, zr);
    cati.add(g);
    kelepceler.push({ g, tur: "uc", c, zr, s });
  }
  const g = new THREE.Group();
  mesh(RB(0.016, PH - 0.004, 0.034, 0.002), M.alu, g).position.set(0, (PH - 0.004) / 2, 0);
  mesh(RB(0.052, 0.007, 0.05, 0.002), M.alu, g).position.set(0, PH + 0.0035, 0);
  const c = civataYap(); c.position.set(0, PH + 0.007, 0); g.add(c);
  g.position.set(0, RAY_UST, zr);
  cati.add(g);
  kelepceler.push({ g, tur: "ara", c, zr, s: 0 });
}
scene.updateMatrixWorld(true);

// ───────── çekimler (kamera, ışık)
// t: hedef (çatı yerel), az/el: derece (dünya), d: uzaklık
const CEKIM = [
  { u0: 0, u1: 4.5, mod: 1, a: { t: [0, 0.15, 0.25], az: -26, el: 36, d: 7.4, fov: 36 }, b: { t: [0, 0.15, 0.15], az: -18, el: 33, d: 6.5, fov: 36 } },
  { u0: 4.5, u1: 11, mod: 0, a: { t: [-0.33, 0.03, -0.52], az: -40, el: 36, d: 2.5, fov: 34 }, b: { t: [-0.35, 0.04, -0.52], az: -28, el: 41, d: 2.05, fov: 34 } },
  { u0: 11, u1: 15, mod: 0, a: { t: [0, 0.12, -0.15], az: 34, el: 44, d: 3.7, fov: 36 }, b: { t: [0, 0.12, -0.15], az: 25, el: 41, d: 3.25, fov: 36 } },
  { u0: 15, u1: 17.5, mod: 0, a: { t: [0, 0.15, 0.05], az: 18, el: 46, d: 4.8, fov: 36 }, b: { t: [0, 0.15, 0.0], az: 11, el: 42, d: 4.2, fov: 36 } },
  { u0: 17.5, u1: 18.65, mod: 0, a: { t: [-1.15, 0.2, -0.495], az: -42, el: 30, d: 0.8, fov: 34 }, b: { t: [-1.15, 0.2, -0.495], az: -34, el: 32, d: 0.68, fov: 34 } },
  { u0: 18.65, u1: 21, mod: 0, a: { t: [0, 0.2, -0.495], az: 28, el: 34, d: 0.85, fov: 34 }, b: { t: [0, 0.2, -0.495], az: 18, el: 36, d: 0.66, fov: 34 } },
  { u0: 21, u1: 27, mod: 1, a: { t: [-0.18, 0.08, -0.42], az: -34, el: 38, d: 2.6, fov: 34 }, b: { t: [-0.18, 0.08, -0.42], az: -25, el: 34, d: 2.15, fov: 34 } },
  { u0: 27, u1: 30.01, mod: 0, a: { t: [0, 0.15, 0.25], az: -12, el: 35, d: 5.2, fov: 36 }, b: { t: [0, 0.15, 0.25], az: -22, el: 31, d: 7.6, fov: 36 } },
];
const cekimBul = (u) => CEKIM.find((c) => u >= c.u0 && u < c.u1) || CEKIM[CEKIM.length - 1];
// gece oranı (1 gece, 0 gündüz); 21–21.5 ışık dönüşü
function geceOrani(u) {
  if (u >= 21 && u < 27) return eIOS(ara(u, 21, 21.5));
  return cekimBul(u).mod;
}
const yerel = (p) => cati.localToWorld(new THREE.Vector3(...p));
const renk = (a, b, k) => new THREE.Color(a).lerp(new THREE.Color(b), k);

function kameraKur(u) {
  const c = cekimBul(u), k = eIOS(ara(u, c.u0, c.u1));
  const t = yerel([0, 1, 2].map((i) => lerp(c.a.t[i], c.b.t[i], k)));
  const az = lerp(c.a.az, c.b.az, k) * D, el = lerp(c.a.el, c.b.el, k) * D, d = lerp(c.a.d, c.b.d, k);
  camera.fov = lerp(c.a.fov, c.b.fov, k);
  camera.position.set(t.x + d * Math.cos(el) * Math.sin(az), t.y + d * Math.sin(el), t.z + d * Math.cos(el) * Math.cos(az));
  camera.lookAt(t);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return { hedef: t, d };
}
function isikKur(g, hedef, d) {
  gl.toneMappingExposure = lerp(1.0, 0.95, g);
  scene.environmentIntensity = lerp(0.55, 0.16, g);
  scene.fog.color = renk(0xd6d7d4, 0x0d1422, g);
  scene.fog.near = d * 1.15; scene.fog.far = d * lerp(4.2, 3.2, g);
  key.color = renk(0xffffff, 0xcfdcff, g); key.intensity = lerp(2.3, 1.45, g);
  key.position.copy(hedef).add(new THREE.Vector3(-2.6, 5.2, 2.4).normalize().multiplyScalar(6));
  key.target.position.copy(hedef);
  const s = Math.max(0.5, d * 0.9), cam = key.shadow.camera;
  cam.left = -s; cam.right = s; cam.top = s; cam.bottom = -s; cam.near = 0.5; cam.far = 14; cam.updateProjectionMatrix();
  hemi.color = renk(0xffffff, 0x3a4a6a, g); hemi.groundColor = renk(0x8a8a86, 0x05070c, g); hemi.intensity = lerp(0.55, 0.12, g);
  rim.intensity = lerp(0.3, 2.2, g);
  rim.position.copy(hedef).add(new THREE.Vector3(2.5, 3, -5));
  rim.target.position.copy(hedef);
}

// ───────── montaj durumu (u'dan)
const titreme = (u, f, g) => Math.sin(u * 2 * Math.PI * 4.3 * 1.33 + f) * 0.6 + Math.sin(u * 2 * Math.PI * 7.1 * 1.33 + f * 2.1) * 0.4;
function montaj(u) {
  const S2 = u >= 4.5 && u < 11, S3 = u >= 11 && u < 15, S4 = u >= 15 && u < 21;
  // kancalar
  for (const k of kancalar) {
    let p = 1;
    if (S2) p = k === kanca0 ? ara(u, 6.6, 7.6) : 0;
    k.g.visible = p > 0;
    k.g.position.y = 0.32 * (1 - eOC(p));
    k.vidalar.forEach((v, i) => {
      let q = 1;
      if (S2 && k === kanca0) q = ara(u, 7.9 + i * 0.55, 8.6 + i * 0.55);
      v.visible = q > 0;
      v.position.y = 0.006 + 0.07 * (1 - eOC(q));
      v.rotation.y = -(1 - q) * Math.PI * 7;
    });
  }
  // kesit kiremitleri: S2'de kalkar; S5'te röntgen gibi saydamlaşır
  let kalk = 0, op = 1;
  if (S2) { kalk = eIOC(ara(u, 4.8, 5.9)); op = 1 - ara(u, 5.3, 6.0); }
  if (u >= 21 && u < 27) op = lerp(1, 0.2, ara(u, 22.6, 23.3));
  if (u >= 27) op = 0.28;
  kesitKiremit.forEach((o, i) => kesitIM.setMatrixAt(i, kiremitMatris(o, 0.32 * kalk * (1 + i * 0.08), -0.25 * kalk, 0.12 * kalk * (i % 2 ? 1 : -1))));
  kesitIM.instanceMatrix.needsUpdate = true;
  kesitIM.visible = op > 0.01;
  M.kiremitKesit.opacity = op;
  M.kiremitKesit.depthWrite = op > 0.99;
  // raylar
  raylar.forEach((r, i) => {
    let p = 1;
    if (S2) p = 0;
    if (S3) p = ara(u, 11.7 + i * 0.55, 12.8 + i * 0.55);
    r.m.visible = p > 0;
    r.m.position.y = 0.132 + 0.45 * (1 - eOC(p));
  });
  // paneller + rüzgâr titremesi / kalkma
  const gece = (u < 4.5) || (u >= 21 && u < 27);
  const kalkma = (u >= 21 && u < 27) ? 0.006 * eOC(ara(u, 22.5, 23.2)) : 0;
  paneller.forEach((p, i) => {
    let q = 1;
    if (S2 || S3) q = 0;
    if (S4) q = ara(u, 15.3 + i * 0.6, 16.6 + i * 0.6);
    p.g.visible = q > 0;
    const tit = gece ? 0.0022 * titreme(u, i * 1.7) : 0;
    p.g.position.y = RAY_UST + 0.55 * (1 - eOC(q)) + tit + kalkma;
    p.g.rotation.z = 0.06 * (1 - eOC(q)) * (i ? 1 : -1);
    p.g.rotation.x = -0.04 * (1 - eOC(q));
  });
  const pop = (u >= 21 && u < 27) ? lerp(1, 0.14, ara(u, 22.6, 23.3)) : u >= 27 ? 0.3 : 1;
  MA.cam.opacity = pop; MA.cerceve.opacity = Math.max(pop, 0.35); MA.arka.opacity = pop * 0.6;
  for (const k of ["cerceve", "cam", "arka"]) MA[k].depthWrite = pop > 0.99;
  for (const k of kelepceler) {
    let q = 1;
    if (S2 || S3) q = 0;
    if (S4) q = k.tur === "uc" ? ara(u, 17.55, 18.35) : ara(u, 18.75, 19.6);
    k.g.visible = q > 0;
    const yer = eOC(clamp(q / 0.6)), sik = clamp((q - 0.55) / 0.45);
    const tit = gece ? 0.0022 * titreme(u, k.zr > 0 ? 1.7 : 0) : 0;
    k.g.position.y = RAY_UST + 0.12 * (1 - yer) + tit + kalkma;
    k.c.rotation.y = -sik * Math.PI * 4;
    k.c.position.y = PH + (k.tur === "ara" ? 0.007 : 0.006) + 0.004 * (1 - sik);
  }
}

// ───────── 2D katman
const cikti = document.getElementById("cikti");
const ctx = cikti.getContext("2d");
function ekran(p) { const v = yerel(p).project(camera); return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H, v.z]; }

function zemin(g) {
  const gun = ctx.createLinearGradient(0, 0, 0, H);
  gun.addColorStop(0, "#BFC1C0"); gun.addColorStop(0.5, "#D8D9D6"); gun.addColorStop(1, "#E6E6E2");
  ctx.globalAlpha = 1; ctx.fillStyle = gun; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, H * 0.45, H * 0.25, W / 2, H * 0.45, H * 0.8);
  v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(40,44,50,0.16)");
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  if (g > 0) {
    ctx.globalAlpha = g;
    const n = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, H * 0.78);
    n.addColorStop(0, "#141D2E"); n.addColorStop(0.5, "#0D1422"); n.addColorStop(1, "#070B14");
    ctx.fillStyle = n; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

const RENK = { sari: ["#F3BC2E", "#141414"], mavi: ["#2E8CEB", "#FFFFFF"], murekkep: ["#18202E", "#FFFFFF"], kirmizi: ["#E2453F", "#FFFFFF"] };
// çağrı hapı: çapa halkası + kılavuz çizgi + hap
function hap(ax, ay, dx, dy, metin, tur, p, alt) {
  if (p <= 0) return;
  const [bg, fg] = RENK[tur];
  const px = ax + dx, py = ay + dy;
  ctx.save();
  ctx.font = "700 30px Jakarta";
  const w1 = ctx.measureText(metin).width;
  ctx.font = "500 20px Jakarta";
  const w2 = alt ? ctx.measureText(alt).width : 0;
  const w = Math.max(w1, w2) + 48, h = alt ? 80 : 58;
  // halka
  const pr = clamp(p / 0.25);
  ctx.globalAlpha = pr;
  ctx.beginPath(); ctx.arc(ax, ay, 11 * eBack(pr), 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.92)"; ctx.fill();
  ctx.lineWidth = 3.5; ctx.strokeStyle = bg; ctx.stroke();
  ctx.beginPath(); ctx.arc(ax, ay, 4, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
  // çizgi
  const lp = eOC(clamp((p - 0.1) / 0.4));
  const ex = dx >= 0 ? px : px, ey = py;
  ctx.globalAlpha = 1;
  ctx.strokeStyle = tur === "sari" ? "#F3BC2E" : tur === "kirmizi" ? "#E2453F" : "rgba(255,255,255,0.95)";
  if (tur === "murekkep") ctx.strokeStyle = "#18202E";
  ctx.lineWidth = 2.5;
  const sx = ax + (dx >= 0 ? 1 : -1) * 11 * (dx !== 0 ? Math.abs(dx) / Math.hypot(dx, dy) : 0), sy = ay + 11 * (dy / Math.hypot(dx, dy));
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(lerp(sx, ex, lp), lerp(sy, ey, lp)); ctx.stroke();
  // hap
  const hp = eOC(clamp((p - 0.4) / 0.6));
  if (hp > 0) {
    const sol = dx >= 0 ? px : px - w, ust = py - h / 2;
    ctx.globalAlpha = hp;
    ctx.translate(dx >= 0 ? px : px, py); ctx.scale(0.88 + 0.12 * hp, 0.88 + 0.12 * hp); ctx.translate(-(dx >= 0 ? px : px), -py);
    ctx.shadowColor = "rgba(0,0,0,0.28)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.roundRect(sol, ust, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "700 30px Jakarta";
    ctx.fillText(metin, sol + w / 2, alt ? py - 12 : py + 1);
    if (alt) { ctx.font = "500 20px Jakarta"; ctx.globalAlpha = hp * 0.75; ctx.fillText(alt, sol + w / 2, py + 19); }
  }
  ctx.restore();
}
// numaralı halka
function numara(ax, ay, n, p) {
  if (p <= 0) return;
  const s = eBack(clamp(p / 0.6));
  ctx.save(); ctx.globalAlpha = clamp(p * 3);
  ctx.beginPath(); ctx.arc(ax, ay, 26 * s, 0, Math.PI * 2); ctx.lineWidth = 4; ctx.strokeStyle = "#F3BC2E"; ctx.stroke();
  ctx.fillStyle = "rgba(243,188,46,0.16)"; ctx.fill();
  ctx.beginPath(); ctx.arc(ax + 24 * s, ay - 22 * s, 17 * s, 0, Math.PI * 2); ctx.fillStyle = "#F3BC2E"; ctx.fill();
  ctx.fillStyle = "#141414"; ctx.font = `800 ${Math.round(20 * s)}px Jakarta`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(n), ax + 24 * s, ay - 21 * s);
  ctx.restore();
}
// yük yolu: sarı parlayan çizgi, kısmi çizim + akan nabız
function yol(noktalar, p, alfa = 1, nabizT = 0) {
  if (p <= 0) return;
  const L = []; let top = 0;
  for (let i = 1; i < noktalar.length; i++) { const l = Math.hypot(noktalar[i][0] - noktalar[i - 1][0], noktalar[i][1] - noktalar[i - 1][1]); L.push(l); top += l; }
  const hedef = top * p;
  const ciz = (gen, renk) => {
    ctx.beginPath(); ctx.moveTo(...noktalar[0]); let k = 0;
    for (let i = 1; i < noktalar.length; i++) {
      if (k + L[i - 1] <= hedef) { ctx.lineTo(...noktalar[i]); k += L[i - 1]; }
      else { const f = (hedef - k) / L[i - 1]; ctx.lineTo(lerp(noktalar[i - 1][0], noktalar[i][0], f), lerp(noktalar[i - 1][1], noktalar[i][1], f)); break; }
    }
    ctx.lineWidth = gen; ctx.strokeStyle = renk; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
  };
  ctx.save(); ctx.globalAlpha = alfa;
  ciz(20, "rgba(243,188,46,0.22)"); ciz(10, "rgba(243,188,46,0.35)"); ciz(5, "#F7C93F");
  // eklem noktaları
  let k = 0;
  for (let i = 0; i < noktalar.length; i++) {
    if (i > 0) k += L[i - 1];
    if (k <= hedef + 0.5) { ctx.beginPath(); ctx.arc(...noktalar[i], 7, 0, Math.PI * 2); ctx.fillStyle = "#FFE08A"; ctx.fill(); }
  }
  // nabız
  if (p >= 1 && nabizT > 0) {
    let d = (nabizT % 1) * top, j = 0;
    while (j < L.length - 1 && d > L[j]) { d -= L[j]; j++; }
    const f = clamp(d / L[j]);
    const x = lerp(noktalar[j][0], noktalar[j + 1][0], f), y = lerp(noktalar[j][1], noktalar[j + 1][1], f);
    const r = ctx.createRadialGradient(x, y, 0, x, y, 30); r.addColorStop(0, "rgba(255,240,190,0.95)"); r.addColorStop(1, "rgba(243,188,46,0)");
    ctx.fillStyle = r; ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
// rüzgâr çizgileri
const CIZGI = (() => { const r = mulberry32(21); return Array.from({ length: 24 }, () => ({ y: 380 + r() * 1150, uz: 160 + r() * 260, hiz: 0.5 + r() * 0.45, off: r(), kv: 20 + r() * 60, a: 0.35 + r() * 0.4 })); })();
function ruzgar(t, guc) {
  if (guc <= 0) return;
  ctx.save(); ctx.lineCap = "round";
  for (const c of CIZGI) {
    const f = (t * c.hiz * 0.42 + c.off) % 1, x = -350 + f * (W + 700), y = c.y - f * 90;
    const x0 = x - c.uz, y0 = y + c.kv * 0.4, mx = x - c.uz * 0.5, my = y - c.kv;
    const g = ctx.createLinearGradient(x0, y0, x, y);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.75, `rgba(255,255,255,${c.a * 0.6 * guc})`); g.addColorStop(1, `rgba(214,240,255,${c.a * guc})`);
    ctx.strokeStyle = g; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x, y); ctx.stroke();
  }
  ctx.restore();
}
// kuvvet oku
function ok(x, y, uz, p) {
  if (p <= 0) return;
  const l = uz * eOC(p), y1 = y - l;
  ctx.save(); ctx.globalAlpha = clamp(p * 2);
  ctx.shadowColor = "rgba(190,220,255,0.8)"; ctx.shadowBlur = 16;
  ctx.strokeStyle = "#E4EFFF"; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y1); ctx.stroke();
  ctx.fillStyle = "#E4EFFF"; ctx.beginPath(); ctx.moveTo(x, y1 - 22); ctx.lineTo(x - 15, y1 + 4); ctx.lineTo(x + 15, y1 + 4); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// başlıklar
const BASLIK = [
  { u0: 0, u1: 4.5, k: "Fırtınada", b: "panele ne tutunur?", etiket: "kiremit çatı" },
  { u0: 4.5, u1: 11, k: "Önce kanca:", b: "merteğe vidalanır", etiket: "kesit" },
  { u0: 11, u1: 15, k: "Sonra", b: "raylar bağlanır", etiket: "ray" },
  { u0: 15, u1: 21, k: "Paneller", b: "kelepçeyle sıkılır", etiket: "kelepçe" },
  { u0: 21, u1: 27, k: "Rüzgâr kaldırınca", b: "yük nereye gider?", etiket: "yük yolu" },
  { u0: 27, u1: 30.01, k: "Yani panel", b: "iskelete tutunur", etiket: "" },
];
function baslik(t, u, g) {
  const s = BASLIK.find((b) => u >= b.u0 && u < b.u1) || BASLIK[BASLIK.length - 1];
  const t0 = uToT(s.u0), t1 = uToT(s.u1);
  const pk = eOC(clamp((t - t0 - 0.05) / 0.32)), pb = eOC(clamp((t - t0 - 0.17) / 0.38));
  const cik = clamp((t1 - t) / 0.18);
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  // etiket hapı (sol üst)
  const et = "Temsili model" + (s.etiket ? " · " + s.etiket : "");
  ctx.font = "600 22px Jakarta";
  const ew = ctx.measureText(et).width + 52;
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.roundRect(48, 206, ew, 44, 22); // logo üst ortada (logo.md): her şey y ≥ 200
  ctx.fillStyle = g > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.86)"; ctx.fill();
  ctx.strokeStyle = g > 0.5 ? "rgba(255,255,255,0.20)" : "rgba(20,30,50,0.08)"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(72, 228, 6, 0, Math.PI * 2); ctx.fillStyle = "#F3BC2E"; ctx.fill();
  ctx.fillStyle = g > 0.5 ? "rgba(244,243,238,0.85)" : "#18202E"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillText(et, 88, 229);
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  // üst satır (italik serif) + başlık (kalın sans)
  ctx.globalAlpha = pk * cik;
  ctx.font = "italic 400 60px Serif";
  ctx.fillStyle = "#" + renk(0x1c2740, 0xe2be6a, g).getHexString();
  ctx.fillText(s.k, W / 2, 312 - 12 * (1 - pk));
  ctx.globalAlpha = pb * cik;
  ctx.font = "800 88px Jakarta"; ctx.letterSpacing = "-1.5px";
  ctx.fillStyle = "#" + renk(0x101a2e, 0xf4f3ee, g).getHexString();
  ctx.translate(W / 2, 406); ctx.scale(0.97 + 0.03 * pb, 0.97 + 0.03 * pb);
  if (g > 0.5) { ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 18; }
  ctx.fillText(s.b, 0, 14 * (1 - pb));
  ctx.restore();
}

// karaoke altyazı
const METIN_YEDEK = "Fırtınada çatıdaki güneş paneline ne tutunur? Cevap, kiremitlerin altında saklı. Önce kiremit kaldırılır ve çatı kancası, alttaki ahşap merteğe vidalanır. Lataya değil, merteğe. Kancalar yerleşince üstlerine alüminyum raylar bağlanır. Paneller raya oturur. Kenarlarda uç kelepçe, iki panelin arasında ara kelepçe sıkar. Rüzgâr paneli kaldırmaya çalıştığında yük şu yolu izler: kelepçe, ray, kanca ve mertek. Yani panel kiremide değil... evin iskeletine tutunur.";
const sade = (s) => String(s).toLocaleLowerCase("tr-TR").replace(/[^\p{L}\p{N}]/gu, "");
const VURGU_TAM = new Set(["uç", "ara", "ray", "kanca", "kelepçe", "mertek", "merteğe"]);
const VURGU_ON = ["kiremitlerin", "alüminyum", "iskeletine"];
const kelimeler = (() => {
  // transkript yazım düzeltmeleri
  const DUZELT = { "kiremite": "kiremide", "Rüzgar": "Rüzgâr" };
  if (SES && SES.kelimeler) return SES.kelimeler.map((k) => {
    if (Array.isArray(k)) k = { metin: k[0], bas: k[1], bit: k[2] }; // repo biçimi: [metin, başlangıç, bitiş]
    const m = k.metin.replace(/^[\p{L}]+/u, (w) => DUZELT[w] || w);
    return { m, bas: k.bas, bit: k.bit };
  });
  const ks = METIN_YEDEK.split(/\s+/), top = ks.reduce((a, k) => a + k.length + 1, 0), t0 = 0.3, t1 = DURATION - 1.2;
  let c = 0;
  return ks.map((k) => { const bas = t0 + (c / top) * (t1 - t0); c += k.length + 1; return { m: k, bas, bit: t0 + (c / top) * (t1 - t0) - 0.05 }; });
})();
const obekler = (() => {
  const o = []; let cur = [];
  kelimeler.forEach((k, i) => {
    const s = sade(k.m);
    k.vurgu = VURGU_TAM.has(s) || VURGU_ON.some((v) => s.startsWith(v));
    cur.push(k);
    const son = /[.,!?;:…]$/.test(k.m), sonraki = kelimeler[i + 1];
    if (!sonraki || (son && cur.length >= 2) || cur.length >= 5 || (sonraki && sonraki.bas - k.bit > 0.6)) { o.push(cur); cur = []; }
  });
  if (cur.length) o.push(cur);
  for (const ob of o) { let n = 0; for (const k of ob) if (k.vurgu && ++n > 2) k.vurgu = false; }
  return o.map((ws) => ({ ws, bas: ws[0].bas - 0.05, bit: ws[ws.length - 1].bit }));
})();
function altyazi(t, g) {
  let i = -1;
  for (let j = 0; j < obekler.length; j++) if (obekler[j].bas <= t) i = j;
  if (i < 0) return;
  const ob = obekler[i], sonraki = obekler[i + 1];
  if (t > ob.bit + 0.9 && (!sonraki || t < sonraki.bas)) return;
  const gir = eOC(clamp((t - ob.bas) / 0.16));
  ctx.save();
  ctx.font = "600 50px Jakarta";
  const bosluk = ctx.measureText(" ").width;
  // satırlara böl (en fazla 900 px)
  const satirlar = [[]]; let gen = 0;
  for (const k of ob.ws) {
    const w = ctx.measureText(k.m).width;
    if (gen > 0 && gen + bosluk + w > 900) { satirlar.push([]); gen = 0; }
    satirlar[satirlar.length - 1].push({ k, w }); gen += (gen > 0 ? bosluk : 0) + w;
  }
  const y0 = 1395 + 8 * (1 - gir), sh = 70;
  ctx.globalAlpha = gir;
  const gunduz = g < 0.5;
  if (gunduz) {
    const maks = Math.max(...satirlar.map((s) => s.reduce((a, x) => a + x.w, 0) + bosluk * (s.length - 1)));
    ctx.beginPath(); ctx.roundRect(W / 2 - maks / 2 - 30, y0 - 46, maks + 60, satirlar.length * sh + 22, 26);
    ctx.fillStyle = "rgba(250,250,248,0.80)"; ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowColor = "transparent";
  }
  satirlar.forEach((s, si) => {
    const sg = s.reduce((a, x) => a + x.w, 0) + bosluk * (s.length - 1);
    let x = W / 2 - sg / 2; const y = y0 + si * sh;
    for (const { k, w } of s) {
      const v = k.vurgu && t >= k.bas;
      if (v) {
        const p = eOC(clamp((t - k.bas) / 0.2));
        ctx.fillStyle = "#F3BC2E"; ctx.beginPath(); ctx.roundRect(x - 8, y - 42, (w + 16) * p, 58, 8); ctx.fill();
      }
      ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
      if (!gunduz && !v) { ctx.shadowColor = "rgba(0,0,0,0.55)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 2; }
      ctx.fillStyle = v ? "#141414" : gunduz ? "#101A2E" : "#FFFFFF";
      ctx.fillText(k.m, x, y);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      x += w + bosluk;
    }
  });
  ctx.restore();
}

// film greni
const GREN = Array.from({ length: 6 }, (_, k) => {
  const c = tuval(256, 256), x = c.getContext("2d"), d = x.createImageData(256, 256), r = mulberry32(100 + k);
  for (let i = 0; i < 256 * 256; i++) { const v = r() * 255; d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; }
  x.putImageData(d, 0, 0); return c;
});

// ───────── çağrılar (u aralıklarına bağlı)
function cagrilar(t, u, g) {
  const g0 = (uu, sure = 0.55) => clamp((t - uToT(uu)) / sure);
  if (u >= 4.5 && u < 11) {
    const [hx, hy] = ekran([-0.35, 0.135, -0.495]);
    hap(hx, hy, 170, -110, "Çatı kancası", "murekkep", g0(6.9));
    const [mx, my] = ekran([-0.35, 0.0, -0.66]);
    hap(mx, my, -170, -40, "Mertek", "sari", g0(7.4), "ahşap taşıyıcı");
    const [lx, ly] = ekran([-0.12, 0.03, -0.435]);
    hap(lx, ly, -300, 130, "Lata değil", "kirmizi", g0(9.5));
  }
  if (u >= 11 && u < 15) {
    const a = ekran([-0.35, 0.132, -0.495]), b = ekran([0.35, 0.132, -0.495]);
    numara(a[0], a[1], 1, g0(11.2)); numara(b[0], b[1], 2, g0(11.5));
    const r = ekran([0.0, 0.178, -0.495]);
    hap(r[0], r[1], -40, 200, "Alüminyum ray", "mavi", g0(12.4));
  }
  if (u >= 17.5 && u < 18.65) {
    const c = ekran([-1.17, RAY_UST + PH + 0.006, -0.495]);
    hap(c[0], c[1], 120, -170, "Uç kelepçe", "murekkep", g0(17.75), "panel kenarı");
  }
  if (u >= 18.65 && u < 21) {
    const c = ekran([0, RAY_UST + PH + 0.008, -0.495]);
    hap(c[0], c[1], -110, -190, "Ara kelepçe", "sari", g0(18.9), "iki panel arası");
  }
  if (u >= 21) {
    const N = [[-0.22, 0.213, -0.22], [0, 0.22, -0.495], [-0.2, RAY_UST - 0.002, -0.495], [-0.35, 0.132, -0.495], [-0.35, 0.06, -0.529], [-0.35, 0.006, -0.6], [-0.35, -0.09, -0.86]].map((p) => ekran(p).slice(0, 2));
    const p = u < 27 ? ara(u, 23.6, 26.2) : 1;
    const nabiz = u < 27 ? Math.max(0, (t - uToT(26.2)) / 1.2) : (t - uToT(27)) / 1.4;
    yol(N, eIOC(p), u < 27 ? 1 : 0.85, nabiz);
    if (u < 27) {
      const [ux, uy] = ekran([-0.22, 0.213, -0.22]);
      ok(ux, uy - 10, 230, clamp((t - uToT(22.6)) / 0.6));
      hap(N[1][0], N[1][1], 140, -40, "Kelepçe", "sari", g0(23.9));
      hap(N[2][0], N[2][1], -150, 80, "Ray", "sari", g0(24.6));
      hap(N[4][0], N[4][1], 170, 30, "Kanca", "sari", g0(25.25));
      hap(N[6][0], N[6][1], 170, -30, "Mertek", "sari", g0(25.9), "evin iskeleti");
    }
  }
}

// ───────── ana çizim
let simdi = 0;
function ciz(t) {
  const u = tToU(t);
  const g = geceOrani(u);
  montaj(u);
  const { hedef, d } = kameraKur(u);
  isikKur(g, hedef, d);
  gl.render(scene, camera);
  ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  zemin(g);
  ctx.drawImage(gl.domElement, 0, 0);
  // başlık arkası: zemin renginde yumuşak perde (nesne başlığın altına girmesin)
  {
    const c = renk(0xc2c4c3, 0x0b111d, g), rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
    const p = ctx.createLinearGradient(0, 0, 0, 680);
    p.addColorStop(0, `rgba(${rgb},0.96)`); p.addColorStop(0.55, `rgba(${rgb},0.82)`); p.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = p; ctx.fillRect(0, 0, W, 680);
  }
  const ruzgarGuc = u < 4.5 ? 1 : u >= 21 && u < 27 ? ara(u, 21.3, 22.0) * (1 - 0.5 * ara(u, 23.4, 24)) : 0;
  ruzgar(t, ruzgarGuc);
  cagrilar(t, u, g);
  baslik(t, u, g);
  altyazi(t, g);
  // gren
  ctx.save(); ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.07;
  ctx.fillStyle = ctx.createPattern(GREN[Math.floor(t * 30) % 6], "repeat"); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

window.seek = (t) => { simdi = clamp(t, 0, DURATION); ciz(simdi); return true; };
window.SURE = DURATION;
window.__hazir = Promise.all([document.fonts.load("italic 400 60px Serif"), document.fonts.load("800 88px Jakarta"), document.fonts.load("600 50px Jakarta")]).then(() => { ciz(0); return true; });

// önizleme (tarayıcıda açınca)
if (!location.search.includes("render")) {
  const k = document.createElement("div"); k.id = "kontrol";
  k.innerHTML = `<button id="oy">Oynat</button><input id="zm" type="range" min="0" max="${DURATION}" step="0.01" value="0"><span id="et">0.00</span>`;
  document.body.appendChild(k);
  let oynuyor = false, bas = 0, baz = 0;
  const zm = k.querySelector("#zm"), et = k.querySelector("#et"), oy = k.querySelector("#oy");
  const dongu = () => { if (!oynuyor) return; const tt = baz + (performance.now() - bas) / 1000; window.seek(tt); zm.value = tt; et.textContent = tt.toFixed(2); if (tt < DURATION) requestAnimationFrame(dongu); else oynuyor = false; };
  oy.onclick = () => { oynuyor = !oynuyor; baz = simdi; bas = performance.now(); if (oynuyor) dongu(); };
  zm.oninput = () => { window.seek(+zm.value); et.textContent = (+zm.value).toFixed(2); };
}
