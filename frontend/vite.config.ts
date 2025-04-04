import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': 'http://localhost:8000', //auto appends in frontend + it will work as proxy as server will originate form 8000
        }
    }
  plugins: [react()],
})
