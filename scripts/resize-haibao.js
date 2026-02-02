import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../images/haibao-440-280.png');
const outputPath = join(__dirname, '../images/haibao-440-280.png');

sharp(inputPath)
  .resize(440, 280, {
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
    console.log('✓ Successfully resized haibao to 440x280 pixels');
  })
  .catch((err) => {
    console.error('✗ Error resizing image:', err);
    process.exit(1);
  });
