// // // frontend/vite.config.js
// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')
//   const isDev = mode === 'development'

//   return {
//     plugins: [react(), tailwindcss()],

//     resolve: {
//       extensions: ['.js', '.jsx', '.ts', '.tsx'],
//       dedupe: ['react', 'react-dom', 'react-router-dom'],
//     },

//     server: {
//       host: true,
//       port: 3000,
//       strictPort: true,
//       // ✅ NO hmr.host, NO origin, NO allowedHosts, NO usePolling
//       // Those were only needed when Vite ran inside Docker on EC2
//     },
    
//     preview: {
//       host: '0.0.0.0',
//       port: 3000,
//     },

//     build: {
//       outDir: 'dist',
//       sourcemap: false,
//       minify: 'esbuild',
//       chunkSizeWarningLimit: 1000,
//       rollupOptions: {
//         output: {
//           manualChunks: {
//             vendor: ['react', 'react-dom'],
//           },
//         },
//       },
//     },
//   }
// })




import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      dedupe: ['react', 'react-dom', 'react-router-dom'],
    },

    server: isDev
      ? {
          host: true,
          port: 3000,
          strictPort: true,
          origin: 'https://doctor.allcognix.com',
          allowedHosts: [
            'doctor.allcognix.com',
            'localhost',
            'frontend',
            '.allcognix.com',
          ],
          watch: {
            usePolling: true,
            interval: 1000,
          },
          hmr: {
            protocol: 'wss',
            host: 'doctor.allcognix.com',
            // port: 3000,
            clientPort: 443,
            timeout: 30000,
          },
        }
      : {
          host: true,
          port: 3000,
          strictPort: true,
        },

    preview: {
      host: '0.0.0.0',
      port: 3000,
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
        },
      },
    },
  }
})


