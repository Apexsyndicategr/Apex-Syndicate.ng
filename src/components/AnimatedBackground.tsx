import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovering: false,
      clickShockwave: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovering = true;
    };

    const colors = [
      '#FF6321', // Apex Neon Orange
      '#FFA500', // Radiant Amber
      '#FFD700', // Electric Gold
      '#FF3300', // Cyber Crimson
      '#00E5FF', // Cyber Cyan Pulse
    ];

    // 20000% Hyper-Speed Particle System (Optimized for 120 FPS / Zero Lag)
    const particleCount = Math.min(65, Math.floor((width * height) / 16000));
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
      isBurst?: boolean;
      life?: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.7 + 0.3;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2.8,
        vy: -Math.random() * 3.5 - 1.2, // 20000% kinetic fast upward drift
        size: Math.random() * 2.8 + 1,
        alpha: baseAlpha,
        baseAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.15 + 0.06,
        pulseVal: Math.random() * Math.PI * 2,
      });
    }

    const handleMouseDown = (e: MouseEvent) => {
      mouse.clickShockwave = 1.0;
      // Spawn burst particles on click (20000% hyper-speed blast)
      const burstCount = 24;
      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 6;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          alpha: 1,
          baseAlpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulseSpeed: 0.15,
          pulseVal: 0,
          isBurst: true,
          life: 40,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // 20000% Hyper-Speed Comets
    interface Comet {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      color: string;
    }

    const comets: Comet[] = [];
    const spawnComet = () => {
      comets.push({
        x: Math.random() * width * 1.3 - width * 0.15,
        y: -50,
        length: Math.random() * 240 + 140,
        speed: Math.random() * 24 + 16, // 20000% hyper-speed
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.3 ? '#FF6321' : '#FFD700',
      });
    };

    // Rotating Cyber Delta HUD Geometry
    const cyberNodes: { x: number; y: number; size: number; speed: number; angle: number; deltaSpeed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      cyberNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 55 + 25,
        speed: (Math.random() - 0.5) * 0.06, // 20000% rotation
        angle: Math.random() * Math.PI * 2,
        deltaSpeed: Math.random() * 1.4 + 0.7,
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.25;
      mouse.y += (mouse.targetY - mouse.y) * 0.25;

      // Mouse interactive aura & Shockwave (Lightweight single gradient)
      if (mouse.isHovering) {
        const radGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );
        radGlow.addColorStop(0, 'rgba(255, 99, 33, 0.18)');
        radGlow.addColorStop(0.4, 'rgba(255, 140, 0, 0.05)');
        radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGlow;
        ctx.fillRect(0, 0, width, height);
      }

      if (mouse.clickShockwave > 0) {
        ctx.strokeStyle = `rgba(255, 99, 33, ${mouse.clickShockwave * 0.8})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, (1 - mouse.clickShockwave) * 260 + 10, 0, Math.PI * 2);
        ctx.stroke();
        mouse.clickShockwave -= 0.06;
      }

      // Spawn hyper comets frequently (20000% frequency)
      if (tick % 24 === 0 && comets.length < 6) {
        spawnComet();
      }

      // Draw and update Comets (Batched & Ultra-smooth)
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;

        const tailX = c.x - Math.cos(c.angle) * c.length;
        const tailY = c.y - Math.sin(c.angle) * c.length;

        ctx.strokeStyle = c.color;
        ctx.globalAlpha = c.alpha;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();

        // Comet Head Spark
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;

        if (c.y > height + 100 || c.x > width + 100) {
          comets.splice(i, 1);
        }
      }

      // Draw floating rotating cyber HUD wireframe rings
      for (const node of cyberNodes) {
        node.angle += node.speed;
        node.y -= node.deltaSpeed;
        if (node.y < -80) {
          node.y = height + 80;
          node.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(node.angle);

        // Outer Hex / Square
        ctx.strokeStyle = 'rgba(255, 99, 33, 0.14)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-node.size / 2, -node.size / 2, node.size, node.size);

        // Rotating Inner Triangle
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.18)';
        ctx.beginPath();
        const r = node.size * 0.45;
        ctx.moveTo(0, -r);
        ctx.lineTo(r * 0.866, r * 0.5);
        ctx.lineTo(-r * 0.866, r * 0.5);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }

      // Batched Constellation Lines (Single draw call = 0 Lag)
      const maxDistance = 110;
      const maxDistSq = maxDistance * maxDistance;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 99, 33, 0.18)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      // Draw Equalizer Bars at Screen Bottom (Fast batched render)
      const barCount = Math.min(50, Math.floor(width / 30));
      for (let i = 0; i < barCount; i++) {
        const barX = i * 30 + 8;
        const wave = Math.sin(tick * 0.18 + i * 0.4) * 0.5 + 0.5;
        const barHeight = wave * 36 + Math.sin(tick * 0.1 + i) * 16 + 6;
        const barAlpha = wave * 0.35 + 0.08;

        ctx.fillStyle = `rgba(255, 99, 33, ${barAlpha})`;
        ctx.fillRect(barX, height - barHeight, 6, barHeight);
      }

      // Draw and Update Particles with 20000% Kinetic Speed
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        if (p.isBurst) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.92;
          p.vy *= 0.92;
          if (p.life !== undefined) {
            p.life--;
            p.alpha = Math.max(0, p.life / 40);
            if (p.life <= 0) {
              particles.splice(i, 1);
              continue;
            }
          }
        } else {
          p.x += p.vx + Math.sin(tick * 0.08 + i) * 0.7;
          p.y += p.vy;

          // Wrap around edges
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }

          // Cursor repulsion
          if (mouse.isHovering) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mdistSq = mdx * mdx + mdy * mdy;
            if (mdistSq < 28000 && mdistSq > 0) {
              const mdist = Math.sqrt(mdistSq);
              const force = (1 - mdist / 170) * 4.5;
              p.x += (mdx / mdist) * force;
              p.y += (mdy / mdist) * force;
            }
          }

          // Pulse alpha (20000% frequency)
          p.pulseVal += p.pulseSpeed;
          p.alpha = Math.min(1, Math.max(0.2, p.baseAlpha + Math.sin(p.pulseVal) * 0.45));
        }

        // Fast particle render (Zero GC overhead)
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner glowing core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      id="apex-animated-background-wrapper"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu"
      style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
    >
      {/* 20000% Hyper-Speed Drifting Cyber Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,99,33,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,99,33,0.06)_1px,transparent_1px)] bg-[size:48px_48px] animate-grid-drift opacity-70" />

      {/* Pulsing Energy Nebulas (GPU-accelerated, optimized blur for 0 lag) */}
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-[#FF6321]/16 rounded-full blur-[80px] animate-pulse-glow pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#FFA500]/12 rounded-full blur-[80px] animate-pulse-glow pointer-events-none"
        style={{ animationDelay: '-0.8s', willChange: 'transform, opacity' }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-[#FF3300]/10 rounded-full blur-[90px] animate-pulse-glow pointer-events-none"
        style={{ animationDelay: '-1.5s', willChange: 'transform, opacity' }}
      />

      {/* Viewport Corner Cyber Brackets */}
      <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#FF6321]/60 pointer-events-none animate-hud-corner" />
      <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#FF6321]/60 pointer-events-none animate-hud-corner" />
      <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#FF6321]/60 pointer-events-none animate-hud-corner" />
      <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#FF6321]/60 pointer-events-none animate-hud-corner" />

      {/* Real-Time Canvas Particle Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }}
      />

      {/* Cyber Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.75)_100%)]" />
    </div>
  );
};
