import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Kamui 404 — Obito's dimensional warp effect
   Dark, cinematic, spiral-distortion aesthetic
───────────────────────────────────────────── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Pro:ital,wght@0,300;1,300&display=swap');

  :root {
    --red:    #c0392b;
    --orange: #e67e22;
    --dark:   #0a0705;
    --mid:    #1a0f0a;
    --sharingan: #cc2200;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .kamui-root {
    width: 100%;
    min-height: 100vh;
    background: var(--dark);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    font-family: 'Crimson Pro', serif;
  }

  /* ── Canvas sits behind everything ── */
  .kamui-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  /* ── Vignette overlay ── */
  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center,
      transparent 30%,
      rgba(0,0,0,0.55) 70%,
      rgba(0,0,0,0.92) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* ── Content ── */
  .kamui-content {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  /* ── Sharingan eye ── */
  .eye-wrap {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 2.5rem;
    animation: eyePulse 3s ease-in-out infinite;
  }
  @keyframes eyePulse {
    0%,100% { filter: drop-shadow(0 0 12px #cc220088) drop-shadow(0 0 30px #cc220044); }
    50%      { filter: drop-shadow(0 0 24px #cc2200cc) drop-shadow(0 0 60px #cc220077); }
  }

  .eye-svg { width: 100%; height: 100%; }

  /* tomoe orbit */
  .tomoe-group {
    transform-origin: 60px 60px;
    animation: tomeeSpin 8s linear infinite;
  }
  @keyframes tomeeSpin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }

  /* pupil spiral */
  .pupil-spiral {
    transform-origin: 60px 60px;
    animation: spiralPulse 2s ease-in-out infinite alternate;
  }
  @keyframes spiralPulse {
    from { transform: scale(0.9) rotate(0deg);   }
    to   { transform: scale(1.05) rotate(15deg); }
  }

  /* ── 404 number ── */
  .four-o-four {
    font-family: 'Cinzel', serif;
    font-size: clamp(5rem, 18vw, 11rem);
    font-weight: 900;
    line-height: 1;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #e8c49a 0%, #c0392b 40%, #7a1500 80%, #3d0a00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    animation: glitchIn 1s cubic-bezier(0.23, 1, 0.32, 1) both;
  }

  @keyframes glitchIn {
    0%   { opacity: 0; transform: scale(1.4) rotate(-3deg); filter: blur(20px); }
    60%  { opacity: 1; transform: scale(0.97) rotate(0.5deg); filter: blur(0); }
    80%  { transform: scale(1.01); }
    100% { transform: scale(1) rotate(0); }
  }

  /* Dimensional crack lines on 404 */
  .four-o-four::before {
    content: '404';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #ff6b35 0%, transparent 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: crackFlicker 4s ease-in-out infinite;
    opacity: 0.3;
  }
  @keyframes crackFlicker {
    0%,100% { opacity: 0.25; transform: translate(0,0);        }
    20%      { opacity: 0.5;  transform: translate(-2px, 1px);  }
    40%      { opacity: 0.15; transform: translate(1px, -1px);  }
    70%      { opacity: 0.4;  transform: translate(-1px, 2px);  }
  }

  /* ── Subtitle ── */
  .subtitle {
    font-family: 'Cinzel', serif;
    font-size: clamp(0.65rem, 2.5vw, 0.85rem);
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #8a5a4a;
    margin-top: 0.75rem;
    animation: fadeUp 1.2s ease 0.4s both;
  }

  /* ── Divider ── */
  .kamui-divider {
    width: 180px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c0392b88, transparent);
    margin: 1.8rem auto;
    animation: fadeUp 1s ease 0.6s both;
  }

  /* ── Body text ── */
  .kamui-body {
    font-family: 'Crimson Pro', serif;
    font-style: italic;
    font-size: clamp(0.95rem, 3vw, 1.15rem);
    font-weight: 300;
    color: #9a7060;
    max-width: 340px;
    line-height: 1.8;
    animation: fadeUp 1s ease 0.8s both;
  }

  /* ── CTA Button ── */
  .kamui-btn {
    margin-top: 2.5rem;
    position: relative;
    padding: 0.85rem 2.5rem;
    background: transparent;
    border: 1px solid #c0392b66;
    color: #e8c49a;
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    transition: color 0.4s ease, border-color 0.4s ease;
    animation: fadeUp 1s ease 1s both;
  }

  .kamui-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #c0392b, #7a1500);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: -1;
  }

  .kamui-btn:hover {
    color: #fff;
    border-color: #c0392b;
  }
  .kamui-btn:hover::before { transform: scaleX(1); }

  /* ── Warp ring decorations ── */
  .ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid;
    pointer-events: none;
    animation: ringExpand 4s ease-out infinite;
    opacity: 0;
  }
  .ring:nth-child(1) { animation-delay: 0s;    border-color: #c0392b33; }
  .ring:nth-child(2) { animation-delay: 1.3s;  border-color: #e67e2233; }
  .ring:nth-child(3) { animation-delay: 2.6s;  border-color: #c0392b22; }

  @keyframes ringExpand {
    0%   { width: 60px;  height: 60px;  opacity: 0.7; transform: translate(-50%, -50%); }
    100% { width: 600px; height: 600px; opacity: 0;   transform: translate(-50%, -50%); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* ── Distortion warp text ── */
  .dimension-text {
    position: absolute;
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.5em;
    color: #c0392b22;
    text-transform: uppercase;
    pointer-events: none;
    white-space: nowrap;
    animation: orbitText 20s linear infinite;
    transform-origin: center;
  }
  @keyframes orbitText { from { transform: rotate(0deg) translateX(220px) rotate(0deg); } to { transform: rotate(360deg) translateX(220px) rotate(-360deg); } }
`;

/* ── Sharingan Eye SVG ───────────────────────────────────────────────────── */
function SharinganEye() {
  return (
    <svg className="eye-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#cc2200" stopOpacity="1" />
          <stop offset="60%"  stopColor="#8a1100" stopOpacity="1" />
          <stop offset="100%" stopColor="#3d0500" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="pupilGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#0a0000" />
          <stop offset="100%" stopColor="#1a0500" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sclera */}
      <circle cx="60" cy="60" r="58" fill="#0d0808" />
      {/* Iris */}
      <circle cx="60" cy="60" r="46" fill="url(#irisGrad)" filter="url(#glow)" />
      {/* Inner iris ring */}
      <circle cx="60" cy="60" r="30" fill="none" stroke="#cc440022" strokeWidth="2" />

      {/* Tomoe (the 3 comma shapes) */}
      <g className="tomoe-group" filter="url(#glow)">
        {[0, 120, 240].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 60 60)`}>
            {/* Tomoe body */}
            <ellipse cx="60" cy="32" rx="7" ry="10" fill="#0a0000" />
            {/* Tomoe head (circle) */}
            <circle  cx="60" cy="20" r="5.5" fill="#0a0000" />
          </g>
        ))}
      </g>

      {/* Pupil */}
      <g className="pupil-spiral">
        <circle cx="60" cy="60" r="16" fill="url(#pupilGrad)" />
        {/* Spiral lines inside pupil */}
        <path d="M60 52 Q68 56 60 60 Q52 64 60 68" fill="none" stroke="#cc220033" strokeWidth="1.5" />
        <path d="M52 60 Q56 52 60 60 Q64 68 68 60" fill="none" stroke="#cc220033" strokeWidth="1.5" />
      </g>

      {/* Outer ring glow */}
      <circle cx="60" cy="60" r="57" fill="none" stroke="#cc220033" strokeWidth="2" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#cc220066" strokeWidth="0.5" />
    </svg>
  );
}

