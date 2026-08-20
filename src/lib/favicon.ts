/**
 * Generates and applies the official Apex Syndicate "AS" orange diamond favicon
 * dynamically across all browser tab link tags to guarantee crisp visibility.
 */
export function initializeFavicon() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, 64, 64);

      // Save context for diamond rotation
      ctx.save();
      ctx.translate(32, 32);
      ctx.rotate((45 * Math.PI) / 180);

      // Draw rounded diamond
      const size = 38;
      const radius = 8;
      const x = -size / 2;
      const y = -size / 2;

      // Orange gradient fill
      const grad = ctx.createLinearGradient(x, y, x + size, y + size);
      grad.addColorStop(0, '#FF7A00');
      grad.addColorStop(0.5, '#FF5000');
      grad.addColorStop(1, '#D81800');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();

      // Top highlight
      const highlight = ctx.createLinearGradient(x, y, x, y + size / 2);
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size / 2, [radius, radius, 0, 0]);
      ctx.fill();

      ctx.restore();

      // Draw "AS" text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 24px -apple-system, system-ui, "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AS', 32, 33);

      const dataUrl = canvas.toDataURL('image/png');

      // Update or create favicon link elements
      const updateLink = (rel: string, type?: string) => {
        let link = document.querySelector(`link[rel*='${rel}']`) as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          document.head.appendChild(link);
        }
        if (type) link.type = type;
        link.href = dataUrl;
      };

      updateLink('icon', 'image/png');
      updateLink('shortcut icon', 'image/png');
      updateLink('apple-touch-icon', 'image/png');
    }
  } catch (err) {
    console.warn('Could not generate dynamic canvas favicon:', err);
  }
}
