import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stacks.library',
  appName: 'Stacks',
  webDir: '../out',
  
  // STATIC MODE - uses built files instead of live reload
  // server: {
  //   url: 'http://192.168.86.190:4000',
  //   cleartext: true
  // },
  
  ios: {
    preferredContentMode: 'mobile',
    backgroundColor: '#FBF7F4',
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    webContentsDebuggingEnabled: true,
  },
  android: {
    backgroundColor: '#FBF7F4',
    allowMixedContent: true, // Required for live reload
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
