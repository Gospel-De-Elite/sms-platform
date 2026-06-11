// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// "scripts"; { "dev"; "vite --host" }
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // (Or vue(), svelte(), etc.)

export default defineConfig({
  plugins: [react()],
  server: {
    // This allows any host to connect (Easiest for ngrok)
    allowedHosts: true,

    // OR, if you want to be more secure, allow all ngrok domains:
    // allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app'],
  }
})