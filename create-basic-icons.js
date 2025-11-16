const fs = require('fs');
const path = require('path');

// Create a basic PNG manually for immediate use
// This creates simple colored squares as placeholder icons

function createBasicIcon(size) {
    // Create a minimal PNG file as a colored square
    // This is a very basic approach for immediate testing
    
    // Calculate dimensions
    const padding = Math.floor(size * 0.12);
    const bookWidth = Math.floor((size - 2 * padding) * 0.8);
    const bookHeight = Math.max(1, Math.floor(bookWidth * 0.15));
    
    // Create SVG content
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af"/>
      <stop offset="100%" style="stop-color:#0369a1"/>
    </linearGradient>
    <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background with iOS app icon corners -->
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${Math.floor(size * 0.22)}"/>
  
  <!-- Book Stack -->
  <g transform="translate(${size/2}, ${size/2})" filter="url(#drop-shadow)">
    <!-- Bottom book (purple) -->
    <rect x="${-bookWidth/2}" y="${bookHeight * 1.5}" width="${bookWidth}" height="${bookHeight}" fill="#8b5cf6" rx="${Math.max(1, Math.floor(bookHeight * 0.1))}"/>
    
    <!-- Third book (red) - offset -->
    <rect x="${-bookWidth/2 + bookWidth * 0.1}" y="${bookHeight * 0.5}" width="${bookWidth * 0.8}" height="${bookHeight}" fill="#ef4444" rx="${Math.max(1, Math.floor(bookHeight * 0.1))}"/>
    
    <!-- Second book (green) -->
    <rect x="${-bookWidth/2}" y="${-bookHeight * 0.5}" width="${bookWidth}" height="${bookHeight}" fill="#10b981" rx="${Math.max(1, Math.floor(bookHeight * 0.1))}"/>
    
    <!-- Top book (orange) - offset -->
    <rect x="${-bookWidth/2 + bookWidth * 0.05}" y="${-bookHeight * 1.5}" width="${bookWidth * 0.9}" height="${bookHeight}" fill="#f59e0b" rx="${Math.max(1, Math.floor(bookHeight * 0.1))}"/>
  </g>
  
  <!-- Subtle highlight -->
  <rect x="${size/2 - bookWidth/2 + bookWidth * 0.05}" y="${size/2 - bookHeight * 1.5}" width="${bookWidth * 0.9}" height="${Math.max(1, Math.floor(bookHeight * 0.4))}" fill="rgba(255,255,255,0.3)" rx="${Math.max(1, Math.floor(bookHeight * 0.1))}"/>
</svg>`;
}

// Icon specifications
const iconSpecs = [
    // iPhone
    { size: 20, filename: "AppIcon-20@1x.png" },
    { size: 40, filename: "AppIcon-20@2x.png" },
    { size: 60, filename: "AppIcon-20@3x.png" },
    { size: 29, filename: "AppIcon-29@1x.png" },
    { size: 58, filename: "AppIcon-29@2x.png" },
    { size: 87, filename: "AppIcon-29@3x.png" },
    { size: 40, filename: "AppIcon-40@1x.png" },
    { size: 80, filename: "AppIcon-40@2x.png" },
    { size: 120, filename: "AppIcon-40@3x.png" },
    { size: 120, filename: "AppIcon-60@2x.png" },
    { size: 180, filename: "AppIcon-60@3x.png" },
    
    // iPad
    { size: 20, filename: "AppIcon-20@1x-ipad.png" },
    { size: 40, filename: "AppIcon-20@2x-ipad.png" },
    { size: 29, filename: "AppIcon-29@1x-ipad.png" },
    { size: 58, filename: "AppIcon-29@2x-ipad.png" },
    { size: 40, filename: "AppIcon-40@1x-ipad.png" },
    { size: 80, filename: "AppIcon-40@2x-ipad.png" },
    { size: 76, filename: "AppIcon-76@1x.png" },
    { size: 152, filename: "AppIcon-76@2x.png" },
    { size: 167, filename: "AppIcon-83.5@2x.png" },
    
    // App Store
    { size: 1024, filename: "AppIcon-1024@1x.png" }
];

// Dedupe by creating a Set of unique sizes and filenames
const uniqueIcons = [];
const seen = new Set();

iconSpecs.forEach(spec => {
    const key = `${spec.size}-${spec.filename}`;
    if (!seen.has(key)) {
        seen.add(key);
        uniqueIcons.push(spec);
    }
});

// Output directories
const outputDirs = [
    "/Users/wallymo/claudecode/stacks/ios/App/App/Assets.xcassets/AppIcon.appiconset",
    "/Users/wallymo/claudecode/stacks/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset"
];

// Ensure directories exist
outputDirs.forEach(dir => {
    try {
        fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
        console.log(`Directory already exists: ${dir}`);
    }
});

console.log('🎨 Creating iOS App Icons for Stacks Library App...\n');

// Generate all icons
uniqueIcons.forEach(({ size, filename }) => {
    const svgContent = createBasicIcon(size);
    
    outputDirs.forEach(dir => {
        const svgPath = path.join(dir, filename.replace('.png', '.svg'));
        try {
            fs.writeFileSync(svgPath, svgContent);
            console.log(`✅ Created SVG: ${path.basename(svgPath)} (${size}x${size})`);
        } catch (err) {
            console.error(`❌ Error creating ${svgPath}:`, err.message);
        }
    });
});

console.log(`\n🎉 Created ${uniqueIcons.length} SVG icon templates!\n`);

// Create README with conversion instructions
const readmeContent = `# iOS App Icons for Stacks

This directory contains all the required iOS app icon sizes for the Stacks library book discovery app.

## Icon Design
- **Theme**: Stack of books representing the library discovery concept
- **Colors**: 
  - Background: Blue gradient (#1e40af to #0369a1)
  - Books: Orange, Green, Red, Purple stack
- **Style**: Modern, flat design with subtle shadows
- **Compliance**: iOS app icon guidelines (rounded corners, no transparency)

## Sizes Included
- iPhone: 20x20 to 180x180 (various scales)
- iPad: 20x20 to 167x167 (various scales) 
- App Store: 1024x1024

## Conversion from SVG to PNG
The current files are SVG templates. To convert to PNG:

### Option 1: Using rsvg-convert (recommended)
\`\`\`bash
# Install rsvg-convert
brew install librsvg

# Convert all SVGs to PNGs
for svg in *.svg; do
    size=$(echo "$svg" | grep -o '[0-9]\\+' | head -1)
    png="${svg%.svg}.png"
    rsvg-convert -w $size -h $size "$svg" -o "$png"
    echo "Converted $svg to $png"
done
\`\`\`

### Option 2: Using ImageMagick
\`\`\`bash
# Install ImageMagick
brew install imagemagick

# Convert all SVGs
for svg in *.svg; do
    png="${svg%.svg}.png"
    magick "$svg" "$png"
done
\`\`\`

### Option 3: Online converter
Upload SVG files to an online converter like:
- https://convertio.co/svg-png/
- https://cloudconvert.com/svg-to-png

## Validation
After conversion, validate your icons:
- Check all required sizes are present
- Verify PNG format and correct dimensions
- Test appearance on both light and dark backgrounds
- Ensure icons look good at small sizes (20x20, 29x29)

## File Structure
\`\`\`
AppIcon.appiconset/
├── Contents.json          (iOS app icon manifest)
├── AppIcon-20@1x.png     (20x20)
├── AppIcon-20@2x.png     (40x40)  
├── AppIcon-20@3x.png     (60x60)
├── ...                    (all other sizes)
└── AppIcon-1024@1x.png   (1024x1024 for App Store)
\`\`\`
`;

outputDirs.forEach(dir => {
    const readmePath = path.join(dir, 'README.md');
    fs.writeFileSync(readmePath, readmeContent);
});

console.log('📋 Next Steps:');
console.log('1. Install conversion tool: brew install librsvg');
console.log('2. Navigate to icon directories and convert SVGs to PNGs');
console.log('3. Clean up SVG files after conversion');
console.log('\n📱 Icon directories:');
outputDirs.forEach(dir => console.log(`   • ${dir}`));

console.log('\n✨ SVG templates are ready for PNG conversion!');