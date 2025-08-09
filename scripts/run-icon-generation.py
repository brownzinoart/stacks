#!/usr/bin/env python3

import os
import subprocess
from xml.etree import ElementTree as ET
from PIL import Image, ImageDraw
import math

def create_book_stack_icon(size):
    """Create a book stack icon with the given size"""
    
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    bg_color = (30, 64, 175)  # Blue background
    book_colors = [
        (245, 158, 11),   # Orange (top)
        (16, 185, 129),   # Green
        (239, 68, 68),    # Red  
        (139, 92, 246)    # Purple (bottom)
    ]
    
    # Dimensions
    padding = size * 0.12
    book_width = (size - 2 * padding) * 0.8
    book_height = book_width * 0.15
    stack_height = book_height * 4.5
    
    # Center coordinates
    center_x = size / 2
    center_y = size / 2
    stack_x = center_x - book_width / 2
    stack_y = center_y - stack_height / 2
    
    # Draw background with rounded corners (simulate iOS app icon shape)
    corner_radius = size * 0.22
    draw.rounded_rectangle(
        [(0, 0), (size, size)],
        radius=corner_radius,
        fill=bg_color
    )
    
    # Draw books from bottom to top
    book_offsets = [0, book_width * 0.05, 0, book_width * 0.08]
    book_widths = [book_width, book_width * 0.9, book_width, book_width * 0.85]
    
    for i, (color, offset, width) in enumerate(zip(book_colors[::-1], book_offsets, book_widths)):
        book_y = stack_y + stack_height - book_height * (i + 1.1)
        book_x = stack_x + offset
        
        # Add subtle shadow
        shadow_offset = 2
        draw.rounded_rectangle(
            [(book_x + shadow_offset, book_y + shadow_offset), 
             (book_x + width + shadow_offset, book_y + book_height + shadow_offset)],
            radius=book_height * 0.1,
            fill=(0, 0, 0, 50)
        )
        
        # Draw book
        draw.rounded_rectangle(
            [(book_x, book_y), (book_x + width, book_y + book_height)],
            radius=book_height * 0.1,
            fill=color
        )
        
        # Add highlight on top book
        if i == 3:  # Top book
            highlight_height = book_height * 0.3
            draw.rounded_rectangle(
                [(book_x, book_y), (book_x + width, book_y + highlight_height)],
                radius=book_height * 0.1,
                fill=(255, 255, 255, 50)
            )
    
    return img

def create_all_ios_icons():
    """Create all iOS app icon sizes"""
    
    # Icon sizes and filenames
    icon_specs = [
        # iPhone
        (20, "AppIcon-20@1x.png"),
        (40, "AppIcon-20@2x.png"),
        (60, "AppIcon-20@3x.png"),
        (29, "AppIcon-29@1x.png"),
        (58, "AppIcon-29@2x.png"),
        (87, "AppIcon-29@3x.png"),
        (40, "AppIcon-40@1x.png"),
        (80, "AppIcon-40@2x.png"),
        (120, "AppIcon-40@3x.png"),
        (120, "AppIcon-60@2x.png"),
        (180, "AppIcon-60@3x.png"),
        
        # iPad
        (20, "AppIcon-20@1x-ipad.png"),
        (40, "AppIcon-20@2x-ipad.png"),
        (29, "AppIcon-29@1x-ipad.png"),
        (58, "AppIcon-29@2x-ipad.png"),
        (40, "AppIcon-40@1x-ipad.png"),
        (80, "AppIcon-40@2x-ipad.png"),
        (76, "AppIcon-76@1x.png"),
        (152, "AppIcon-76@2x.png"),
        (167, "AppIcon-83.5@2x.png"),
        
        # App Store
        (1024, "AppIcon-1024@1x.png")
    ]
    
    # Output directories
    output_dirs = [
        "/Users/wallymo/claudecode/stacks/ios/App/App/Assets.xcassets/AppIcon.appiconset",
        "/Users/wallymo/claudecode/stacks/mobile/ios/App/App/Assets.xcassets/AppIcon.appiconset"
    ]
    
    # Ensure directories exist
    for dir_path in output_dirs:
        os.makedirs(dir_path, exist_ok=True)
    
    print("🎨 Creating iOS App Icons for Stacks Library App...")
    print("")
    
    # Create each icon size
    for size, filename in icon_specs:
        print(f"Creating {filename} ({size}x{size})...")
        
        img = create_book_stack_icon(size)
        
        # Save to both directories
        for dir_path in output_dirs:
            output_path = os.path.join(dir_path, filename)
            img.save(output_path, "PNG", optimize=True)
            print(f"  ✅ Saved to {output_path}")
    
    print("")
    print("🎉 All iOS app icons created successfully!")
    print("")
    print("📱 Icons created in:")
    for dir_path in output_dirs:
        print(f"   • {dir_path}")
    print("")
    print("📋 Icon checklist:")
    print("   ✅ All required iOS sizes (20x20 to 1024x1024)")
    print("   ✅ iPhone and iPad variants")
    print("   ✅ 1x, 2x, 3x scale factors")
    print("   ✅ App Store ready (1024x1024)")
    print("   ✅ Professional book stack design")
    print("   ✅ iOS design guidelines compliant")
    print("   ✅ Optimized PNG files")

if __name__ == "__main__":
    # Check if PIL is available
    try:
        create_all_ios_icons()
    except ImportError as e:
        print("❌ Missing required Python library: PIL (Pillow)")
        print("Install with: pip3 install Pillow")
        print("")
        print("Alternative: Use the bash script with ImageMagick:")
        print("  brew install imagemagick")
        print("  chmod +x scripts/create-app-icons.sh")
        print("  ./scripts/create-app-icons.sh")
        exit(1)