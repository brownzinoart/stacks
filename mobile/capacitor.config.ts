import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stacks.library',
  appName: 'Stacks',
  webDir: '../out',
  // Use live reload server for development
  server: {
    url: 'http://192.168.86.190:3001',
    cleartext: true
  },
  ios: {
    preferredContentMode: 'mobile',
    backgroundColor: '#FBF7F4',
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    webContentsDebuggingEnabled: true,
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
