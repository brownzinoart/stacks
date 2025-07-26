import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stacks.library',
  appName: 'Stacks',
  webDir: '../out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // For development testing - uncomment and update IP address
    // url: 'http://YOUR_LOCAL_IP:3000',
    // cleartext: true
  },
  ios: {
    preferredContentMode: 'mobile',
    backgroundColor: '#FBF7F4',
    scrollEnabled: false,
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    backgroundColor: '#FBF7F4',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#FBF7F4',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
