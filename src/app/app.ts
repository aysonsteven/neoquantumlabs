import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('neoquantum');
  readonly year = new Date().getFullYear();

  constructor() {
    // Defer to ensure document.head is ready
    queueMicrotask(() => this.setFavicon());
  }

  private setFavicon() {
    try {
      const size = 64; // crisp on most displays
      const cx = size / 2;
      const cy = size / 2;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      ctx.imageSmoothingEnabled = true;

      // Glow shadow
      ctx.shadowColor = 'rgba(157, 78, 221, 0.65)';
      ctx.shadowBlur = size * 0.22;

      // Gradient stroke
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#00F0FF');
      grad.addColorStop(1, '#9D4EDD');

      // Central ring
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(1, size * 0.08);
      ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2);
      ctx.stroke();

      // Orbits (ellipses via scale)
      const drawEllipse = (rx: number, ry: number, alpha: number, rot: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(rx, ry);
        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(1, size * 0.045);
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };
      drawEllipse(1.0, 0.38, 0.75, 0); // horizontal
      drawEllipse(0.38, 1.0, 0.45, 0); // vertical

      // Accent dot
      ctx.globalAlpha = 1;
      ctx.shadowBlur = size * 0.12;
      ctx.fillStyle = '#00F0FF';
      ctx.beginPath();
      ctx.arc(cx + size * 0.28, cy, size * 0.08, 0, Math.PI * 2);
      ctx.fill();

      const href = canvas.toDataURL('image/png');
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.type = 'image/png';
      link.href = href;
    } catch {}
  }
}