/* ── Animated Canvas — spiral warp ─────────────────────────────────────────── */
function KamuiCanvas() {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      // ── Spiral warp lines (Kamui dimension pull) ──
      const numArms  = 6;
      const maxR     = Math.min(W, H) * 0.52;

      for (let arm = 0; arm < numArms; arm++) {
        const armAngle = (arm / numArms) * Math.PI * 2;
        ctx.beginPath();
        for (let i = 0; i <= 300; i++) {
          const pct   = i / 300;
          const r     = pct * maxR;
          const twist = pct * Math.PI * 5 + t * 0.4 + armAngle;
          const x     = cx + r * Math.cos(twist);
          const y     = cy + r * Math.sin(twist);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        const alpha = 0.06 + 0.04 * Math.sin(t + arm);
        ctx.strokeStyle = `rgba(192, 57, 43, ${alpha})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      }

      // ── Concentric distortion rings ──
      for (let ring = 1; ring <= 8; ring++) {
        const r     = (ring / 8) * maxR;
        const phase = t * 0.25 + ring * 0.4;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.04) {
          const wobble = 1 + 0.025 * Math.sin(a * 6 + phase);
          const x = cx + r * wobble * Math.cos(a);
          const y = cy + r * wobble * Math.sin(a);
          a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        const alpha = (0.03 + 0.02 * Math.sin(t * 0.5 + ring)) * (1 - ring / 10);
        ctx.strokeStyle = `rgba(230, 126, 34, ${alpha})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }

      // ── Radial warp rays ──
      const numRays = 24;
      for (let r = 0; r < numRays; r++) {
        const angle = (r / numRays) * Math.PI * 2 + t * 0.08;
        const len   = maxR * (0.3 + 0.7 * Math.abs(Math.sin(t * 0.3 + r * 0.5)));
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + len * Math.cos(angle), cy + len * Math.sin(angle));
        const alpha = 0.015 + 0.01 * Math.abs(Math.sin(t * 0.5 + r));
        ctx.strokeStyle = `rgba(192, 57, 43, ${alpha})`;
        ctx.lineWidth   = 0.5;
        ctx.stroke();
      }

      // ── Floating particles (debris being pulled in) ──
      const seed = Math.floor(t * 0.5);
      for (let p = 0; p < 40; p++) {
        const hash  = (p * 137.508 + seed * 11.3) % 1;
        const angle = ((p * 2.4 + t * (0.1 + (p % 5) * 0.04)) % (Math.PI * 2));
        const r     = maxR * (0.15 + 0.75 * ((p * 0.618 + t * 0.02 * (p % 3 + 1)) % 1));
        const x     = cx + r * Math.cos(angle);
        const y     = cy + r * Math.sin(angle);
        const size  = 0.8 + (p % 4) * 0.5;
        const alpha = 0.3 + 0.4 * Math.abs(Math.sin(t * 0.3 + p));

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = p % 3 === 0
          ? `rgba(230, 126, 34, ${alpha})`
          : `rgba(192, 57, 43, ${alpha})`;
        ctx.fill();
      }

      t += 0.018;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="kamui-canvas" />;
}

