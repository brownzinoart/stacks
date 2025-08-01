import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stacks.library',
  appName: 'Stacks',
  webDir: '../out',
  // Using static files - comment out server config for production-like testing
  // server: {
  //   androidScheme: 'http',
  //   iosScheme: 'http',
  //   url: 'http://localhost:3000',
  //   cleartext: true
  // },
  ios: {
    preferredContentMode: 'mobile',
    backgroundColor: '#FBF7F4',
    scrollEnabled: true,
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
