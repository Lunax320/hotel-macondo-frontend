import type { CapacitorConfig } from '@capacitor/cli';

// CapacitorHttp hace las peticiones desde la parte nativa, así el APK no sufre bloqueos de CORS
// (el backend solo permite http://localhost:4200).
const config: CapacitorConfig = {
  appId: 'com.hotelmacondo.app',
  appName: 'Hotel Macondo',
  webDir: 'dist/HotelMacondo/browser',
  plugins: {
    CapacitorHttp: { enabled: true },
  },
};

export default config;
