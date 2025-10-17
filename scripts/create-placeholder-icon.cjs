const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const buildDir = path.join(__dirname, '..', 'build');

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

async function createIcons() {
  const svg =
    '<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#667eea;stop-opacity:1" /><stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" /></linearGradient></defs><rect width="512" height="512" fill="url(#grad)" rx="80"/><text x="256" y="330" font-size="280" font-weight="bold" font-family="Arial, sans-serif" fill="white" text-anchor="middle">Z</text></svg>';

  try {
    await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(path.join(buildDir, 'icon.png'));
    console.log('✅ Created placeholder icon: build/icon.png');

    const png256 = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();

    const iconDir = Buffer.alloc(6);
    iconDir.writeUInt16LE(0, 0);
    iconDir.writeUInt16LE(1, 2);
    iconDir.writeUInt16LE(1, 4);

    const iconDirEntry = Buffer.alloc(16);
    iconDirEntry.writeUInt8(0, 0);
    iconDirEntry.writeUInt8(0, 1);
    iconDirEntry.writeUInt8(0, 2);
    iconDirEntry.writeUInt8(0, 3);
    iconDirEntry.writeUInt16LE(1, 4);
    iconDirEntry.writeUInt16LE(32, 6);
    iconDirEntry.writeUInt32LE(png256.length, 8);
    iconDirEntry.writeUInt32LE(22, 12);

    const icoBuffer = Buffer.concat([iconDir, iconDirEntry, png256]);
    fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
    console.log('✅ Created placeholder ICO: build/icon.ico');

    console.log('\nNote: These are placeholder icons for development only');
  } catch (error) {
    console.error('Error creating icons:', error.message);
    process.exit(1);
  }
}

createIcons();
