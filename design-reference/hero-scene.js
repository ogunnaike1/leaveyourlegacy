// <halden-scene> — procedural placeholder for the hero product film.
// Architectural room (concrete floor, plaster walls, steel-framed window) + Form Bench built from PBR primitives.
// Scroll progress is read from the closest [data-pin] ancestor. To use a real model, set attribute
// model="path/to/bench.glb" — the procedural bench is replaced once GLTFLoader resolves it (see loadModel()).
(function () {
  if (customElements.get('halden-scene')) return;
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);

  function noiseCanvas(size, base, spread, blobs, grain) {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, size, size);
    for (let i = 0; i < blobs.n; i++) {
      const x = Math.random() * size, y = Math.random() * size, r = blobs.min + Math.random() * (blobs.max - blobs.min);
      const light = Math.random() > 0.5;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, light ? `rgba(255,255,255,${blobs.a})` : `rgba(0,0,0,${blobs.a})`);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr;
      for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
        if (x + dx + r < 0 || x + dx - r > size || y + dy + r < 0 || y + dy - r > size) continue;
        g.save(); g.translate(dx, dy); g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
      }
    }
    const d = g.getImageData(0, 0, size, size), p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const n = (Math.random() - 0.5) * grain;
      p[i] += n; p[i + 1] += n; p[i + 2] += n;
    }
    g.putImageData(d, 0, 0);
    return c;
  }

  class HaldenScene extends HTMLElement {
    connectedCallback() {
      Object.assign(this.style, { display: 'block', position: 'absolute', inset: '0', width: '100%', height: '100%' });
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.lite = matchMedia('(max-width: 760px)').matches || (navigator.hardwareConcurrency || 8) <= 4;
      this.p = 0; this.target = 0; this.visible = true; this.alive = true;
      import(THREE_URL).then(T => { if (this.alive) this.init(T); }).catch(e => console.warn('[halden-scene]', e));
    }
    disconnectedCallback() {
      this.alive = false;
      removeEventListener('scroll', this._onScroll); removeEventListener('resize', this._onWin);
      this._ro && this._ro.disconnect(); this._io && this._io.disconnect();
      if (this.renderer) { this.renderer.dispose(); this.renderer.domElement.remove(); }
    }
    readProgress() {
      const pin = this.closest('[data-pin]');
      if (!pin) return 0;
      const r = pin.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
    }
    init(T) {
      this.T = T;
      const R = new T.WebGLRenderer({ antialias: !this.lite, powerPreference: 'high-performance', preserveDrawingBuffer: true });
      R.setPixelRatio(Math.min(devicePixelRatio, this.lite ? 1.25 : 1.75));
      R.outputColorSpace = T.SRGBColorSpace;
      R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 0.95;
      R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
      Object.assign(R.domElement.style, { width: '100%', height: '100%', display: 'block', opacity: '0', transition: 'opacity 1.6s ease' });
      this.appendChild(R.domElement); this.renderer = R;

      const S = new T.Scene(); this.scene = S;
      S.background = new T.Color('#141311');
      S.fog = new T.Fog('#141311', 9, 18);
      this.camera = new T.PerspectiveCamera(30, 1, 0.1, 40);

      // Environment for reflections: a dim room with one bright window panel.
      const pm = new T.PMREMGenerator(R), env = new T.Scene();
      const envBox = new T.Mesh(new T.BoxGeometry(12, 6, 12), new T.MeshBasicMaterial({ color: '#2b2824', side: T.BackSide }));
      envBox.position.y = 3; env.add(envBox);
      const win = new T.Mesh(new T.PlaneGeometry(5, 3.4), new T.MeshBasicMaterial({ color: new T.Color('#fff1de').multiplyScalar(6) }));
      win.position.set(-5.9, 2.2, 0); win.rotation.y = Math.PI / 2; env.add(win);
      const top = new T.Mesh(new T.PlaneGeometry(4, 4), new T.MeshBasicMaterial({ color: new T.Color('#ffe2c2').multiplyScalar(1.2) }));
      top.position.set(1, 5.9, -1); top.rotation.x = Math.PI / 2; env.add(top);
      S.environment = pm.fromScene(env, 0.04).texture;

      const tex = (canvas, srgb, rep) => {
        const t = new T.CanvasTexture(canvas);
        if (srgb) t.colorSpace = T.SRGBColorSpace;
        t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = 8; return t;
      };
      const ts = this.lite ? 256 : 512;
      // Materials
      const concrete = new T.MeshStandardMaterial({
        map: tex(noiseCanvas(ts, '#8a8680', 0, { n: 260, min: 10, max: 90, a: 0.07 }, 22), true, 5),
        roughnessMap: tex(noiseCanvas(ts, '#9a9a9a', 0, { n: 180, min: 20, max: 120, a: 0.18 }, 30), false, 4),
        roughness: 0.82, metalness: 0, envMapIntensity: 0.5
      });
      const plaster = new T.MeshStandardMaterial({
        map: tex(noiseCanvas(ts, '#b9b0a4', 0, { n: 320, min: 8, max: 70, a: 0.05 }, 14), true, 3),
        bumpMap: tex(noiseCanvas(ts, '#808080', 0, { n: 200, min: 4, max: 30, a: 0.25 }, 40), false, 3),
        bumpScale: 0.6, roughness: 0.95, metalness: 0, envMapIntensity: 0.25
      });
      const steel = new T.MeshStandardMaterial({
        color: '#1a1a19', roughness: 0.48, metalness: 0.15, envMapIntensity: 0.9,
        roughnessMap: tex(noiseCanvas(128, '#7a7a7a', 0, { n: 40, min: 2, max: 10, a: 0.2 }, 60), false, 6)
      });
      const alu = new T.MeshStandardMaterial({ color: '#b8bbbd', roughness: 0.32, metalness: 1, envMapIntensity: 1 });
      const rubber = new T.MeshStandardMaterial({ color: '#0f0f0f', roughness: 0.92, metalness: 0 });
      const leather = new T.MeshPhysicalMaterial({
        color: '#5a3c2a', roughness: 0.58, metalness: 0, sheen: 0.5, sheenRoughness: 0.6, sheenColor: new T.Color('#9a7a62'),
        clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.7,
        bumpMap: tex(noiseCanvas(256, '#808080', 0, { n: 90, min: 1, max: 4, a: 0.35 }, 70), false, 4), bumpScale: 0.35
      });
      const walnut = new T.MeshStandardMaterial({
        map: tex((() => { const c = document.createElement('canvas'); c.width = 64; c.height = 512; const g = c.getContext('2d');
          g.fillStyle = '#4a3326'; g.fillRect(0, 0, 64, 512);
          for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${Math.random() > .5 ? '20,10,5' : '120,85,60'},${0.08 + Math.random() * 0.12})`; g.lineWidth = Math.random() * 3; g.beginPath(); const x = Math.random() * 64; g.moveTo(x, 0); g.bezierCurveTo(x + 6, 170, x - 6, 340, x + 3, 512); g.stroke(); }
          return c; })(), true, 1),
        roughness: 0.55, metalness: 0, envMapIntensity: 0.6
      });
      const urethane = new T.MeshStandardMaterial({ color: '#151514', roughness: 0.68, metalness: 0, envMapIntensity: 0.7 });

      const shadowed = m => { m.castShadow = true; m.receiveShadow = true; return m; };
      const box = (w, h, d, mat, x, y, z, parent) => { const m = shadowed(new T.Mesh(new T.BoxGeometry(w, h, d), mat)); m.position.set(x, y, z); (parent || S).add(m); return m; };
      const rbox = (w, d, h, r, bev, mat) => {
        const s = new T.Shape(), x = -w / 2, y = -d / 2;
        s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
        s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
        s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
        const g = new T.ExtrudeGeometry(s, { depth: h - bev * 2, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: this.lite ? 3 : 6, curveSegments: 10 });
        g.rotateX(-Math.PI / 2); g.center(); g.computeVertexNormals();
        return shadowed(new T.Mesh(g, mat));
      };
      const beam = (a, b, w, h, mat, parent) => {
        const A = new T.Vector3(...a), B = new T.Vector3(...b), len = A.distanceTo(B);
        const m = shadowed(new T.Mesh(new T.BoxGeometry(w, h, len), mat));
        m.position.copy(A).add(B).multiplyScalar(0.5); m.lookAt(B); (parent || S).add(m); return m;
      };
      const cyl = (r, l, mat, seg) => shadowed(new T.Mesh(new T.CylinderGeometry(r, r, l, seg || 32), mat));

      // Room
      const floor = new T.Mesh(new T.PlaneGeometry(20, 20), concrete); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; S.add(floor);
      const back = new T.Mesh(new T.PlaneGeometry(20, 7), plaster); back.position.set(0, 3.5, -3.4); back.receiveShadow = true; S.add(back);
      const W = { x: -3.6, z0: -2.6, z1: 1.8, y0: 0.35, y1: 3.4, H: 4.2 };
      const wallMat = plaster;
      const lw = (z0, z1, y0, y1) => { const m = new T.Mesh(new T.BoxGeometry(0.3, y1 - y0, z1 - z0), wallMat); m.position.set(W.x - 0.15, (y0 + y1) / 2, (z0 + z1) / 2); m.castShadow = m.receiveShadow = true; S.add(m); };
      lw(-3.4, W.z0, 0, W.H); lw(W.z1, 8, 0, W.H); lw(W.z0, W.z1, 0, W.y0); lw(W.z0, W.z1, W.y1, W.H);
      const ceil = new T.Mesh(new T.PlaneGeometry(20, 20), new T.MeshStandardMaterial({ color: '#2a2724', roughness: 1 })); ceil.position.y = W.H; ceil.rotation.x = Math.PI / 2; S.add(ceil);
      const glow = new T.Mesh(new T.PlaneGeometry(W.z1 - W.z0, W.y1 - W.y0), new T.MeshBasicMaterial({ color: new T.Color('#fff3e2').multiplyScalar(2.2) }));
      glow.position.set(W.x - 0.6, (W.y0 + W.y1) / 2, (W.z0 + W.z1) / 2); glow.rotation.y = Math.PI / 2; S.add(glow); this.glow = glow;
      const frameMat = steel;
      [W.z0 + 0.02, (W.z0 + W.z1) / 2, W.z1 - 0.02].forEach(z => box(0.06, W.y1 - W.y0, 0.05, frameMat, W.x - 0.12, (W.y0 + W.y1) / 2, z));
      [W.y0 + 0.02, 1.55, W.y1 - 0.02].forEach(y => box(0.06, 0.05, W.z1 - W.z0, frameMat, W.x - 0.12, y, (W.z0 + W.z1) / 2));
      box(20, 0.06, 0.02, new T.MeshStandardMaterial({ color: '#2a2622', roughness: 0.9 }), 0, 0.03, -3.39); // shadow-gap skirting

      // Background: low walnut rack with dumbbells
      const rack = new T.Group(); rack.position.set(1.9, 0, -2.75); rack.rotation.y = -0.08; S.add(rack);
      box(1.6, 0.04, 0.4, walnut, 0, 0.42, 0, rack);
      [-0.76, 0.76].forEach(x => { box(0.04, 0.42, 0.36, steel, x, 0.21, 0, rack); });
      for (let i = 0; i < 4; i++) {
        const s = 0.07 + i * 0.012, x = -0.55 + i * 0.36;
        const db = new T.Group(); db.position.set(x, 0.44 + s, 0); db.rotation.y = Math.PI / 2; rack.add(db);
        const h = cyl(0.016, 0.14, alu, 16); h.rotation.x = Math.PI / 2; db.add(h);
        [-1, 1].forEach(k => { const hd = cyl(s, 0.07 + i * 0.008, urethane, 40); hd.rotation.x = Math.PI / 2; hd.position.z = k * (0.1 + i * 0.004); db.add(hd); });
      }
      const lamp = new T.Group(); lamp.position.set(3.1, 0, -2.6); S.add(lamp);
      const col = cyl(0.11, 1.2, plaster, 40); col.position.y = 0.6; lamp.add(col);
      const lampLight = new T.PointLight('#ffc78f', 1.6, 3, 2); lampLight.position.set(0, 1.25, 0.05); lamp.add(lampLight);
      const lampTop = new T.Mesh(new T.CircleGeometry(0.09, 32), new T.MeshBasicMaterial({ color: new T.Color('#ffd9ad').multiplyScalar(2) })); lampTop.rotation.x = -Math.PI / 2; lampTop.position.y = 1.201; lamp.add(lampTop);

      // Form Bench (procedural placeholder)
      const bench = new T.Group(); S.add(bench); this.bench = bench;
      box(0.6, 0.05, 0.075, steel, 0, 0.04, 0.6, bench);
      box(0.52, 0.05, 0.075, steel, 0, 0.04, -0.62, bench);
      [-1, 1].forEach(k => {
        const f = cyl(0.03, 0.03, rubber, 20); f.position.set(k * 0.27, 0.015, -0.62); bench.add(f);
        const w = cyl(0.04, 0.03, rubber, 28); w.rotation.z = Math.PI / 2; w.position.set(k * 0.32, 0.045, 0.6); bench.add(w);
        const hub = cyl(0.016, 0.034, alu, 16); hub.rotation.z = Math.PI / 2; hub.position.set(k * 0.32, 0.045, 0.6); bench.add(hub);
      });
      box(0.075, 0.075, 1.3, steel, 0, 0.1, -0.01, bench);
      box(0.075, 0.24, 0.075, steel, 0, 0.255, 0.2, bench);
      beam([0, 0.12, 0.5], [0, 0.34, 0.27], 0.06, 0.06, steel, bench);
      box(0.22, 0.012, 0.3, steel, 0, 0.383, 0.21, bench);
      const seat = rbox(0.28, 0.36, 0.075, 0.05, 0.018, leather); seat.position.set(0, 0.427, 0.22); bench.add(seat);
      const pivot = new T.Group(); pivot.position.set(0, 0.398, 0.02); pivot.rotation.x = 0.38; bench.add(pivot); this.pivot = pivot;
      box(0.22, 0.012, 0.74, steel, 0, -0.008, -0.42, pivot);
      const backPad = rbox(0.28, 0.84, 0.075, 0.06, 0.018, leather); backPad.position.set(0, 0.036, -0.45); pivot.add(backPad);
      // stitching line
      const stitch = new T.Mesh(new T.BoxGeometry(0.282, 0.003, 0.844), new T.MeshStandardMaterial({ color: '#2e2016', roughness: 0.9 }));
      stitch.position.set(0, 0.02, -0.45); pivot.add(stitch);
      const tip = new T.Vector3(0, -0.01, -0.5).applyEuler(pivot.rotation).add(pivot.position);
      beam([0, 0.14, -0.42], [0, tip.y, tip.z], 0.055, 0.055, steel, bench);
      box(0.05, 0.022, 0.42, alu, 0, 0.148, -0.32, bench);
      for (let i = 0; i < 7; i++) box(0.052, 0.018, 0.012, steel, 0, 0.165, -0.5 + i * 0.055, bench);
      const pin = cyl(0.018, 0.06, alu, 24); pin.rotation.z = Math.PI / 2; pin.position.set(0.07, 0.3, 0.2); bench.add(pin);
      const knob = cyl(0.026, 0.02, rubber, 24); knob.rotation.z = Math.PI / 2; knob.position.set(0.105, 0.3, 0.2); bench.add(knob);
      const handle = cyl(0.014, 0.4, alu, 20); handle.rotation.z = Math.PI / 2; handle.position.set(0, 0.09, -0.69); bench.add(handle);
      [-0.19, 0.19].forEach(x => box(0.02, 0.06, 0.06, steel, x, 0.07, -0.67, bench));

      // Contact shadow (soft occlusion beneath the bench)
      const cs = document.createElement('canvas'); cs.width = cs.height = 128; const cg = cs.getContext('2d');
      const gr = cg.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      cg.fillStyle = gr; cg.fillRect(0, 0, 128, 128);
      const ao = new T.Mesh(new T.PlaneGeometry(0.9, 1.8), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cs), transparent: true, depthWrite: false }));
      ao.rotation.x = -Math.PI / 2; ao.position.y = 0.002; bench.add(ao);

      // Lighting — window sun, warm ceiling wash, low ambient
      S.add(new T.HemisphereLight('#d9d2c8', '#2a2622', 0.18));
      const sun = new T.DirectionalLight('#ffdcb4', 2.6); sun.position.set(-7, 4.6, 0.6); sun.target.position.set(0.4, 0, -0.4);
      sun.castShadow = true; sun.shadow.mapSize.set(this.lite ? 1024 : 2048, this.lite ? 1024 : 2048);
      Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 3.5, bottom: -3.5, near: 1, far: 16 });
      sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; sun.shadow.radius = 5;
      S.add(sun, sun.target); this.sun = sun;
      const wash = new T.SpotLight('#ffdcb8', 14, 7, 0.75, 1, 2); wash.position.set(0.8, 3.9, -2.4); wash.target.position.set(0.8, 0.6, -3.4);
      S.add(wash, wash.target); this.wash = wash;
      const key = new T.SpotLight('#fff2e2', 8, 8, 0.5, 1, 2); key.position.set(2.2, 3.4, 2.2); key.target.position.set(0, 0.3, 0); S.add(key, key.target); this.key = key;

      this.cA = new T.Color('#ffd2a6'); this.cB = new T.Color('#f4efe8'); this.tmp = new T.Color();

      this._onScroll = () => { this.target = this.readProgress(); this.kick(); };
      addEventListener('scroll', this._onScroll, { passive: true });
      this._ro = new ResizeObserver(() => this.resize()); this._ro.observe(this);
      this._io = new IntersectionObserver(([e]) => { this.visible = e.isIntersecting; if (this.visible) this.kick(); }); this._io.observe(this);
      this.target = this.p = this.readProgress();
      this.resize();
      requestAnimationFrame(() => { R.domElement.style.opacity = '1'; });
      this._onWin = () => this.resize(); addEventListener('resize', this._onWin);
      [100, 400, 1200].forEach(t => setTimeout(() => this.alive && this.resize(), t));
      const model = this.getAttribute('model'); if (model) this.loadModel(model);
    }
    // Swap the procedural bench for a production GLB when available.
    loadModel(url) {
      import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js/+esm').then(({ GLTFLoader }) => {
        new GLTFLoader().load(url, g => {
          g.scene.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; } });
          this.bench.clear(); this.bench.add(g.scene); this.kick();
        });
      }).catch(e => console.warn('[halden-scene] GLB load failed', e));
    }
    resize() {
      if (!this.renderer) return;
      const w = this.clientWidth || 1, h = this.clientHeight || 1;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h; this.mobile = w < 760; this.w = w; this.h = h;
      this.camera.fov = this.mobile ? 42 : 30;
      this.camera.updateProjectionMatrix();
      this.draw();
    }
    kick() { if (!this.raf && this.visible && this.renderer) this.raf = requestAnimationFrame(() => this.tick()); }
    tick() {
      this.raf = 0;
      const k = this.reduced ? 1 : 0.075;
      this.p += (this.target - this.p) * k;
      if (Math.abs(this.target - this.p) < 0.0004) this.p = this.target; else this.kick();
      this.draw();
    }
    draw() {
      const T = this.T; if (!T) return;
      if ((this.w || 0) <= 1 && this.clientWidth > 1) { this.resize(); return; }
      const p = ease(clamp(this.p, 0, 1));
      const cam = this.camera;
      const az = lerp(0.92, 0.26, p), rad = lerp(this.mobile ? 4.6 : 3.7, this.mobile ? 3.9 : 3.05, p), hgt = lerp(1.35, 0.95, p);
      const tgt = new T.Vector3(lerp(0, -0.05, p), lerp(0.38, 0.34, p), lerp(-0.05, -0.15, p));
      cam.position.set(tgt.x + Math.sin(az) * rad, hgt, tgt.z + Math.cos(az) * rad);
      cam.lookAt(tgt);
      // Shift the product right while headline sits left, then centre/left as specs appear
      if (!this.mobile) {
        const a = ease(clamp((this.p - 0.18) / 0.3, 0, 1)), b = ease(clamp((this.p - 0.66) / 0.24, 0, 1));
        const shift = lerp(lerp(-0.17, 0.13, a), -0.16, b);
        cam.setViewOffset(this.w, this.h, shift * this.w, 0, this.w, this.h);
      } else { cam.setViewOffset(this.w, this.h, 0, -0.08 * this.h, this.w, this.h); }
      this.bench.rotation.y = lerp(-0.12, 0.1, p);
      this.pivot.rotation.x = lerp(0.38, 0.62, ease(clamp((this.p - 0.35) / 0.4, 0, 1)));
      this.sun.color.copy(this.tmp.copy(this.cA).lerp(this.cB, p));
      this.sun.intensity = lerp(2.7, 2.0, p);
      this.sun.position.set(-7, lerp(4.6, 5.6, p), lerp(0.6, -0.6, p));
      this.wash.intensity = lerp(12, 20, p);
      this.renderer.toneMappingExposure = lerp(0.92, 1.02, p);
      this.renderer.render(this.scene, cam);
    }
  }
  customElements.define('halden-scene', HaldenScene);
})();
