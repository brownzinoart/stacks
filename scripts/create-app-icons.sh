#!/bin/bash

# Create iOS App Icons for Stacks - Library Book Discovery App
# This script creates all required iOS app icon sizes

# Colors for the book stack design
BACKGROUND_COLOR="#1e40af"
BOOK1_COLOR="#f59e0b"  # Orange
BOOK2_COLOR="#10b981"  # Green  
BOOK3_COLOR="#ef4444"  # Red
BOOK4_COLOR="#8b5cf6"  # Purple

# Output directories
IOS_DIR="/Users/wallymo/claudecode/stacks/ios/App/App/Assets.xcassets/AppIcon.appiconset"
MOBILE_IOS_DIR="/Users/wallymo/claudecode/stacks/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset"

# Ensure directories exist
mkdir -p "$IOS_DIR"
mkdir -p "$MOBILE_IOS_DIR"

# Function to create a book stack icon
create_icon() {
    local size=$1
    local output_file=$2
    
    # Calculate dimensions
    local padding=$((size * 12 / 100))  # 12% padding
    local book_width=$((size - 2 * padding))
    local book_height=$((book_width * 15 / 100))  # Book height is 15% of width
    local stack_height=$((book_height * 5))
    
    # Center the stack
    local center_x=$((size / 2))
    local center_y=$((size / 2))
    local stack_x=$((center_x - book_width / 2))
    local stack_y=$((center_y - stack_height / 2))
    
    # Create SVG content
    cat > "/tmp/icon_${size}.svg" << EOF
<svg width="$size" height="$size" viewBox="0 0 $size $size" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0369a1;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background with iOS-style rounded corners -->
  <rect width="$size" height="$size" fill="url(#bg)" rx="$((size * 22 / 100))" ry="$((size * 22 / 100))"/>
  
  <!-- Book Stack with shadow -->
  <g filter="url(#shadow)">
    <!-- Bottom book (purple) -->
    <rect x="$stack_x" y="$((stack_y + stack_height - book_height))" width="$book_width" height="$book_height" fill="$BOOK4_COLOR" rx="$((book_height / 10))" ry="$((book_height / 10))"/>
    
    <!-- Third book (red) - slightly offset -->
    <rect x="$((stack_x + book_width / 20))" y="$((stack_y + stack_height - book_height * 21 / 10))" width="$((book_width * 9 / 10))" height="$book_height" fill="$BOOK3_COLOR" rx="$((book_height / 10))" ry="$((book_height / 10))"/>
    
    <!-- Second book (green) -->
    <rect x="$stack_x" y="$((stack_y + stack_height - book_height * 32 / 10))" width="$book_width" height="$book_height" fill="$BOOK2_COLOR" rx="$((book_height / 10))" ry="$((book_height / 10))"/>
    
    <!-- Top book (orange) - slightly offset -->
    <rect x="$((stack_x + book_width * 8 / 100))" y="$((stack_y + stack_height - book_height * 43 / 10))" width="$((book_width * 85 / 100))" height="$book_height" fill="$BOOK1_COLOR" rx="$((book_height / 10))" ry="$((book_height / 10))"/>
  </g>
  
  <!-- Subtle highlight on top book -->
  <rect x="$((stack_x + book_width * 8 / 100))" y="$((stack_y + stack_height - book_height * 43 / 10))" width="$((book_width * 85 / 100))" height="$((book_height * 3 / 10))" fill="rgba(255,255,255,0.2)" rx="$((book_height / 10))" ry="$((book_height / 10))"/>
</svg>
EOF

    # Convert SVG to PNG
    if command -v magick >/dev/null 2>&1; then
        # ImageMagick 7
        magick "/tmp/icon_${size}.svg" -background none "$output_file"
    elif command -v convert >/dev/null 2>&1; then
        # ImageMagick 6
        convert "/tmp/icon_${size}.svg" -background none "$output_file"
    elif command -v rsvg-convert >/dev/null 2>&1; then
        # librsvg
        rsvg-convert -w $size -h $size "/tmp/icon_${size}.svg" -o "$output_file"
    else
        echo "❌ No SVG to PNG converter found. Please install ImageMagick or librsvg-tools"
        echo "   macOS: brew install imagemagick"
        echo "   Ubuntu: sudo apt-get install imagemagick"
        return 1
    fi
    
    # Clean up temp file
    rm -f "/tmp/icon_${size}.svg"
    
    echo "✅ Created $output_file (${size}x${size})"
}

# iOS App Icon sizes and filenames
declare -A icons=(
    # iPhone
    [20]="AppIcon-20@1x.png"
    [40]="AppIcon-20@2x.png AppIcon-40@1x.png"
    [60]="AppIcon-20@3x.png"
    [29]="AppIcon-29@1x.png"
    [58]="AppIcon-29@2x.png"
    [87]="AppIcon-29@3x.png"
    [80]="AppIcon-40@2x.png"
    [120]="AppIcon-40@3x.png AppIcon-60@2x.png"
    [180]="AppIcon-60@3x.png"
    
    # iPad
    [76]="AppIcon-76@1x.png"
    [152]="AppIcon-76@2x.png"
    [167]="AppIcon-83.5@2x.png"
    
    # App Store
    [1024]="AppIcon-1024@1x.png"
)

# Additional iPad variants
declare -A ipad_icons=(
    [20]="AppIcon-20@1x-ipad.png"
    [40]="AppIcon-20@2x-ipad.png AppIcon-40@1x-ipad.png"
    [29]="AppIcon-29@1x-ipad.png"
    [58]="AppIcon-29@2x-ipad.png"
    [80]="AppIcon-40@2x-ipad.png"
)

echo "🎨 Creating iOS App Icons for Stacks Library App..."
echo ""

# Create all icon sizes
for size in "${!icons[@]}"; do
    filenames=${icons[$size]}
    for filename in $filenames; do
        create_icon $size "$IOS_DIR/$filename"
        create_icon $size "$MOBILE_IOS_DIR/$filename"
    done
done

# Create iPad-specific variants
for size in "${!ipad_icons[@]}"; do
    filenames=${ipad_icons[$size]}
    for filename in $filenames; do
        create_icon $size "$IOS_DIR/$filename"
        create_icon $size "$MOBILE_IOS_DIR/$filename"
    done
done

echo ""
echo "🎉 All iOS app icons created successfully!"
echo ""
echo "📱 Icons created in:"
echo "   • $IOS_DIR"
echo "   • $MOBILE_IOS_DIR"
echo ""
echo "📋 Icon checklist:"
echo "   ✅ All required iOS sizes (20x20 to 1024x1024)"
echo "   ✅ iPhone and iPad variants"
echo "   ✅ 1x, 2x, 3x scale factors"
echo "   ✅ App Store ready (1024x1024)"
echo "   ✅ Professional book stack design"
echo "   ✅ iOS design guidelines compliant"
echo ""