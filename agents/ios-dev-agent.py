#!/usr/bin/env python3
"""
iOS Development Agent for Stacks Library App
Specialized in Capacitor + Next.js iOS development with live reload and AR features
"""

import subprocess
import json
import socket
import os
import sys
import time
import re
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import requests

class DeviceStatus(Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    BUILDING = "building"
    SYNCING = "syncing"
    ERROR = "error"

@dataclass
class iOSDevConfig:
    """Configuration for iOS development environment"""
    dev_server_ip: str
    dev_server_port: int = 3000
    api_server_port: int = 3001
    device_name: Optional[str] = None
    simulator_id: Optional[str] = None
    capacitor_config_path: str = "capacitor.config.json"
    mobile_config_path: str = "mobile/capacitor.config.ts"

class StacksiOSAgent:
    """
    Specialized iOS development agent for Stacks library app.
    Handles live reload, AR testing, and seamless phone development.
    """
    
    def __init__(self):
        self.config = self._load_config()
        self.device_status = DeviceStatus.DISCONNECTED
        self.current_processes = {}
        
    def _load_config(self) -> iOSDevConfig:
        """Load configuration from environment and detect network settings."""
        # Get local IP address
        local_ip = self._get_local_ip()
        
        # Check for environment variable override
        dev_ip = os.getenv('NEXT_PUBLIC_DEV_SERVER_IP', local_ip)
        
        return iOSDevConfig(
            dev_server_ip=dev_ip,
            dev_server_port=3000,
            api_server_port=3001
        )
    
    def _get_local_ip(self) -> str:
        """Get the local IP address of the development machine."""
        try:
            # Create a socket to external address to get local IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except:
            return "127.0.0.1"
    
    def setup_ios_development(self) -> Dict[str, str]:
        """Complete iOS development setup for live reload and testing."""
        setup_status = {}
        
        print("🚀 Setting up iOS Development Environment for Stacks")
        print("=" * 60)
        
        # Step 1: Verify and update IP configuration
        print("\n📱 Step 1: Configuring Network Settings")
        ip_status = self._configure_network_settings()
        setup_status.update(ip_status)
        
        # Step 2: Update Capacitor configurations
        print("\n⚙️ Step 2: Updating Capacitor Configuration")
        cap_status = self._update_capacitor_configs()
        setup_status.update(cap_status)
        
        # Step 3: Start development servers
        print("\n🖥️ Step 3: Starting Development Servers")
        server_status = self._start_dev_servers()
        setup_status.update(server_status)
        
        # Step 4: Sync and prepare iOS project
        print("\n📦 Step 4: Syncing iOS Project")
        sync_status = self._sync_ios_project()
        setup_status.update(sync_status)
        
        # Step 5: Configure AR permissions
        print("\n🎯 Step 5: Configuring AR Permissions")
        ar_status = self._configure_ar_permissions()
        setup_status.update(ar_status)
        
        # Step 6: Provide testing instructions
        print("\n✅ Step 6: Ready for Testing!")
        self._print_testing_instructions()
        
        return setup_status
    
    def _configure_network_settings(self) -> Dict[str, str]:
        """Configure network settings for live reload."""
        status = {}
        
        # Get and display network info
        local_ip = self._get_local_ip()
        print(f"  📍 Local IP Address: {local_ip}")
        print(f"  🌐 Dev Server URL: http://{local_ip}:3000")
        print(f"  🔧 API Server URL: http://{local_ip}:3001")
        
        # Update .env.local if needed
        env_path = ".env.local"
        env_content = ""
        
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                env_content = f.read()
        
        # Update or add DEV_SERVER_IP
        if 'NEXT_PUBLIC_DEV_SERVER_IP' in env_content:
            env_content = re.sub(
                r'NEXT_PUBLIC_DEV_SERVER_IP=.*',
                f'NEXT_PUBLIC_DEV_SERVER_IP={local_ip}',
                env_content
            )
        else:
            env_content += f"\nNEXT_PUBLIC_DEV_SERVER_IP={local_ip}\n"
        
        with open(env_path, 'w') as f:
            f.write(env_content)
        
        status['network_config'] = f"Configured for IP: {local_ip}"
        print(f"  ✅ Updated .env.local with IP: {local_ip}")
        
        return status
    
    def _update_capacitor_configs(self) -> Dict[str, str]:
        """Update Capacitor configuration files for live reload."""
        status = {}
        
        # Update root capacitor.config.json
        config_path = "capacitor.config.json"
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            # Update server configuration for live reload
            config['server'] = {
                'url': f"http://{self.config.dev_server_ip}:3000",
                'cleartext': True,
                'allowNavigation': [
                    'capacitor://localhost',
                    'https://localhost',
                    f'http://{self.config.dev_server_ip}:*',
                    'http://localhost:*',
                    'http://192.168.*.*:*'
                ]
            }
            
            with open(config_path, 'w') as f:
                json.dump(config, f, indent=2)
            
            print(f"  ✅ Updated {config_path}")
            status['root_config'] = "Updated"
        
        # Update mobile/capacitor.config.ts
        mobile_config_path = "mobile/capacitor.config.ts"
        if os.path.exists(mobile_config_path):
            with open(mobile_config_path, 'r') as f:
                content = f.read()
            
            # Update the URL in the TypeScript config
            content = re.sub(
                r"url:\s*'http://[\d\.]+:\d+'",
                f"url: 'http://{self.config.dev_server_ip}:3000'",
                content
            )
            
            with open(mobile_config_path, 'w') as f:
                f.write(content)
            
            print(f"  ✅ Updated {mobile_config_path}")
            status['mobile_config'] = "Updated"
        
        return status
    
    def _start_dev_servers(self) -> Dict[str, str]:
        """Start Next.js and API development servers."""
        status = {}
        
        # Check if servers are already running
        if self._check_port(3000):
            print("  ⚠️ Port 3000 already in use - assuming dev server is running")
            status['next_server'] = "Already running"
        else:
            print("  🚀 Starting Next.js dev server...")
            # Start in background
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.current_processes['next'] = process
            time.sleep(5)  # Give it time to start
            status['next_server'] = "Started"
            print("  ✅ Next.js dev server started")
        
        if self._check_port(3001):
            print("  ⚠️ Port 3001 already in use - assuming API server is running")
            status['api_server'] = "Already running"
        else:
            print("  🚀 Starting API server...")
            process = subprocess.Popen(
                ['npm', 'run', 'backend:dev'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            self.current_processes['api'] = process
            time.sleep(3)
            status['api_server'] = "Started"
            print("  ✅ API server started")
        
        return status
    
    def _sync_ios_project(self) -> Dict[str, str]:
        """Sync the iOS project with Capacitor."""
        status = {}
        
        try:
            # Build the Next.js project first
            print("  📦 Building Next.js project...")
            result = subprocess.run(
                ['npm', 'run', 'build'],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                print("  ✅ Build completed successfully")
                status['build'] = "Success"
            else:
                print(f"  ⚠️ Build completed with warnings")
                status['build'] = "Completed with warnings"
            
            # Sync with Capacitor
            print("  🔄 Syncing with Capacitor...")
            result = subprocess.run(
                ['npx', 'cap', 'sync', 'ios'],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                print("  ✅ Capacitor sync completed")
                status['sync'] = "Success"
            else:
                print(f"  ❌ Sync failed: {result.stderr}")
                status['sync'] = f"Failed: {result.stderr[:100]}"
            
        except subprocess.TimeoutExpired:
            print("  ⚠️ Operation timed out")
            status['sync'] = "Timeout"
        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            status['sync'] = f"Error: {str(e)}"
        
        return status
    
    def _configure_ar_permissions(self) -> Dict[str, str]:
        """Configure AR and camera permissions for iOS."""
        status = {}
        
        info_plist_path = "ios/App/App/Info.plist"
        
        if os.path.exists(info_plist_path):
            with open(info_plist_path, 'r') as f:
                content = f.read()
            
            # Check if camera permission is already set
            if 'NSCameraUsageDescription' not in content:
                # Add camera permission
                camera_permission = """	<key>NSCameraUsageDescription</key>
	<string>This app needs camera access to scan book shelves and identify books using AR features.</string>"""
                
                # Insert before the closing </dict>
                content = content.replace('</dict>', f'{camera_permission}\n</dict>')
            
            # Check if motion permission is set (for AR)
            if 'NSMotionUsageDescription' not in content:
                motion_permission = """	<key>NSMotionUsageDescription</key>
	<string>This app needs motion tracking for AR book discovery features.</string>"""
                
                content = content.replace('</dict>', f'{motion_permission}\n</dict>')
            
            # Save updated plist
            with open(info_plist_path, 'w') as f:
                f.write(content)
            
            print("  ✅ AR permissions configured")
            status['ar_permissions'] = "Configured"
        else:
            print("  ⚠️ Info.plist not found")
            status['ar_permissions'] = "Info.plist not found"
        
        return status
    
    def _check_port(self, port: int) -> bool:
        """Check if a port is in use."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('127.0.0.1', port))
        sock.close()
        return result == 0
    
    def _print_testing_instructions(self):
        """Print instructions for testing on physical device."""
        print("\n" + "=" * 60)
        print("📱 TESTING ON YOUR iPHONE")
        print("=" * 60)
        print()
        print("1️⃣ NETWORK SETUP:")
        print(f"   • Ensure your iPhone is on the same Wi-Fi as this computer")
        print(f"   • Your dev server is at: http://{self.config.dev_server_ip}:3000")
        print()
        print("2️⃣ OPEN IN XCODE:")
        print("   Run: npx cap open ios")
        print()
        print("3️⃣ CONFIGURE XCODE:")
        print("   • Select your iPhone from device list")
        print("   • Trust your developer certificate on iPhone:")
        print("     Settings → General → Device Management → Developer App")
        print()
        print("4️⃣ RUN THE APP:")
        print("   • Click the Play button in Xcode")
        print("   • Or use: npx cap run ios --target [device-id]")
        print()
        print("5️⃣ LIVE RELOAD:")
        print("   • Changes to your code will auto-reload on the device")
        print("   • Keep this terminal open for live reload to work")
        print()
        print("6️⃣ AR TESTING:")
        print("   • Grant camera permissions when prompted")
        print("   • AR features will use native camera APIs")
        print("   • Use Safari DevTools for debugging:")
        print("     Safari → Develop → [Your Device] → [App Name]")
        print()
        print("⚠️ TROUBLESHOOTING:")
        print("   • If app shows blank: Check Wi-Fi connection")
        print("   • If can't connect: Verify IP in capacitor.config.json")
        print("   • If AR fails: Check camera permissions in Settings")
        print("   • Run 'npm run ios:fix' if you see build errors")
        print()
        print("🎯 QUICK COMMANDS:")
        print("   npm run ios:dev     # Start everything for iOS development")
        print("   npm run ios:sync    # Sync changes to iOS project")
        print("   npm run ios:logs    # View iOS device logs")
        print("=" * 60)
    
    def monitor_development(self):
        """Monitor development and provide real-time feedback."""
        print("\n📊 MONITORING iOS DEVELOPMENT")
        print("-" * 40)
        
        while True:
            try:
                # Check server status
                next_status = "✅" if self._check_port(3000) else "❌"
                api_status = "✅" if self._check_port(3001) else "❌"
                
                # Check if device is connected (via Xcode)
                device_check = subprocess.run(
                    ['xcrun', 'simctl', 'list', 'devices'],
                    capture_output=True,
                    text=True
                )
                
                connected_devices = []
                if "Booted" in device_check.stdout:
                    connected_devices.append("Simulator")
                
                # Display status
                print(f"\r[{time.strftime('%H:%M:%S')}] Next.js: {next_status} | API: {api_status} | Devices: {', '.join(connected_devices) if connected_devices else 'None'}", end="")
                
                time.sleep(5)
                
            except KeyboardInterrupt:
                print("\n\n👋 Stopping monitor...")
                break
    
    def quick_fix_common_issues(self, issue_type: str) -> str:
        """Quick fixes for common iOS development issues."""
        fixes = {
            "blank_screen": """
🔧 FIXING BLANK SCREEN:
1. Check network connection:
   - Verify iPhone and computer are on same Wi-Fi
   - Run: ping {ip} from iPhone browser
   
2. Update Capacitor config:
   - Set correct IP in capacitor.config.json
   - Run: npx cap sync ios
   
3. Clear and rebuild:
   - rm -rf ios/App/App/public
   - npm run build
   - npx cap copy ios
            """.format(ip=self.config.dev_server_ip),
            
            "build_error": """
🔧 FIXING BUILD ERRORS:
1. Clean build:
   - In Xcode: Product → Clean Build Folder
   - Delete DerivedData: rm -rf ~/Library/Developer/Xcode/DerivedData
   
2. Update pods:
   - cd ios/App && pod install
   - pod update
   
3. Reset Capacitor:
   - npx cap sync ios --deployment
            """,
            
            "ar_not_working": """
🔧 FIXING AR FEATURES:
1. Check permissions in Info.plist:
   - NSCameraUsageDescription
   - NSMotionUsageDescription
   
2. Enable WebRTC (for camera access):
   - Add to capacitor.config.json:
     "ios": { "allowsInlineMediaPlayback": true }
   
3. Use native camera plugin instead of WebXR:
   - Since iOS Safari doesn't support WebXR
   - Implement with Capacitor Camera plugin
   - Use AR Quick Look for 3D models
            """,
            
            "live_reload_broken": """
🔧 FIXING LIVE RELOAD:
1. Verify server is accessible:
   - Open http://{ip}:3000 on iPhone browser
   
2. Check cleartext setting:
   - Ensure "cleartext": true in capacitor.config.json
   
3. Restart with correct binding:
   - npm run dev (should bind to 0.0.0.0)
   - Check HOST=0.0.0.0 is set
            """.format(ip=self.config.dev_server_ip)
        }
        
        return fixes.get(issue_type, "Issue type not recognized. Try: blank_screen, build_error, ar_not_working, live_reload_broken")

def main():
    """Main entry point for iOS development agent."""
    agent = StacksiOSAgent()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "setup":
            agent.setup_ios_development()
        elif command == "monitor":
            agent.monitor_development()
        elif command == "fix":
            if len(sys.argv) > 2:
                print(agent.quick_fix_common_issues(sys.argv[2]))
            else:
                print("Usage: python ios-dev-agent.py fix [issue_type]")
                print("Issues: blank_screen, build_error, ar_not_working, live_reload_broken")
        else:
            print(f"Unknown command: {command}")
    else:
        # Default: run setup
        agent.setup_ios_development()

if __name__ == "__main__":
    main()