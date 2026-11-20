/**
 * Canvas art for the project screens. Mock UI labels here are interface
 * furniture, not personal copy; project facts come from content.ts.
 */

type Ctx = CanvasRenderingContext2D;

const C = {
  bg: '#0B0E15',
  bg2: '#111521',
  panel: '#151a27',
  line: 'rgba(237,239,245,0.09)',
  text: '#EDEFF5',
  muted: '#8A90A2',
  ember: '#FF6B3D',
  ice: '#9FD8FF',
  green: '#C6F36B',
  amber: '#FFC15E',
};

const FONT = `'Manrope Variable', 'Manrope', system-ui, sans-serif`;

function rr(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function text(ctx: Ctx, s: string, x: number, y: number, size: number, color: string, weight = 600, align: CanvasTextAlign = 'left') {
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

export function chromeHeight(H: number) {
  return Math.round(H * 0.068);
}

export function drawChrome(ctx: Ctx, W: number, H: number, title: string, accent: string, isUrl: boolean) {
  const ch = chromeHeight(H);
  ctx.fillStyle = '#0d1018';
  ctx.fillRect(0, 0, W, ch);
  ctx.fillStyle = C.line;
  ctx.fillRect(0, ch - 1, W, 1);
  const r = ch * 0.13;
  ['#FF6B3D', '#3a3f4d', '#3a3f4d'].forEach((c, i) => {
    ctx.beginPath();
    ctx.arc(ch * 0.6 + i * r * 3.2, ch / 2, r, 0, Math.PI * 2);
    ctx.fillStyle = i === 0 ? accent : c;
    ctx.fill();
  });
  const pw = W * 0.42;
  const px = (W - pw) / 2;
  rr(ctx, px, ch * 0.2, pw, ch * 0.6, 2);
  ctx.fillStyle = '#151a25';
  ctx.fill();
  if (isUrl) {
    // tiny lock
    const lx = px + ch * 0.42;
    const ly = ch / 2;
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = Math.max(1, ch * 0.04);
    ctx.beginPath();
    ctx.arc(lx, ly - ch * 0.05, ch * 0.08, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = C.muted;
    ctx.fillRect(lx - ch * 0.11, ly - ch * 0.05, ch * 0.22, ch * 0.17);
  }
  text(ctx, title, W / 2, ch / 2 + 1, ch * 0.3, C.muted, 600, 'center');
}

/** Average luminance (0..1) of an image, from a tiny downscale. */
export function averageLuminance(img: CanvasImageSource): number {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 20;
  const x = c.getContext('2d', { willReadFrequently: true });
  if (!x) return 0.4;
  x.drawImage(img, 0, 0, 32, 20);
  const d = x.getImageData(0, 0, 32, 20).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
  return sum / (d.length / 4);
}

/** Full-bleed screenshot, dimmed by its brightness so light themes don't bloom into glare. */
export function drawScreenshot(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number, lum: number) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y, dw, dh);
  const keep = Math.min(1, Math.max(0.3, 0.22 / Math.max(lum, 0.01)));
  if (keep < 1) {
    ctx.fillStyle = `rgba(6,7,11,${(1 - keep).toFixed(3)})`;
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Logistics: summary cards, Hub → Provincial → Regional network, list */
/* ------------------------------------------------------------------ */

function qr(ctx: Ctx, x: number, y: number, s: number, seed: number) {
  ctx.fillStyle = '#e9ecf3';
  ctx.fillRect(x, y, s, s);
  const n = 7;
  const c = s / n;
  ctx.fillStyle = '#0b0e15';
  let r = seed * 9301 + 49297;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const finder = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4);
      r = (r * 9301 + 49297) % 233280;
      if (finder || r / 233280 > 0.55) ctx.fillRect(x + i * c, y + j * c, c * 0.92, c * 0.92);
    }
}

function statusTag(ctx: Ctx, label: string, color: string, x: number, y: number, size: number) {
  ctx.font = `750 ${size}px ${FONT}`;
  const w = ctx.measureText(label).width + size * 1.4;
  ctx.fillStyle = color + '22';
  ctx.fillRect(x - w, y - size * 0.85, w, size * 1.7);
  text(ctx, label, x - w / 2, y + 1, size, color, 750, 'center');
}

export function drawLogistics(ctx: Ctx, W: number, H: number, time: number, accent: string) {
  const top = chromeHeight(H);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, top, W, H - top);
  const u = W / 100;

  // Sidebar
  const sb = 6.2 * u;
  ctx.fillStyle = '#0d1018';
  ctx.fillRect(0, top, sb, H - top);
  for (let i = 0; i < 6; i++) {
    rr(ctx, sb * 0.28, top + u * 2.4 + i * u * 4.6, sb * 0.44, sb * 0.44, 3);
    ctx.fillStyle = i === 1 ? accent : 'rgba(237,239,245,0.12)';
    ctx.fill();
  }

  const x0 = sb + u * 2;
  const x1 = W - u * 2;
  let y = top + u * 2.2;

  // Summary cards
  const cards: [string, string, string][] = [
    ['Booked today', '1,284', C.ice],
    ['In transit', '612', accent],
    ['At hub', '238', C.amber],
    ['Delivered', '1,017', C.green],
  ];
  const gap = u * 1.4;
  const cw = (x1 - x0 - gap * 3) / 4;
  const chh = u * 9;
  cards.forEach(([label, value, col], i) => {
    const cx = x0 + i * (cw + gap);
    rr(ctx, cx, y, cw, chh, 4);
    ctx.fillStyle = C.panel;
    ctx.fill();
    ctx.fillStyle = col;
    ctx.fillRect(cx, y, u * 0.35, chh);
    text(ctx, label, cx + u * 1.6, y + chh * 0.28, u * 1.35, C.muted, 650);
    text(ctx, value, cx + u * 1.6, y + chh * 0.64, u * 2.9, C.text, 750);
    // sparkline
    ctx.beginPath();
    for (let k = 0; k <= 12; k++) {
      const px = cx + cw * 0.56 + (k / 12) * cw * 0.38;
      const py = y + chh * 0.66 - (Math.sin(k * 0.9 + i * 1.7 + time * 0.6) * 0.5 + 0.5) * chh * 0.32;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = col;
    ctx.lineWidth = u * 0.22;
    ctx.stroke();
  });
  y += chh + u * 1.8;

  // Network panel
  const nw = (x1 - x0) * 0.6;
  const nh = H - y - u * 2;
  rr(ctx, x0, y, nw, nh, 4);
  ctx.fillStyle = C.panel;
  ctx.fill();
  text(ctx, 'Network', x0 + u * 1.6, y + u * 2, u * 1.5, C.text, 750);
  statusTag(ctx, 'LIVE', C.green, x0 + nw - u * 1.6, y + u * 2, u * 1.05);

  const colX = [x0 + nw * 0.16, x0 + nw * 0.5, x0 + nw * 0.84];
  const ny0 = y + u * 6;
  const ny1 = y + nh - u * 3;
  const hub = { x: colX[0], y: (ny0 + ny1) / 2 };
  const prov = [0.3, 0.7].map((f) => ({ x: colX[1], y: ny0 + (ny1 - ny0) * f }));
  const reg = [0.12, 0.42, 0.68, 0.92].map((f) => ({ x: colX[2], y: ny0 + (ny1 - ny0) * f }));
  const links: [{ x: number; y: number }, { x: number; y: number }][] = [
    [hub, prov[0]],
    [hub, prov[1]],
    [prov[0], reg[0]],
    [prov[0], reg[1]],
    [prov[1], reg[2]],
    [prov[1], reg[3]],
  ];
  ['Hub', 'Provincial', 'Regional'].forEach((l, i) => text(ctx, l, colX[i], ny0 - u * 2.2, u * 1.2, C.muted, 650, 'center'));
  ctx.lineWidth = u * 0.2;
  links.forEach(([a, b], i) => {
    ctx.strokeStyle = 'rgba(159,216,255,0.28)';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo((a.x + b.x) / 2, a.y, (a.x + b.x) / 2, b.y, b.x, b.y);
    ctx.stroke();
    // parcels travelling along the link
    for (let p = 0; p < 2; p++) {
      const t = (time * 0.22 + i * 0.37 + p * 0.5) % 1;
      const mt = 1 - t;
      const bx = mt * mt * mt * a.x + 3 * mt * mt * t * ((a.x + b.x) / 2) + 3 * mt * t * t * ((a.x + b.x) / 2) + t * t * t * b.x;
      const by = mt * mt * mt * a.y + 3 * mt * mt * t * a.y + 3 * mt * t * t * b.y + t * t * t * b.y;
      const s = u * 0.9;
      ctx.fillStyle = p ? C.ice : accent;
      ctx.fillRect(bx - s / 2, by - s / 2, s, s);
    }
  });
  const node = (n: { x: number; y: number }, r: number, col: string, pulse: number) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * (1 + pulse * 0.35), 0, Math.PI * 2);
    ctx.fillStyle = col + '33';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  };
  node(hub, u * 2.4, accent, (Math.sin(time * 2.2) + 1) / 2);
  prov.forEach((n, i) => node(n, u * 1.7, C.ice, (Math.sin(time * 2 + i) + 1) / 2));
  reg.forEach((n, i) => node(n, u * 1.25, C.text, (Math.sin(time * 1.8 + i * 1.3) + 1) / 2));

  // Parcel list
  const lx = x0 + nw + u * 1.4;
  const lw = x1 - lx;
  rr(ctx, lx, y, lw, nh, 4);
  ctx.fillStyle = C.panel;
  ctx.fill();
  text(ctx, 'Parcels', lx + u * 1.6, y + u * 2, u * 1.5, C.text, 750);
  const rows: [string, string, string][] = [
    ['DX-24816', 'Out for delivery', accent],
    ['DX-24809', 'In transit', C.ice],
    ['DX-24795', 'Return to shipper', C.amber],
    ['DX-24788', 'Delivered', C.green],
    ['DX-24771', 'In transit', C.ice],
  ];
  const rh = (nh - u * 4.5) / rows.length;
  rows.forEach(([id, status, col], i) => {
    const ry = y + u * 4 + i * rh;
    ctx.fillStyle = C.line;
    ctx.fillRect(lx + u * 1.2, ry, lw - u * 2.4, 1);
    const q = rh * 0.56;
    qr(ctx, lx + u * 1.4, ry + (rh - q) / 2, q, i + 3);
    text(ctx, id, lx + u * 1.4 + q + u * 1.1, ry + rh * 0.36, u * 1.3, C.text, 700);
    text(ctx, 'Isabela → Cagayan', lx + u * 1.4 + q + u * 1.1, ry + rh * 0.66, u * 1.0, C.muted, 600);
    statusTag(ctx, status, col, lx + lw - u * 1.4, ry + rh / 2, u * 0.95);
  });
}

