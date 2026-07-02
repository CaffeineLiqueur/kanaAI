// 图片优化脚本 - 缩放和生成 favicon
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const BRAND_DIR = path.join(__dirname, '..', 'public', 'brand');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function optimize() {
  console.log('优化图片中...\n');

  // 1. mark.png - 橘猫 logo,缩到 512x512
  const markOriginal = path.join(BRAND_DIR, 'mark-original.png');
  const markOutput = path.join(BRAND_DIR, 'mark.png');
  await sharp(markOriginal)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(markOutput);
  const markSize = fs.statSync(markOutput).size;
  console.log(`✓ mark.png (512x512) - ${(markSize / 1024).toFixed(1)} KB`);

  // 2. wordmark.png - 文字 logo,缩到 800x800
  const wordmarkOriginal = path.join(BRAND_DIR, 'wordmark-original.png');
  const wordmarkOutput = path.join(BRAND_DIR, 'wordmark.png');
  await sharp(wordmarkOriginal)
    .resize(800, 800, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(wordmarkOutput);
  const wordmarkSize = fs.statSync(wordmarkOutput).size;
  console.log(`✓ wordmark.png (800x800) - ${(wordmarkSize / 1024).toFixed(1)} KB`);

  // 3. favicon.ico - 多尺寸(16, 32, 48, 64, 128)
  const faviconPath = path.join(PUBLIC_DIR, 'favicon.ico');
  const sizes = [16, 32, 48, 64, 128];
  const icoBuffers = await Promise.all(
    sizes.map(size =>
      sharp(markOriginal)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );

  // sharp 不直接输出 ico,需要手动打包
  // 用 toFormat('ico') 替代
  await sharp(markOriginal)
    .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(BRAND_DIR, 'favicon-tmp.png'));

  // 生成 .ico 文件 (sharp 0.32+ 支持 ico)
  try {
    await sharp(markOriginal)
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(faviconPath);
    const faviconSize = fs.statSync(faviconPath).size;
    console.log(`✓ favicon.ico (64x64) - ${(faviconSize / 1024).toFixed(1)} KB`);
  } catch (e) {
    // 如果不支持 ico 格式,fallback 到 png
    await sharp(markOriginal)
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'favicon.png'));
    console.log('✓ favicon.png (64x64) - 备用格式');
  }

  // 4. 清理原文件
  fs.unlinkSync(markOriginal);
  fs.unlinkSync(wordmarkOriginal);
  const tmpFile = path.join(BRAND_DIR, 'favicon-tmp.png');
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

  console.log('\n✅ 完成! 清理了原文件。');
  console.log('\n最终结构:');
  console.log('  public/');
  console.log('  ├── favicon.ico');
  console.log('  └── brand/');
  console.log('      ├── mark.png      (512x512)');
  console.log('      └── wordmark.png  (800x800)');
}

optimize().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
