import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.x88bank.app',
  appName: 'X88 Bank',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#15FF5D",
      showSpinner: false,
      androidSpinnerStyle: "large",
      spinnerColor: "#000000"
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#15FF5D'
    },
    Keyboard: {
      resize: 'ionic',
      style: 'dark'
    }
  },
  android: {
    buildOptions: {
      keystorePath: '',
      keystoreAlias: 'x88bank',
      releaseType: 'APK'
    },
    backgroundColor: '#000000'
  }
};

export default config;
