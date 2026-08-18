import { defineConfig } from '@vben/vite-config';

const backend = 'http://localhost:8080';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            target: backend,
            ws: true,
          },
        },
      },
    },
  };
});
