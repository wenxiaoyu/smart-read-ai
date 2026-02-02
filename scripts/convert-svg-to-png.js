import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 48, 128];

async function convertAll() {
  for (const size of sizes) {
    const svgPath = join(__dirname, `../src/icons/icon-${size}.svg`);
    const pngPath = join(__dirname, `../src/icons/icon-${size}.png`);

    const svgBuffer = readFileSync(svgPath);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);

    console.log(`✓ Converted icon-${size}.svg to icon-${size}.png`);
  }
  console.log('\n✓ All icons converted successfully');
}

convertAll().catch((err) => {
  console.error('✗ Error converting SVG to PNG:', err);
  process.exit(1);
});
