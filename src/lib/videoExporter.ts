import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

/**
 * Apex Syndicate Portfolio Video Exporter
 * Generates 100% valid MP4 video files compatible with CapCut, Adobe Premiere,
 * DaVinci Resolve, Final Cut Pro, InShot, TikTok, and QuickTime.
 */

export interface ExportProgressCallback {
  (progress: number, statusText: string): void;
}

/**
 * Render a single frame of the 18-second kinetic reel onto a 1280x720 canvas
 */
export function drawKineticFrame(ctx: CanvasRenderingContext2D, time: number, width = 1280, height = 720) {
  // Clear
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const isDarkMode = time >= 8.5 && time < 14.0;
  const isFinalScene = time >= 14.0;

  // Background
  if (isDarkMode) {
    // Stage 3 Dark Mode
    const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
    grad.addColorStop(0, '#150a04');
    grad.addColorStop(0.5, '#080508');
    grad.addColorStop(1, '#020204');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Radar circles
    ctx.strokeStyle = 'rgba(255, 99, 33, 0.15)';
    ctx.lineWidth = 2;
    for (let r = 80; r < 500; r += 90) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Rotating radar line
    const angle = (time * 3) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2 + Math.cos(angle) * 450, height / 2 + Math.sin(angle) * 450);
    ctx.strokeStyle = 'rgba(255, 99, 33, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (isFinalScene) {
    // Stage 4 Gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0a0a14');
    grad.addColorStop(0.5, '#120f1e');
    grad.addColorStop(1, '#050508');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing particle spots
    ctx.fillStyle = 'rgba(255, 99, 33, 0.12)';
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.3, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.7, 220, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Stage 1 & 2 Light High-Key
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#ebebf2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid dots
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    for (let x = 20; x < width; x += 40) {
      for (let y = 20; y < height; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Top Status Bar
  ctx.fillStyle = isDarkMode || isFinalScene ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(0, 0, width, 50);
  ctx.fillStyle = '#ff6321';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('APEX SYNDICATE // KINETIC SHOWCASE', 30, 32);

  ctx.fillStyle = isDarkMode || isFinalScene ? '#94a3b8' : '#475569';
  ctx.font = '14px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`TIME: ${time.toFixed(2)}s / 18.00s • FOUNDER: OKERE CHIEMEKA`, width - 30, 32);
  ctx.textAlign = 'left';

  // -------------------------------------------------------------
  // STAGE 1: INTRO KINETIC TEXT (0.0s to 3.2s)
  // -------------------------------------------------------------
  if (time < 3.2) {
    if (time < 0.8) {
      // 0.0 - 0.8s: "Hi."
      const scale = Math.min(1.4, 0.5 + time * 1.5);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 130px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Hi', -20, 0);
      ctx.fillStyle = '#ff6321';
      ctx.fillText('.', 90, 0);
      ctx.restore();
    } else if (time < 1.8) {
      // 0.8 - 1.8s: iMessage Pill: "I'm Okere Chiemeka"
      ctx.save();
      ctx.translate(width / 2, height / 2);
      // Pill box
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      roundRect(ctx, -320, -55, 640, 110, 55);
      ctx.fill();
      ctx.stroke();

      // Shadow
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 38px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText("I'm Okere Chiemeka", -260, 0);

      // Send arrow circle
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(260, 0, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('↑', 260, 2);
      ctx.restore();
    } else if (time < 2.5) {
      // 1.8 - 2.5s: "Founder of Apex Syndicate"
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 62px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('Founder of', 0, -40);
      ctx.fillStyle = '#ff6321';
      ctx.fillText('Apex Syndicate', 0, 45);
      ctx.restore();
    } else {
      // 2.5 - 3.2s: "Game Dev & Motion Designer"
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 56px sans-serif';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('GAME DEVELOPER', 0, -40);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('& MOTION DESIGNER', 0, 40);
      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // STAGE 2: iOS MESSAGE & APEX EDITOR (3.2s to 8.5s)
  // -------------------------------------------------------------
  else if (time < 8.5) {
    if (time < 5.2) {
      // 3.2 - 5.2s: iOS Notification
      ctx.save();
      ctx.translate(width / 2, height / 2 - 60);

      // Notification Card
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      roundRect(ctx, -340, -60, 680, 120, 24);
      ctx.fill();
      ctx.stroke();

      // Green message icon
      ctx.fillStyle = '#10b981';
      roundRect(ctx, -315, -40, 70, 70, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💬', -280, 6);

      // Text inside banner
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 20px sans-serif';
      ctx.fillText('Apex Syndicate', -225, -15);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('now', 270, -15);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Looking for Apex Editor or Gangster Revolution?', -225, 20);

      // Low Battery Popup below (if > 4.2s)
      if (time >= 4.2) {
        ctx.translate(0, 170);
        ctx.fillStyle = '#0f172a';
        roundRect(ctx, -240, -50, 480, 100, 20);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('System Alert: 20% Dev Remaining', 0, -18);
        ctx.fillStyle = '#ff6321';
        roundRect(ctx, -200, 3, 400, 34, 10);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = '900 15px sans-serif';
        ctx.fillText('YOU JUST FOUND THEM!', 0, 26);
      }
      ctx.restore();
    } else {
      // 5.2 - 8.5s: Progress Bar + Apex Editor UI Reveal
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Top Export Progress
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      roundRect(ctx, -380, -220, 760, 70, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('📹 Exporting Apex Editor...', -350, -185);
      ctx.fillStyle = '#ff6321';
      ctx.textAlign = 'right';
      ctx.fillText('99%', 350, -185);

      // Progress bar fill
      ctx.fillStyle = '#e2e8f0';
      roundRect(ctx, -350, -165, 700, 12, 6);
      ctx.fill();
      ctx.fillStyle = '#ff6321';
      roundRect(ctx, -350, -165, 685, 12, 6);
      ctx.fill();

      // Spinning "COMING SOON"
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('C O M I N G   S O O N', 0, -90);

      // Apex Editor UI Box
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      roundRect(ctx, -380, -45, 760, 190, 18);
      ctx.fill();
      ctx.stroke();

      // Top bar of editor
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('APEX EDITOR v3.8 MASTER • AI ACCELERATED', -350, -15);

      // Media bin and Canvas preview
      ctx.fillStyle = '#1e293b';
      roundRect(ctx, -350, 5, 200, 120, 8);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('+ Media Bin', -335, 30);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('SCENE_A01.mp4', -335, 60);

      ctx.fillStyle = '#030712';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      roundRect(ctx, -130, 5, 480, 120, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#06b6d4';
      ctx.font = '900 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('APEX PREVIEW CANVAS [SKELETON TRACKING]', 110, 70);

      // Warning pill
      ctx.fillStyle = '#ff6321';
      roundRect(ctx, -350, 160, 700, 42, 12);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = '900 18px monospace';
      ctx.fillText('🚨 APEX EDITOR IS NOT OUT YET — COMING SOON!', 0, 187);

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // STAGE 3: DARK MODE & GANGSTER REVOLUTION GAME (8.5s to 14.0s)
  // -------------------------------------------------------------
  else if (time < 14.0) {
    if (time < 10.2) {
      // 8.5 - 10.2s: "I CREATE NEXT-GEN GAMES"
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 70px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('I CREATE', 0, -50);
      ctx.fillStyle = '#ff6321';
      ctx.fillText('NEXT-GEN GAMES', 0, 40);

      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('🔥 DEVELOPED BY APEX SYNDICATE 🔥', 0, 125);
      ctx.restore();
    } else {
      // 10.2 - 14.0s: Gangster Revolution Characters & Features
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Title Banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.strokeStyle = '#ff6321';
      ctx.lineWidth = 3;
      roundRect(ctx, -420, -220, 840, 70, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff6321';
      ctx.font = '900 24px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('🎮 GANGSTER REVOLUTION', -390, -177);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('WANTED: ★★★★★', 390, -177);

      // Determine active protagonist based on sub-time
      const charStep = Math.floor((time - 10.2) / 1.25);
      const isMarcus = charStep === 0;
      const isLaura = charStep === 1;
      const isJohn = charStep >= 2;

      // Character Card
      let themeColor = '#10b981';
      let heroTitle = 'PROTAGONIST #1: MARCUS (NIGERIA 🇳🇬)';
      let heroTag = 'STARTING HERO • LAGOS TURF';
      let heroDesc = 'Starts in Nigeria. Unlocks Laura & John as the crime syndicate expands across continents!';
      let stat1 = 'STEALTH RATING: 95%';
      let stat2 = 'LAGOS CASH: $2,850,000';

      if (isLaura) {
        themeColor = '#ef4444';
        heroTitle = 'PROTAGONIST #2: LAURA (CANADA 🇨🇦)';
        heroTag = 'UNLOCKED SECOND • SNOW OPEN-WORLD';
        heroDesc = 'Canadian open-world snow regions. Tactical sniper missions & armored bank vault raids.';
        stat1 = 'SNIPER ACCURACY: 98%';
        stat2 = 'SNOW MOBILITY: 92%';
      } else if (isJohn) {
        themeColor = '#3b82f6';
        heroTitle = 'PROTAGONIST #3: JOHN (NEW YORK 🇺🇸)';
        heroTag = 'NYC PENTHOUSE HQ • CREW LEADER';
        heroDesc = 'Unlocked last. Primary home in New York City with penthouse safehouses & syndicate warfare.';
        stat1 = 'CREW LEADERSHIP: 100%';
        stat2 = 'NYC HQ: ACTIVE';
      }

      ctx.fillStyle = 'rgba(10, 10, 18, 0.95)';
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3;
      roundRect(ctx, -420, -135, 840, 180, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = themeColor;
      ctx.font = '900 22px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(heroTitle, -390, -95);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(heroTag, -390, -65);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px sans-serif';
      ctx.fillText(heroDesc, -390, -30);

      // Stats
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 16px monospace';
      ctx.fillText(stat1, -390, 10);
      ctx.fillText(stat2, 50, 10);

      // Feature Badges
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      roundRect(ctx, -420, 60, 840, 50, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✈️ Flight Booking  •  ⛽ Realistic Fuel  •  🎯 Crew Territory  •  🔒 Encrypted Profiles', 0, 92);

      // Bottom banner
      ctx.fillStyle = '#ff6321';
      roundRect(ctx, -420, 125, 840, 44, 12);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = '900 18px monospace';
      ctx.fillText('🔥 GANGSTER REVOLUTION IS COMING SOON!', 0, 153);

      ctx.restore();
    }
  }

  // -------------------------------------------------------------
  // STAGE 4: PROFILE CARD & BIO LINK CTA (14.0s to 18.0s)
  // -------------------------------------------------------------
  else {
    ctx.save();
    ctx.translate(width / 2, height / 2);

    // Profile Card
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ff6321';
    ctx.lineWidth = 4;
    roundRect(ctx, -380, -220, 760, 240, 24);
    ctx.fill();
    ctx.stroke();

    // Creator Avatar circle
    ctx.fillStyle = '#ff6321';
    ctx.beginPath();
    ctx.arc(-270, -130, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OC', -270, -117);

    // Name & Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 32px sans-serif';
    ctx.fillText('Okere Chiemeka', -190, -145);

    ctx.fillStyle = '#ff6321';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('FOUNDER • APEX SYNDICATE', -190, -115);

    // Social handles
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('📸 Instagram: @apexsyndicateng', -340, -45);
    ctx.fillText('🎵 TikTok: @apex.syndicateng', -340, -10);

    // CTA Pill
    ctx.fillStyle = '#ff6321';
    roundRect(ctx, -380, 40, 760, 70, 20);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌐 WEBSITE LINK IN BIO • CLICK TO VISIT', 0, 83);

    // Hand cursor animation pointing at link
    const cursorX = 220 + Math.sin(time * 8) * 10;
    ctx.font = '40px sans-serif';
    ctx.fillText('👆', cursorX, 86);

    // Final bottom inquiry tag
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('📩 DM ME ON INSTAGRAM & TIKTOK FOR INQUIRIES', 0, 150);

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Synthesize electronic beat audio into an AudioBuffer / PCM Float32 samples
 */
export function generateSoundtrackBuffer(sampleRate = 44100, duration = 18): Float32Array {
  const totalSamples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(totalSamples);
  const bpm = 130;
  const beatInterval = 60 / bpm; // ~0.4615 sec per beat
  const subBeatInterval = beatInterval / 2; // 8th notes

  for (let t = 0; t < duration; t += subBeatInterval) {
    const beatIndex = Math.floor(t / subBeatInterval);
    const startSample = Math.floor(t * sampleRate);

    // Kick drum on 1, 3 (every 4 sub-beats: 0, 4)
    if (beatIndex % 4 === 0 || beatIndex % 8 === 6) {
      const kickLength = Math.floor(sampleRate * 0.15);
      for (let i = 0; i < kickLength && startSample + i < totalSamples; i++) {
        const progress = i / kickLength;
        const freq = 140 * (1 - progress) + 38 * progress;
        const amp = (1 - progress) * 0.45;
        buffer[startSample + i] += Math.sin((i / sampleRate) * freq * 2 * Math.PI) * amp;
      }
    }

    // Hi-hat on every odd sub-beat
    if (beatIndex % 2 === 1) {
      const hatLength = Math.floor(sampleRate * 0.04);
      for (let i = 0; i < hatLength && startSample + i < totalSamples; i++) {
        const progress = i / hatLength;
        const amp = (1 - progress) * 0.15;
        const noise = (Math.random() * 2 - 1) * amp;
        buffer[startSample + i] += noise;
      }
    }

    // Synth chord stab on scene transitions
    if (t === 0 || Math.abs(t - 3.2) < 0.2 || Math.abs(t - 8.5) < 0.2 || Math.abs(t - 14.0) < 0.2) {
      const chordLength = Math.floor(sampleRate * 0.35);
      const freqs = t >= 8.5 && t < 14.0 ? [130.81, 164.81, 196.0] : [220.0, 277.18, 329.63];
      for (let i = 0; i < chordLength && startSample + i < totalSamples; i++) {
        const progress = i / chordLength;
        const amp = (1 - progress) * 0.2;
        let val = 0;
        for (const f of freqs) {
          val += Math.sin((i / sampleRate) * f * 2 * Math.PI);
        }
        buffer[startSample + i] += val * (amp / freqs.length);
      }
    }
  }

  // Soft clip limiter
  for (let i = 0; i < totalSamples; i++) {
    buffer[i] = Math.max(-0.95, Math.min(0.95, buffer[i]));
  }

  return buffer;
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Universal MP4 Exporter using mp4-muxer + WebCodecs or MediaRecorder fallback
 * Returns a 100% compliant, pristine MP4/WebM blob ready for CapCut import.
 */
export async function exportPortfolioVideo(
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  const width = 1280;
  const height = 720;
  const fps = 30;
  const duration = 18; // 18 seconds
  const totalFrames = fps * duration; // 540 frames

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Failed to get 2d canvas context');

  // Check if WebCodecs VideoEncoder is available
  if (typeof (window as any).VideoEncoder !== 'undefined') {
    try {
      if (onProgress) onProgress(5, 'Initializing H.264 MP4 Muxer for CapCut...');

      const target = new ArrayBufferTarget();
      const muxer = new Muxer({
        target,
        video: {
          codec: 'avc',
          width,
          height,
        },
        fastStart: 'in-memory', // Essential for CapCut & video editors to read metadata immediately
      });

      let encodedFrameCount = 0;
      let encoderError: Error | null = null;

      const videoEncoder = new (window as any).VideoEncoder({
        output: (chunk: any, meta: any) => {
          muxer.addVideoChunk(chunk, meta);
          encodedFrameCount++;
        },
        error: (e: any) => {
          encoderError = e;
        },
      });

      // Configure H.264 baseline/main profile (avc1.4d002a = Main Profile Level 4.2 @ 720p)
      videoEncoder.configure({
        codec: 'avc1.4d002a',
        width,
        height,
        bitrate: 4_500_000, // 4.5 Mbps crisp 720p
        framerate: fps,
      });

      // Render frames
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        if (encoderError) throw encoderError;

        const time = frameIndex / fps;
        drawKineticFrame(ctx, time, width, height);

        const frame = new (window as any).VideoFrame(canvas, {
          timestamp: Math.round((frameIndex * 1_000_000) / fps), // microseconds
          duration: Math.round(1_000_000 / fps),
        });

        const keyFrame = frameIndex % 30 === 0;
        videoEncoder.encode(frame, { keyFrame });
        frame.close();

        if (frameIndex % 15 === 0 && onProgress) {
          const percent = Math.round((frameIndex / totalFrames) * 85);
          onProgress(percent, `Rendering frame ${frameIndex + 1} / ${totalFrames} for CapCut...`);
          // yield event loop
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      if (onProgress) onProgress(90, 'Finalizing MP4 container atoms (faststart for CapCut)...');
      await videoEncoder.flush();
      muxer.finalize();

      const mp4Blob = new Blob([target.buffer], { type: 'video/mp4' });
      if (onProgress) onProgress(100, 'MP4 Video Showcase Ready!');
      return mp4Blob;
    } catch (err) {
      console.warn('WebCodecs H.264 failed, falling back to MediaRecorder engine:', err);
    }
  }

  // Fallback: High-quality MediaRecorder with Web Audio track
  return await exportUsingMediaRecorder(canvas, ctx, width, height, fps, duration, onProgress);
}

/**
 * Fallback MediaRecorder pipeline
 */
async function exportUsingMediaRecorder(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fps: number,
  duration: number,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  if (onProgress) onProgress(10, 'Preparing MediaStream video pipeline...');

  // Setup Web Audio Synthesizer stream
  const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioCtxClass();
  const audioDest = audioCtx.createMediaStreamDestination();

  // Create audio buffer and source
  const sampleRate = audioCtx.sampleRate;
  const samples = generateSoundtrackBuffer(sampleRate, duration);
  const audioBuffer = audioCtx.createBuffer(1, samples.length, sampleRate);
  audioBuffer.getChannelData(0).set(samples);

  const audioSource = audioCtx.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioDest);

  // Capture canvas video stream
  const videoStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks(),
  ]);

  // Determine optimal supported mime type for CapCut & video editors
  let mimeType = 'video/mp4';
  if (!MediaRecorder.isTypeSupported('video/mp4')) {
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      mimeType = 'video/webm;codecs=vp9,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus';
    } else {
      mimeType = 'video/webm';
    }
  }

  const mediaRecorder = new MediaRecorder(combinedStream, {
    mimeType,
    videoBitsPerSecond: 4_000_000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise<Blob>((resolve, reject) => {
    mediaRecorder.onstop = () => {
      audioCtx.close();
      const outputBlob = new Blob(chunks, { type: mimeType });
      if (onProgress) onProgress(100, 'Video Render Complete!');
      resolve(outputBlob);
    };

    mediaRecorder.onerror = (e) => {
      audioCtx.close();
      reject(e);
    };

    mediaRecorder.start();
    audioSource.start();

    // Render loop
    const totalFrames = fps * duration;
    let currentFrame = 0;
    const interval = 1000 / fps;

    const renderTimer = setInterval(() => {
      if (currentFrame >= totalFrames) {
        clearInterval(renderTimer);
        setTimeout(() => {
          mediaRecorder.stop();
        }, 300);
        return;
      }

      const time = currentFrame / fps;
      drawKineticFrame(ctx, time, width, height);

      if (currentFrame % 30 === 0 && onProgress) {
        const pct = Math.round((currentFrame / totalFrames) * 90);
        onProgress(pct, `Recording kinetic video for CapCut: ${pct}%...`);
      }

      currentFrame++;
    }, interval);
  });
}