/* ------------------------------------------------------------------ */
/* Delivery: street map with route, pins, arrival chip, order list     */
/* ------------------------------------------------------------------ */

export function drawDelivery(ctx: Ctx, W: number, H: number, time: number, accent: string) {
  const top = chromeHeight(H);
  const u = W / 100;
  const mw = W * 0.63;
  const mh = H - top;

  // Map
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top, mw, mh);
  ctx.clip();
  ctx.fillStyle = '#0c1018';
  ctx.fillRect(0, top, mw, mh);
  // blocks
  ctx.save();
  ctx.translate(mw / 2, top + mh / 2);
  ctx.rotate(-0.22);
  const bs = u * 7.4;
  for (let i = -6; i <= 6; i++)
    for (let j = -5; j <= 5; j++) {
      const park = (i === 2 && j === -1) || (i === 3 && j === -1);
      ctx.fillStyle = park ? 'rgba(198,243,107,0.10)' : (i * 7 + j * 3) % 5 === 0 ? '#161c29' : '#121723';
      ctx.fillRect(i * bs + u * 0.7, j * bs + u * 0.7, bs - u * 1.4, bs - u * 1.4);
    }
  ctx.restore();
  // river
  ctx.strokeStyle = 'rgba(159,216,255,0.16)';
  ctx.lineWidth = u * 3;
  ctx.beginPath();
  ctx.moveTo(-u * 2, top + mh * 0.82);
  ctx.bezierCurveTo(mw * 0.3, top + mh * 0.66, mw * 0.55, top + mh * 1.02, mw + u * 2, top + mh * 0.78);
  ctx.stroke();

  // route
  const pts: [number, number][] = [
    [0.18, 0.28],
    [0.3, 0.33],
    [0.36, 0.5],
    [0.55, 0.45],
    [0.62, 0.62],
    [0.8, 0.7],
  ].map(([a, b]) => [a * mw, top + b * mh]);
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d);
    total += d;
  }
  const progress = 0.15 + ((time * 0.045) % 1) * 0.75;
  const pointAt = (f: number): [number, number] => {
    let dist = f * total;
    for (let i = 0; i < seg.length; i++) {
      if (dist <= seg[i]) {
        const k = dist / seg[i];
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
      }
      dist -= seg[i];
    }
    return pts[pts.length - 1];
  };
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.setLineDash([u * 0.8, u * 0.9]);
  ctx.strokeStyle = 'rgba(237,239,245,0.4)';
  ctx.lineWidth = u * 0.5;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.setLineDash([]);
  // travelled part
  ctx.strokeStyle = accent;
  ctx.lineWidth = u * 0.75;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    if (acc + seg[i - 1] < progress * total) ctx.lineTo(pts[i][0], pts[i][1]);
    else {
      const p = pointAt(progress);
      ctx.lineTo(p[0], p[1]);
      break;
    }
    acc += seg[i - 1];
  }
  ctx.stroke();

  const pin = (x: number, y: number, col: string, glyph: string) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - u * 2.2, y - u * 2.4, x - u * 1.8, y - u * 5, x, y - u * 5);
    ctx.bezierCurveTo(x + u * 1.8, y - u * 5, x + u * 2.2, y - u * 2.4, x, y);
    ctx.fillStyle = col;
    ctx.fill();
    text(ctx, glyph, x, y - u * 3.25, u * 1.5, C.bg, 800, 'center');
  };
  pin(pts[0][0], pts[0][1], C.ice, 'S');
  pin(pts[pts.length - 1][0], pts[pts.length - 1][1], C.green, 'D');

  // rider
  const [rx, ry] = pointAt(progress);
  const pulse = (Math.sin(time * 4) + 1) / 2;
  ctx.beginPath();
  ctx.arc(rx, ry, u * (1.6 + pulse * 1.2), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,107,61,0.22)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rx, ry, u * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(rx, ry, u * 0.45, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // arrival chip
  const mins = Math.max(2, Math.round(14 - progress * 12));
  rr(ctx, u * 2, top + u * 2, u * 17, u * 5.4, 4);
  ctx.fillStyle = 'rgba(11,14,21,0.92)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,107,61,0.55)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  text(ctx, 'Arriving in', u * 3.4, top + u * 3.6, u * 1.15, C.muted, 650);
  text(ctx, `${mins} min`, u * 3.4, top + u * 5.8, u * 2, C.text, 800);
  ctx.restore();

  // Order list
  const lx = mw;
  ctx.fillStyle = C.bg2;
  ctx.fillRect(lx, top, W - lx, mh);
  ctx.fillStyle = C.line;
  ctx.fillRect(lx, top, 1, mh);
  text(ctx, 'Orders', lx + u * 2.4, top + u * 3.4, u * 1.7, C.text, 750);
  const orders: [string, string, string, string][] = [
    ['#1042', '2× Chicken meal', 'On the way', accent],
    ['#1041', 'Milk tea, large', 'Picked up', C.ice],
    ['#1039', 'Pancit canton', 'Preparing', C.amber],
    ['#1036', 'Burger combo', 'Delivered', C.green],
    ['#1033', 'Groceries, 6 items', 'Delivered', C.green],
  ];
  const rh = (mh - u * 7) / orders.length;
  orders.forEach(([id, item, status, col], i) => {
    const y = top + u * 6.4 + i * rh;
    const active = i === 0;
    if (active) {
      ctx.fillStyle = 'rgba(255,107,61,0.08)';
      ctx.fillRect(lx + 1, y, W - lx - 1, rh);
      ctx.fillStyle = accent;
      ctx.fillRect(lx + 1, y, u * 0.35, rh);
    }
    ctx.fillStyle = C.line;
    ctx.fillRect(lx + u * 2, y + rh - 1, W - lx - u * 4, 1);
    text(ctx, id, lx + u * 2.4, y + rh * 0.33, u * 1.15, C.muted, 700);
    text(ctx, item, lx + u * 2.4, y + rh * 0.66, u * 1.45, C.text, 700);
    statusTag(ctx, status, col, W - u * 2, y + rh * 0.36, u * 0.95);
  });
}