/* ── Main 404 Component ────────────────────────────────────────────────────── */
const NotFound = () => {
  const [warping, setWarping] = useState(false);

  const handleReturn = () => {
    setWarping(true);
    setTimeout(() => {
      // Navigate home — replace with your router's navigate if needed
      window.location.href = "/";
    }, 800);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div
        className="kamui-root"
        style={{
          transition: warping ? "opacity 0.8s ease, transform 0.8s ease" : "none",
          opacity: warping ? 0 : 1,
          transform: warping ? "scale(0.1) rotate(720deg)" : "scale(1)",
        }}
      >
        {/* Animated canvas background */}
        <KamuiCanvas />

        {/* Vignette */}
        <div className="vignette" />

        {/* Expanding rings centered */}
        <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 2, pointerEvents: "none" }}>
          <div className="ring" />
          <div className="ring" />
          <div className="ring" />
        </div>

        {/* Orbiting dimension text */}
        <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 2, pointerEvents: "none" }}>
          <span className="dimension-text">KAMUI · DIMENSIONAL VOID · 次元の彼方</span>
        </div>

        {/* Main content */}
        <div className="kamui-content">
          {/* Sharingan eye */}
          <div className="eye-wrap">
            <SharinganEye />
          </div>

          {/* 404 */}
          <div className="four-o-four">404</div>

          {/* Subtitle */}
          <p className="subtitle">Dimensional Rift Detected</p>

          {/* Divider */}
          <div className="kamui-divider" />

          {/* Body */}
          <p className="kamui-body">
            This page has been pulled into another dimension.<br />
            Even Kamui cannot retrieve what no longer exists.
          </p>

          {/* CTA */}
          <button className="kamui-btn" onClick={handleReturn}>
            ← Return to Reality
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;