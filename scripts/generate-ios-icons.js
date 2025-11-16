#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// SVG template for the book stack icon
function createBookStackSVG(size) {
  const scale = size / 1024; // Scale everything relative to 1024px base
  const padding = size * 0.12; // 12% padding
  const bookWidth = (size - 2 * padding) * 0.8;
  const bookHeight = bookWidth * 0.15;
  const stackHeight = bookHeight * 4.5;

  // Center the stack
  const centerX = size / 2;
  const centerY = size / 2;
  const stackX = centerX - bookWidth / 2;
  const stackY = centerY - stackHeight / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="book1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="book2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="book3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ef4444;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="book4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="${2 * scale}" stdDeviation="${3 * scale}" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.22}" ry="${size * 0.22}"/>
  
  <!-- Book Stack -->
  <g filter="url(#shadow)">
    <!-- Bottom book (purple) -->
    <rect x="${stackX}" y="${stackY + stackHeight - bookHeight}" width="${bookWidth}" height="${bookHeight}" fill="url(#book4)" rx="${bookHeight * 0.1}" ry="${bookHeight * 0.1}"/>
    
    <!-- Third book (red) - slightly offset -->
    <rect x="${stackX + bookWidth * 0.05}" y="${stackY + stackHeight - bookHeight * 2.1}" width="${bookWidth * 0.9}" height="${bookHeight}" fill="url(#book3)" rx="${bookHeight * 0.1}" ry="${bookHeight * 0.1}"/>
    
    <!-- Second book (green) -->
    <rect x="${stackX}" y="${stackY + stackHeight - bookHeight * 3.2}" width="${bookWidth}" height="${bookHeight}" fill="url(#book2)" rx="${bookHeight * 0.1}" ry="${bookHeight * 0.1}"/>
    
    <!-- Top book (orange) - slightly offset -->
    <rect x="${stackX + bookWidth * 0.08}" y="${stackY + stackHeight - bookHeight * 4.3}" width="${bookWidth * 0.85}" height="${bookHeight}" fill="url(#book1)" rx="${bookHeight * 0.1}" ry="${bookHeight * 0.1}"/>
  </g>
  
  <!-- Subtle highlight on top book -->
  <rect x="${stackX + bookWidth * 0.08}" y="${stackY + stackHeight - bookHeight * 4.3}" width="${bookWidth * 0.85}" height="${bookHeight * 0.3}" fill="rgba(255,255,255,0.2)" rx="${bookHeight * 0.1}" ry="${bookHeight * 0.1}"/>
</svg>`;
}

// Convert SVG to PNG using node-canvas simulation
function createIconFile(svgContent, filename, size) {
  // For now, we'll create the SVG files and note that conversion to PNG is needed
  const svgPath = filename.replace('.png', '.svg');
  fs.writeFileSync(svgPath, svgContent);

  console.log(`Created ${svgPath} (${size}x${size})`);
  console.log(
    `Note: Convert ${svgPath} to ${filename} using: npx @squoosh/cli --resize '{"enabled":true,"width":${size},"height":${size}}' --avif '{}' ${svgPath}`
  );
}

// iOS App Icon sizes and their actual pixel dimensions
const iconSizes = [
  // iPhone
  { name: 'AppIcon-20@1x.png', size: 20 },
  { name: 'AppIcon-20@2x.png', size: 40 },
  { name: 'AppIcon-20@3x.png', size: 60 },
  { name: 'AppIcon-29@1x.png', size: 29 },
  { name: 'AppIcon-29@2x.png', size: 58 },
  { name: 'AppIcon-29@3x.png', size: 87 },
  { name: 'AppIcon-40@1x.png', size: 40 },
  { name: 'AppIcon-40@2x.png', size: 80 },
  { name: 'AppIcon-40@3x.png', size: 120 },
  { name: 'AppIcon-60@2x.png', size: 120 },
  { name: 'AppIcon-60@3x.png', size: 180 },

  // iPad
  { name: 'AppIcon-20@1x-ipad.png', size: 20 },
  { name: 'AppIcon-20@2x-ipad.png', size: 40 },
  { name: 'AppIcon-29@1x-ipad.png', size: 29 },
  { name: 'AppIcon-29@2x-ipad.png', size: 58 },
  { name: 'AppIcon-40@1x-ipad.png', size: 40 },
  { name: 'AppIcon-40@2x-ipad.png', size: 80 },
  { name: 'AppIcon-76@1x.png', size: 76 },
  { name: 'AppIcon-76@2x.png', size: 152 },
  { name: 'AppIcon-83.5@2x.png', size: 167 },

  // App Store
  { name: 'AppIcon-1024@1x.png', size: 1024 },
];

// Create output directories
const outputDirs = [
  '/Users/wallymo/claudecode/stacks/ios/App/App/Assets.xcassets/AppIcon.appiconset',
  '/Users/wallymo/claudecode/stacks/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset',
];

outputDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('Generating iOS App Icons...\n');

// Generate all icon sizes
iconSizes.forEach(({ name, size }) => {
  const svgContent = createBookStackSVG(size);

  outputDirs.forEach((dir) => {
    const filePath = path.join(dir, name);
    createIconFile(svgContent, filePath, size);
  });
});

console.log('\n✅ SVG files created successfully!');
console.log('\n🔄 Next steps:');
console.log('1. Install a tool to convert SVGs to PNGs:');
console.log('   npm install -g @squoosh/cli');
console.log('2. Convert all SVGs to PNGs by running the suggested commands above');
console.log('3. Clean up the SVG files after conversion');
