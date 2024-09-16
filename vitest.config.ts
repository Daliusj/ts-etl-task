import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['**/src/**/*.ts'],
    },

    // necessary for Vitest VS Code extension to pick up env variables
    env: loadEnv('', process.cwd(), ''),
  },
})
