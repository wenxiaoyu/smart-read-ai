// Simple script to generate placeholder icons
// In production, replace with actual icon files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 48, 128];
const iconsDir = path.join(__dirname, '../src/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
sizes.forEach(size => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#4285f4" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.5}" fill="white" text-anchor="middle" dominant-baseline="central">D</text>
</svg>`;
  
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svg);
  console.log(`Generated icon-${size}.svg`);
});

console.log('\nNote: For production, replace these placeholder SVG icons with proper PNG icons.');
console.log('You can use tools like https://realfavicongenerator.net/ to generate proper icons.');
