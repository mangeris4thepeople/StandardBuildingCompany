import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages hosts this repository under /StandardBuildingCompany/.
// Keep root-relative assets for the production custom domain on Vercel.
const base = process.env.GITHUB_ACTIONS === 'true' ? '/StandardBuildingCompany/' : '/'

export default defineConfig({ base, plugins: [react()] })
