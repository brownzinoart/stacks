const fs = require('fs');
const path = require('path');

// Simple PNG generation without external dependencies
// This creates the icon specification and a simple base64 PNG

function createSimplePNG(size, color = '#1e40af') {
  // Create a simple solid color PNG data
  // This is a minimal approach - for production, use proper image generation

  const width = size;
  const height = size;

  // Create SVG as base
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg)" rx="${width * 0.22}"/>
        
        <!-- Book Stack -->
        <g transform="translate(${width * 0.5}, ${height * 0.5})">
            <!-- Bottom book (purple) -->
            <rect x="${-width * 0.25}" y="${height * 0.1}" width="${width * 0.5}" height="${height * 0.08}" fill="#8b5cf6" rx="${height * 0.01}"/>
            
            <!-- Third book (red) -->
            <rect x="${-width * 0.22}" y="${height * 0.0}" width="${width * 0.44}" height="${height * 0.08}" fill="#ef4444" rx="${height * 0.01}"/>
            
            <!-- Second book (green) -->
            <rect x="${-width * 0.25}" y="${-height * 0.1}" width="${width * 0.5}" height="${height * 0.08}" fill="#10b981" rx="${height * 0.01}"/>
            
            <!-- Top book (orange) -->
            <rect x="${-width * 0.22}" y="${-height * 0.2}" width="${width * 0.44}" height="${height * 0.08}" fill="#f59e0b" rx="${height * 0.01}"/>
        </g>
    </svg>`;

  return Buffer.from(svg, 'utf8');
}

// Icon specifications
const iconSpecs = [
  // iPhone
  { size: 20, filename: 'AppIcon-20@1x.png' },
  { size: 40, filename: 'AppIcon-20@2x.png' },
  { size: 60, filename: 'AppIcon-20@3x.png' },
  { size: 29, filename: 'AppIcon-29@1x.png' },
  { size: 58, filename: 'AppIcon-29@2x.png' },
  { size: 87, filename: 'AppIcon-29@3x.png' },
  { size: 40, filename: 'AppIcon-40@1x.png' },
  { size: 80, filename: 'AppIcon-40@2x.png' },
  { size: 120, filename: 'AppIcon-40@3x.png' },
  { size: 120, filename: 'AppIcon-60@2x.png' },
  { size: 180, filename: 'AppIcon-60@3x.png' },

  // iPad
  { size: 20, filename: 'AppIcon-20@1x-ipad.png' },
  { size: 40, filename: 'AppIcon-20@2x-ipad.png' },
  { size: 29, filename: 'AppIcon-29@1x-ipad.png' },
  { size: 58, filename: 'AppIcon-29@2x-ipad.png' },
  { size: 40, filename: 'AppIcon-40@1x-ipad.png' },
  { size: 80, filename: 'AppIcon-40@2x-ipad.png' },
  { size: 76, filename: 'AppIcon-76@1x.png' },
  { size: 152, filename: 'AppIcon-76@2x.png' },
  { size: 167, filename: 'AppIcon-83.5@2x.png' },

  // App Store
  { size: 1024, filename: 'AppIcon-1024@1x.png' },
];

// Output directories
const outputDirs = [
  '/Users/wallymo/claudecode/stacks/ios/App/App/Assets.xcassets/AppIcon.appiconset',
  '/Users/wallymo/claudecode/stacks/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset',
];

// Ensure directories exist
outputDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('🎨 Creating iOS App Icons for Stacks Library App...\n');

// Generate SVG files for each icon size
iconSpecs.forEach(({ size, filename }) => {
  const svgContent = createSimplePNG(size);
  const svgFilename = filename.replace('.png', '.svg');

  outputDirs.forEach((dir) => {
    const svgPath = path.join(dir, svgFilename);
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ Created ${svgPath} (${size}x${size})`);
  });
});

console.log('\n🎉 SVG icon templates created successfully!\n');

console.log('🔄 Next steps to convert SVGs to PNGs:');
console.log('1. Install conversion tool:');
console.log('   npm install -g sharp-cli  # OR');
console.log('   brew install imagemagick   # OR');
console.log('   brew install librsvg');
console.log('');
console.log('2. Convert SVGs to PNGs using one of these methods:');
console.log('');
console.log('   Option A - Using ImageMagick:');
iconSpecs.forEach(({ size, filename }) => {
  const svgFilename = filename.replace('.png', '.svg');
  console.log(`   magick "${svgFilename}" -resize ${size}x${size} "${filename}"`);
});

console.log('');
console.log('   Option B - Using rsvg-convert:');
iconSpecs.forEach(({ size, filename }) => {
  const svgFilename = filename.replace('.png', '.svg');
  console.log(`   rsvg-convert -w ${size} -h ${size} "${svgFilename}" -o "${filename}"`);
});

console.log('');
console.log('📱 Icon directories:');
outputDirs.forEach((dir) => console.log(`   • ${dir}`));

console.log('\n📋 Manual conversion needed - SVG files ready for PNG conversion!');

// Create a conversion script
const conversionScript = `#!/bin/bash
# Convert all SVG icons to PNG
cd "${outputDirs[0]}"
${iconSpecs
  .map(({ size, filename }) => {
    const svgFilename = filename.replace('.png', '.svg');
    return `rsvg-convert -w ${size} -h ${size} "${svgFilename}" -o "${filename}"`;
  })
  .join('\n')}

cd "${outputDirs[1]}"
${iconSpecs
  .map(({ size, filename }) => {
    const svgFilename = filename.replace('.png', '.svg');
    return `rsvg-convert -w ${size} -h ${size} "${svgFilename}" -o "${filename}"`;
  })
  .join('\n')}

echo "All icons converted to PNG!"
`;

const scriptPath = '/Users/wallymo/claudecode/stacks/convert-icons.sh';
fs.writeFileSync(scriptPath, conversionScript);
fs.chmodSync(scriptPath, '755');

console.log(`\n🔧 Conversion script created: ${scriptPath}`);
console.log('Run with: ./convert-icons.sh (after installing rsvg-convert)');
