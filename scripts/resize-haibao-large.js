import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../images/haibao-1400-560.png');
const outputPath = join(__dirname, '../images/haibao-1400-560.png');

sharp(inputPath)
  .resize(1400, 560, {
    fit: 'cover',
    position: 'center'
  })
  .png()
  .toFile(outputPath + '.tmp')
  .then(() => {
    // 替换原文件
    return sharp(outputPath + '.tmp')
      .toFile(outputPath);
  })
  .then(() => {
    console.log('✓ Successfully resized haibao-1400-560 to 1400x560 pixels');
  })
  .catch((err) => {
    console.error('✗ Error resizing image:', err);
    process.exit(1);
  });
