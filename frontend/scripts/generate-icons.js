import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.resolve(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Minimal pure Node.js PNG encoder
function createPng(width, height, pixelShader) {
  // RGBA buffer with filter byte at start of each scanline
  const rowBytes = width * 4;
  const buffer = Buffer.alloc(height * (rowBytes + 1));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    buffer[offset++] = 0; // Filter: 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelShader(x, y, width, height);
      buffer[offset++] = Math.max(0, Math.min(255, Math.round(r)));
      buffer[offset++] = Math.max(0, Math.min(255, Math.round(g)));
      buffer[offset++] = Math.max(0, Math.min(255, Math.round(b)));
      buffer[offset++] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  const compressed = zlib.deflateSync(buffer, { level: 9 });

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([len, typeAndData, crc]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// Brand gradient shader: #06B6D4 (cyan: 6, 182, 212) to #8B5CF6 (violet: 139, 92, 246)
// on dark background: #0A0D18
function brandShader(isMaskable) {
  return (x, y, w, h) => {
    const nx = x / w;
    const ny = y / h;
    const cx = 0.5;
    const cy = 0.5;
    const dx = nx - cx;
    const dy = ny - cy;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);

    // Dark rounded tile
    const margin = isMaskable ? 0 : 0.08;
    const innerSize = 0.5 - margin;
    const cornerRadius = 0.12;

    // Background tile shape
    let inCard = false;
    if (isMaskable) {
      inCard = true;
    } else {
      const qx = Math.abs(dx) - (innerSize - cornerRadius);
      const qy = Math.abs(dy) - (innerSize - cornerRadius);
      if (qx <= 0 || qy <= 0) {
        inCard = Math.abs(dx) <= innerSize && Math.abs(dy) <= innerSize;
      } else {
        inCard = qx * qx + qy * qy <= cornerRadius * cornerRadius;
      }
    }

    if (!inCard) return [0, 0, 0, 0];

    // Background base
    let r = 10;
    let g = 13;
    let b = 24;

    // Glowing diagonal gradient
    const t = (nx + ny) / 2;
    const gradR = 6 + (139 - 6) * t;
    const gradG = 182 + (92 - 182) * t;
    const gradB = 212 + (246 - 212) * t;

    // Brain glyph circle approximation in center
    const glyphRadius = isMaskable ? 0.26 : 0.22;
    if (distFromCenter < glyphRadius) {
      const glyphAlpha = Math.min(1, (glyphRadius - distFromCenter) / 0.04);
      r = r * (1 - glyphAlpha) + gradR * glyphAlpha;
      g = g * (1 - glyphAlpha) + gradG * glyphAlpha;
      b = b * (1 - glyphAlpha) + gradB * glyphAlpha;

      // Inner brain lobes highlight
      const lobeDist1 = Math.hypot(nx - 0.44, ny - 0.48);
      const lobeDist2 = Math.hypot(nx - 0.56, ny - 0.48);
      if (lobeDist1 < 0.07 || lobeDist2 < 0.07) {
        r = 255;
        g = 255;
        b = 255;
      }
    } else {
      // Subtle background glow
      r += gradR * 0.15;
      g += gradG * 0.15;
      b += gradB * 0.15;
    }

    return [r, g, b, 255];
  };
}

// Generate files
const sizes = [
  { file: "icon-192x192.png", size: 192, maskable: false },
  { file: "icon-512x512.png", size: 512, maskable: false },
  { file: "icon-maskable-192x192.png", size: 192, maskable: true },
  { file: "icon-maskable-512x512.png", size: 512, maskable: true },
  { file: "badge-72x72.png", size: 72, maskable: false },
];

for (const s of sizes) {
  const png = createPng(s.size, s.size, brandShader(s.maskable));
  const filePath = path.join(iconsDir, s.file);
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${s.file} (${s.size}x${s.size})`);
}

// Generate icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0d18"/>
      <stop offset="100%" stop-color="#14192b"/>
    </linearGradient>
    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="24" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bgGrad)"/>
  <rect x="24" y="24" width="464" height="464" rx="104" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
  <circle cx="256" cy="256" r="140" fill="url(#brandGrad)" filter="url(#glow)" opacity="0.35"/>
  <path d="M256 160c-26 0-48 18-53 43-15 3-27 15-27 31 0 11 6 21 15 26-2 5-3 10-3 16 0 24 19 44 44 44h24m0-160c26 0 48 18 53 43 15 3 27 15 27 31 0 11-6 21-15 26 2 5 3 10 3 16 0 24-19 44-44 44h-24m0-160v160m-36-80h72" stroke="white" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
fs.writeFileSync(path.join(iconsDir, "icon.svg"), svg);
console.log("Generated icon.svg");
