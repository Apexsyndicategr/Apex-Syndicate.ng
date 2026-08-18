import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracking for interactive glow and particle repulsion
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovering: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particles configuration
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      pulseSpeed: number;
      pulseVal: number;
    }

    const colors = [
      'rgba(255, 99, 33,',   // Apex Orange
      'rgba(255, 140, 0,',   // Dark Orange / Amber
      'rgba(255, 200, 50,',  // Golden Yellow
      'rgba(255, 75, 43,',   // Sunset Coral
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.1, // subtle upward drift
        size: Math.random() * 2.2 + 0.8,
        alpha: baseAlpha,
        baseAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseVal: Math.random() * Math.PI * 2,
      });
    }

    // Floating Cyber Energy Beams / Rings
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw subtle interactive cursor glow if active
      if (mouse.isHovering) {
        const radGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          260
        );
        radGlow.addColorStop(0, 'rgba(255, 99, 33, 0.09)');
        radGlow.addColorStop(0.5, 'rgba(255, 99, 33, 0.03)');
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw Constellation Lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.18 * particles[i].alpha;
            ctx.strokeStyle = `rgba(255, 99, 33, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and Update Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Slight cursor repulsion
        if (mouse.isHovering) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140 && mdist > 0) {
            const force = (1 - mdist / 140) * 1.5;
            p.x += (mdx / mdist) * force;
            p.y += (mdy / mdist) * force;
          }
        }

        // Pulse alpha
        p.pulseVal += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.pulseVal) * 0.25;

        // Draw particle dot with glow
        ctx.fillStyle = `${p.color} ${Math.max(0.05, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra soft halo for bigger particles
        if (p.size > 1.8) {
          ctx.fillStyle = `${p.color} ${Math.max(0.02, p.alpha * 0.3)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Animated Ambient Mesh Glow Orbs */}
      <div className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] bg-gradient-to-br from-[#FF6321]/20 via-[#FF8A50]/10 to-transparent rounded-full blur-[140px] animate-pulse-glow" />
      <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-bl from-[#FF4500]/15 via-[#FF6321]/08 to-transparent rounded-full blur-[130px] animate-float-slow" />
      <div className="absolute -bottom-[15%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#FF6321]/15 via-amber-600/10 to-transparent rounded-full blur-[150px] animate-float-reverse" />

      {/* Cyber Grid Pattern Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

      {/* Subtle Animated Cyber Horizontal Scan Beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6321]/[0.025] to-transparent h-[200px] w-full animate-scanline pointer-events-none" />

      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
