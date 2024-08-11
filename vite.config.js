import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Specify dependencies that should not be bundled
      // For example, if you want to exclude `react` and `react-dom`:
      external: ['react', 'react-dom'],
      // Alternatively, if you really want to prevent a file from being bundled, use the `input` option
      input: {
        main: '/src/main.jsx'
      }
    }
  }
});
