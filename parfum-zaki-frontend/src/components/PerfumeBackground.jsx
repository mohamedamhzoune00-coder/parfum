import React, { useEffect, useRef } from 'react';

/**
 * PerfumeBackground
 * Luxury liquid gold fragrance waves with floating glowing aromatic particles.
 * Directly using the uploaded luxury perfume golden ribbons backdrop.
 */
export default function PerfumeBackground({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Golden scent dust particles floating over the liquid gold waves
    let particles = [];
    const count = width < 768 ? 20 : 38;

    const colors = [
      'rgba(214, 180, 124, ', // Champagne Gold
      'rgba(255, 245, 225, ', // Warm Luminous Ivory
      'rgba(201, 154, 139, ', // Rose Gold
      'rgba(217, 164, 65, ',  // Amber Gold
      'rgba(255, 255, 255, ', // Pure Star Shimmer
    ];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.4 + 0.8,
          baseAlpha: Math.random() * 0.6 + 0.25,
          speedAlpha: Math.random() * 0.025 + 0.01,
          phase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.3) * 0.4,
          vy: -(Math.random() * 0.5 + 0.2), // Floating upward
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initParticles();

    // Mouse parallax for interactive breeze
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          render();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Draw floating golden stardust
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.speedAlpha;

          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
          if (p.x < -15) p.x = width + 15;
          if (p.x > width + 15) p.x = -15;
        }

        const alpha = p.baseAlpha * (0.65 + 0.35 * Math.sin(p.phase));

        // Soft halo glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        glow.addColorStop(0, `${p.color}${alpha})`);
        glow.addColorStop(0.45, `${p.color}${alpha * 0.4})`);
        glow.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Shimmering core
        ctx.fillStyle = `${p.color}${Math.min(1, alpha * 1.8)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.75, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. The High-Resolution Liquid Gold Fragrance Wave Image */}
      <img
        src="/luxury-perfume-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center lg:object-[center_20%] opacity-90 filter saturate-[1.1] contrast-[1.03] animate-luxury-float"
        loading="eager"
      />

      {/* 2. Delicate Translucent Light Blend (Subtle enough so the gold ribbons shine brightly, but text stays crisp) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/40 via-transparent to-[#FFFDF9]/75" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,253,249,0.45)_0%,transparent_70%)]" />

      {/* 3. Real-time Animated Golden Shimmer Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-10"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
