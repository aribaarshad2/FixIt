const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const logoPath = path.join('C:\\Users\\HP\\Downloads', 'Fixit Logo.png');

// Splash screen sizes (width x height)
const splashSizes = {
  'drawable': [288, 288],
  'drawable-mdpi': [160, 160],
  'drawable-hdpi': [240, 240],
  'drawable-xhdpi': [320, 320],
  'drawable-xxhdpi': [480, 480],
  'drawable-xxxhdpi': [640, 640],
  'drawable-port-mdpi': [360, 640],
  'drawable-port-hdpi': [540, 960],
  'drawable-port-xhdpi': [720, 1280],
  'drawable-port-xxhdpi': [1080, 1920],
  'drawable-port-xxxhdpi': [1440, 2560],
  'drawable-land-mdpi': [640, 360],
  'drawable-land-hdpi': [960, 540],
  'drawable-land-xhdpi': [1280, 720],
  'drawable-land-xxhdpi': [1920, 1080],
  'drawable-land-xxxhdpi': [2560, 1440],
};

// Android icon sizes
const iconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// PWA icon sizes
const pwaSizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateSplash(logo, width, height, outPath) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Teal gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#008080');
  gradient.addColorStop(1, '#005f5f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Center logo at 40% of the smaller dimension
  const logoSize = Math.min(width, height) * 0.4;
  const lx = (width - logoSize) / 2;
  const ly = (height - logoSize) / 2 - logoSize * 0.1;
  ctx.drawImage(logo, lx, ly, logoSize, logoSize);

  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Splash: ${path.basename(path.dirname(outPath))}/${path.basename(outPath)} (${width}x${height})`);
}

async function generateIcon(logo, size, outPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Teal rounded background
  const radius = size * 0.22;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fillStyle = '#008080';
  ctx.fill();

  // Center logo with padding
  const pad = size * 0.15;
  ctx.drawImage(logo, pad, pad, size - pad * 2, size - pad * 2);

  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Icon: ${path.basename(path.dirname(outPath))}/${path.basename(outPath)} (${size}x${size})`);
}

async function main() {
  const logo = await loadImage(logoPath);
  const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
  const pwaDir = path.join(__dirname, 'frontend', 'public', 'icons');

  // Generate splash screens
  for (const [folder, [w, h]] of Object.entries(splashSizes)) {
    const dir = path.join(resDir, folder);
    if (fs.existsSync(dir)) {
      await generateSplash(logo, w, h, path.join(dir, 'splash.png'));
    }
  }

  // Generate Android icons
  for (const [folder, size] of Object.entries(iconSizes)) {
    const dir = path.join(resDir, folder);
    if (fs.existsSync(dir)) {
      await generateIcon(logo, size, path.join(dir, 'ic_launcher.png'));
      await generateIcon(logo, size, path.join(dir, 'ic_launcher_round.png'));
    }
  }

  // Generate PWA icons
  for (const size of pwaSizes) {
    await generateIcon(logo, size, path.join(pwaDir, `icon-${size}x${size}.png`));
  }

  console.log('\nAll icons and splash screens generated!');
}

main().catch(console.error);
