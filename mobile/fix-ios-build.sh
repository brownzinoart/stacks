#!/bin/bash

# Fix common iOS build issues for Archive

echo "🔧 Fixing iOS Build Issues"
echo "========================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m'

cd "$(dirname "$0")"

# 1. Update iOS deployment target
echo -e "${BLUE}Updating iOS deployment target...${NC}"
cd ios/App
sed -i '' 's/IPHONEOS_DEPLOYMENT_TARGET = [0-9.]*/IPHONEOS_DEPLOYMENT_TARGET = 13.0/g' App.xcodeproj/project.pbxproj

# 2. Clean build folders
echo -e "${BLUE}Cleaning build folders...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/App-*
rm -rf build/

# 3. Update Podfile
echo -e "${BLUE}Updating Podfile...${NC}"
cat > Podfile << 'EOF'
platform :ios, '13.0'
use_frameworks!

# workaround to avoid Xcode caching of Pods that requires
# Product -> Clean Build Folder after new Cordova plugins installed
# Requires CocoaPods 1.6 or newer
install! 'cocoapods', :disable_input_output_paths => true

def capacitor_pods
  pod 'Capacitor', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorCordova', :path => '../../node_modules/@capacitor/ios'
  pod 'CapacitorApp', :path => '../../node_modules/@capacitor/app'
  pod 'CapacitorHaptics', :path => '../../node_modules/@capacitor/haptics'
  pod 'CapacitorKeyboard', :path => '../../node_modules/@capacitor/keyboard'
  pod 'CapacitorStatusBar', :path => '../../node_modules/@capacitor/status-bar'
end

target 'App' do
  capacitor_pods
end

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      config.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = ""
      config.build_settings['CODE_SIGNING_REQUIRED'] = "NO"
      config.build_settings['CODE_SIGNING_ALLOWED'] = "NO"
    end
  end
end
EOF

# 4. Reinstall pods
echo -e "${BLUE}Reinstalling CocoaPods...${NC}"
pod deintegrate
pod install

# 5. Fix code signing in Xcode project
echo -e "${BLUE}Configuring code signing...${NC}"
cd App.xcodeproj
plutil -replace 'objects.77D0A87C24835D1500C67C56.attributes.TargetAttributes.504EC3031FED79650016851F.ProvisioningStyle' -string "Automatic" project.pbxproj 2>/dev/null || true
cd ..

# 6. Sync Capacitor
echo -e "${BLUE}Syncing Capacitor...${NC}"
cd ../..
npx cap sync ios

echo ""
echo -e "${GREEN}✅ Fixes applied!${NC}"
echo ""
echo -e "${YELLOW}Now try these steps in Xcode:${NC}"
echo "1. Open Xcode: npx cap open ios"
echo "2. Click on 'App' in the left sidebar"
echo "3. Go to 'Signing & Capabilities' tab"
echo "4. Check 'Automatically manage signing'"
echo "5. Select your Apple ID as Team"
echo "6. Change Bundle Identifier to something unique like: com.yourname.stacks"
echo "7. Select 'Any iOS Device' and try Archive again"
echo ""
echo -e "${BLUE}If it still fails, the error message will tell us what to fix!${NC}"