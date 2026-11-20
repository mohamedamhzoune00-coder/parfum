import React, { useEffect, useRef } from 'react';

/**
 * PerfumeBackground
 * Luxury liquid gold fragrance waves with floating glowing aromatic particles.
 * Directly inspired by high-end perfume campaigns (Chanel, Dior, Tom Ford).
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

    // Golden scent dust / aromatic luminous particles
    let particles = [];
    const count = width < 768 ? 24 : 45;

    const colors = [
      'rgba(214, 180, 124, ', // Champagne Gold #D6B47C
      'rgba(245, 230, 200, ', // Warm Glow Ivory
      'rgba(201, 154, 139, ', // Rose Gold #C99A8B
      'rgba(217, 164, 65, ',  // Amber Gold #D9A441
      'rgba(255, 255, 255, ', // Pure Star Shimmer
    ];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.6,
          baseAlpha: Math.random() * 0.55 + 0.2,
          speedAlpha: Math.random() * 0.02 + 0.01,
          phase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.25) * 0.35,
          vy: -(Math.random() * 0.45 + 0.15), // Floating gently upward
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initParticles();

    // Mouse parallax factor for delicate interactive fragrance breeze
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

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Draw floating golden stardust
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.speedAlpha;

          // Wrap around seamlessly
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }
          if (p.x < -15) p.x = width + 15;
          if (p.x > width + 15) p.x = -15;
        }

        const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));

        // Soft halo glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
        glow.addColorStop(0, `${p.color}${alpha})`);
        glow.addColorStop(0.4, `${p.color}${alpha * 0.4})`);
        glow.addColorStop(1, `${p.color}0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Shimmering core
        ctx.fillStyle = `${p.color}${Math.min(1, alpha * 1.6)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
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
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Exact Luxury Liquid Gold Fragrance Wave Image with Slow Majestic Breathing Motion */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src="/luxury-perfume-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center lg:object-[center_25%] animate-luxury-float opacity-80 filter saturate-[1.08] contrast-[1.02]"
          loading="eager"
        />
      </div>

      {/* 2. Soft Ambient Vignette & Warm Ivory Overlays to ensure text & buttons are perfectly readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/65 via-[#FFFDF9]/20 to-[#FFFDF9]/90" />
      <div className="absolute inset-0 bg-radial-[at_50%_35%] from-transparent via-[#FFFDF9]/30 to-[#FFFDF9]/80" />

      {/* 3. Subtle Warm Golden Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#D6B47C]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#E8D6BD]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* 4. Canvas for Real-time Floating Golden Stardust & Aromatic Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
