import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Full-page Fire Background Canvas ────────────────────────────────────────
function FireBackground({ intensity }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const intensityRef = useRef(intensity);

  useEffect(() => {
    intensityRef.current = intensity;
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Ember ────────────────────────────────────────────────
    class Ember {
      constructor() { this.reset(true); }
      reset(scatter = false) {
        // Spawn across full bottom width
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = -(1.5 + Math.random() * 3.5);
        this.life = 0;
        this.maxLife = 100 + Math.random() * 140;
        this.size = 1.0 + Math.random() * 3.2;
        this.hue = 15 + Math.random() * 35;
        this.brightness = 55 + Math.random() * 35;
        this.drift = (Math.random() - 0.5) * 0.03;
        this.flickerA = 0.07 + Math.random() * 0.13;
        this.flickerOffset = Math.random() * Math.PI * 2;
        if (scatter) {
          // Pre-spread across screen height at startup
          const skip = Math.random() * this.maxLife * 0.8;
          this.life = skip;
          this.y += this.vy * skip;
          this.x += this.vx * skip;
        }
      }
      get t() { return this.life / this.maxLife; }
      get alpha() {
        if (this.t < 0.08) return this.t / 0.08;
        if (this.t > 0.65) return 1 - (this.t - 0.65) / 0.35;
        return 1;
      }
      update() {
        this.life++;
        this.vx += this.drift;
        this.x += this.vx;
        this.vy *= 0.991;
        this.y += this.vy;
        this.size *= 0.998;
      }
      draw(ctx, globalIntensity) {
        const flicker = 1 - this.flickerA + this.flickerA * Math.sin(this.life * 0.11 + this.flickerOffset);
        const a = this.alpha * flicker * globalIntensity;
        const s = this.size * flicker;
        if (a < 0.01) return;

        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 6);
        grd.addColorStop(0,    `hsla(${this.hue + 10}, 100%, 88%, ${a})`);
        grd.addColorStop(0.2,  `hsla(${this.hue}, 100%, ${this.brightness}%, ${a * 0.75})`);
        grd.addColorStop(0.6,  `hsla(${this.hue - 8}, 95%, 35%, ${a * 0.3})`);
        grd.addColorStop(1,    `hsla(5, 80%, 10%, 0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, s * 6, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    }

    // ── Large licking flame tongue ────────────────────────────
    class FlameTongue {
      constructor() { this.reset(true); }
      reset(scatter = false) {
        this.x = Math.random() * canvas.width;
        this.baseY = canvas.height;
        this.y = this.baseY;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(2 + Math.random() * 4);
        this.life = 0;
        this.maxLife = 60 + Math.random() * 80;
        this.width = 30 + Math.random() * 80;
        this.height = 80 + Math.random() * 200;
        this.hue = 12 + Math.random() * 20;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.04 + Math.random() * 0.04;
        if (scatter) this.life = Math.random() * this.maxLife;
      }
      get t() { return this.life / this.maxLife; }
      get alpha() {
        if (this.t < 0.12) return this.t / 0.12;
        if (this.t > 0.55) return 1 - (this.t - 0.55) / 0.45;
        return 1;
      }
      update() {
        this.life++;
        this.wobble += this.wobbleSpeed;
        this.x += this.vx + Math.sin(this.wobble) * 0.6;
        this.y += this.vy * 0.3;
        this.height *= 0.996;
      }
      draw(ctx, globalIntensity) {
        const a = this.alpha * globalIntensity * 0.55;
        if (a < 0.01) return;
        const tipY = this.y - this.height;

        const grd = ctx.createLinearGradient(this.x, this.baseY, this.x, tipY);
        grd.addColorStop(0,   `hsla(${this.hue}, 100%, 55%, ${a})`);
        grd.addColorStop(0.3, `hsla(${this.hue + 10}, 100%, 65%, ${a * 0.8})`);
        grd.addColorStop(0.7, `hsla(${this.hue + 20}, 90%, 50%, ${a * 0.4})`);
        grd.addColorStop(1,   `hsla(30, 80%, 40%, 0)`);

        ctx.save();
        ctx.beginPath();
        // Flame shape: wide base tapering to a tip with slight wobble
        const w = this.width * (1 - this.t * 0.3);
        ctx.moveTo(this.x - w / 2, this.baseY);
        ctx.quadraticCurveTo(
          this.x - w * 0.6 + Math.sin(this.wobble) * 10,
          this.y - this.height * 0.5,
          this.x + Math.sin(this.wobble + 1) * 8,
          tipY
        );
        ctx.quadraticCurveTo(
          this.x + w * 0.6 + Math.sin(this.wobble + 2) * 10,
          this.y - this.height * 0.5,
          this.x + w / 2,
          this.baseY
        );
        ctx.closePath();
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      }
    }

    // ── Smoke ────────────────────────────────────────────────
    class Smoke {
      constructor() { this.reset(true); }
      reset(scatter = false) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.5 + Math.random() * canvas.height * 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(0.2 + Math.random() * 0.5);
        this.life = 0;
        this.maxLife = 200 + Math.random() * 120;
        this.r = 20 + Math.random() * 50;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.006;
        if (scatter) this.life = Math.random() * this.maxLife;
      }
      get t() { return this.life / this.maxLife; }
      get alpha() {
        if (this.t < 0.1) return (this.t / 0.1) * 0.09;
        if (this.t > 0.5) return (1 - (this.t - 0.5) / 0.5) * 0.09;
        return 0.09;
      }
      update() {
        this.life++;
        this.x += this.vx;
        this.y += this.vy;
        this.r += 0.25;
        this.rot += this.rotV;
      }
      draw(ctx, globalIntensity) {
        const a = this.alpha * globalIntensity;
        if (a < 0.005) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, this.r);
        grd.addColorStop(0,   `rgba(160, 70, 20, ${a})`);
        grd.addColorStop(0.5, `rgba(60,  30,  8, ${a * 0.5})`);
        grd.addColorStop(1,   `rgba(5,   2,   0, 0)`);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      }
    }

    // ── Build pools ──────────────────────────────────────────
    const embers  = Array.from({ length: 200 }, () => new Ember());
    const tongues = Array.from({ length: 25  }, () => new FlameTongue());
    const smokes  = Array.from({ length: 30  }, () => new Smoke());

    const loop = () => {
      animRef.current = requestAnimationFrame(loop);
      const gi = intensityRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ground fire glow — spans full width at bottom
      const groundGlow = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 300);
      groundGlow.addColorStop(0,   `rgba(255, 60,  0, ${0.35 * gi})`);
      groundGlow.addColorStop(0.4, `rgba(200, 25,  0, ${0.18 * gi})`);
      groundGlow.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = groundGlow;
      ctx.fillRect(0, canvas.height - 300, canvas.width, 300);

      // Sides vignette fire tint
      ["left", "right"].forEach(side => {
        const sx = side === "left" ? 0 : canvas.width;
        const ex = side === "left" ? canvas.width * 0.4 : canvas.width * 0.6;
        const sideGrd = ctx.createLinearGradient(sx, 0, ex, 0);
        sideGrd.addColorStop(0,   `rgba(255, 40, 0, ${0.12 * gi})`);
        sideGrd.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = sideGrd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      smokes.forEach(s  => { s.update(); s.draw(ctx, gi); if (s.life >= s.maxLife)  s.reset(); });
      tongues.forEach(f => { f.update(); f.draw(ctx, gi); if (f.life >= f.maxLife)  f.reset(); });
      embers.forEach(e  => { e.update(); e.draw(ctx, gi); if (e.life >= e.maxLife)  e.reset(); });
    };

    loop();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,          // above Three.js (-3) and forest (0), below content (10)
        opacity: intensity > 0 ? 1 : 0,
        transition: "opacity 1.4s ease",
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CharacterStory() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [fireIntensity, setFireIntensity] = useState(0);
  const threeRef  = useRef(null);
  const scrollYRef = useRef(0);
  const particlesRef = useRef(null);
  const cameraRef = useRef(null);

  const characters = {
    warrior: {
      name: "The Brave Warrior",
      accentColor: "#ef4444",
      // Each paragraph = one screen
      story: `Steel and determination carve his path through darkness.

Each scar tells a story of resilience.

The forest trembles beneath his unwavering resolve.`,
    },
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("character") || "warrior";
    setSelectedCharacter(characters[id] || characters.warrior);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY;
      scrollYRef.current = sy;
      setScrollY(sy);

      // viewportHeight = 1 section
      const vh = window.innerHeight;
      // Fire kicks in during section 2 (character reveal) through section 4 (first story para)
      // Section 1: 0–1vh  →  Section 2 (char): 1–2vh  →  Story: 2–Nvh
      const fireStart = vh * 0.8;           // just before char section
      const firePeak  = vh * 1.3;           // fully lit during char reveal
      const fireEnd   = vh * 3.2;           // fades after second story para

      let intensity = 0;
      if (sy >= fireStart && sy < firePeak) {
        intensity = (sy - fireStart) / (firePeak - fireStart);
      } else if (sy >= firePeak && sy < fireEnd) {
        intensity = 1 - (sy - firePeak) / (fireEnd - firePeak);
      }
      setFireIntensity(Math.max(0, Math.min(1, intensity)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Three.js ambient particle field
  useEffect(() => {
    if (!threeRef.current || !selectedCharacter) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top  = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.zIndex = "-3";
    threeRef.current.appendChild(renderer.domElement);

    const geo = new THREE.BufferGeometry();
    const count = 600;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 30;
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.05, color: selectedCharacter.accentColor });
    const mesh = new THREE.Points(geo, mat);
    particlesRef.current = mesh;
    scene.add(mesh);

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const sy = scrollYRef.current;
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0008 + sy * 0.000002;
        particlesRef.current.rotation.x += 0.0004;
      }
      if (cameraRef.current) cameraRef.current.position.z = 5 - sy * 0.003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      if (threeRef.current) threeRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [selectedCharacter]);

  if (!selectedCharacter) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading story...
      </div>
    );
  }

  const paragraphs = selectedCharacter.story.split("\n\n");
  const characterVisible = scrollY > 400;

  return (
    <div className="relative w-full bg-black text-white overflow-x-hidden">

      {/* Three.js ambient background */}
      <div ref={threeRef} className="fixed inset-0 pointer-events-none" />

      {/* 🔥 Full-page fire background — fixed, scroll-driven intensity */}
      <FireBackground intensity={fireIntensity} />

      {/* Forest parallax layers — all fixed full-screen, pure translateY parallax */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        {/* BACK — sky, moon, stars. Slowest. Always fully visible. */}
        <img
          src="/forest-back.png" alt=""
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: 1,
          }}
        />

        {/* MID — pine tree silhouettes. Only bottom 60% so sky stays visible. */}
        <img
          src="/forest-mid.png" alt=""
          style={{
            position: "absolute",
            bottom: 0, left: 0,
            width: "100%",
            height: "60%",
            objectFit: "fill",
            transform: `translateY(${scrollY * 0.25}px)`,
            opacity: 1,
          }}
        />

        {/* FRONT — thick close trunks. Only bottom 40% so trees frame the scene. */}
        <img
          src="/forest-front.png" alt=""
          style={{
            position: "absolute",
            bottom: 0, left: 0,
            width: "100%",
            height: "40%",
            objectFit: "fill",
            transform: `translateY(${scrollY * 0.45}px)`,
            opacity: 1,
          }}
        />

        {/* Darken as user scrolls deeper */}
        <div
          style={{ opacity: Math.min(scrollY * 0.0008, 0.7) }}
          className="absolute inset-0 bg-black transition-opacity duration-300"
        />
      </div>

      {/* Page content */}
      <div className="relative z-10">

        {/* Title screen */}
        <section className="h-screen flex items-center justify-center text-center px-6">
          <h1 className="text-6xl font-bold">{selectedCharacter.name}</h1>
        </section>

        {/* Character reveal */}
        <section className="h-screen flex items-center justify-center">
          <img
            src="/m1.png"
            alt="warrior"
            style={{
              opacity: characterVisible ? 1 : 0,
              transform: `scale(${characterVisible ? 1 : 0.8})`,
              transition: "all 1.5s ease",
            }}
            className="w-96 drop-shadow-2xl"
          />
        </section>

        {/* Story paragraphs */}
        {paragraphs.map((para, i) => (
          <section key={i} className="h-screen flex items-center justify-center px-6">
            <p className="max-w-3xl text-xl leading-relaxed bg-black/40 backdrop-blur-lg p-10 rounded-3xl border border-white/20">
              {para}
            </p>
          </section>
        ))}

        {/* Back button */}
        <section className="h-screen flex items-center justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-12 py-5 text-white text-lg font-bold rounded-full transition-all hover:scale-110"
            style={{ backgroundColor: selectedCharacter.accentColor }}
          >
            Back to Characters
          </button>
        </section>
      </div>
    </div>
  );
}