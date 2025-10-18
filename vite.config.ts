import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths for Electron production builds
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          [
            '@emotion/babel-plugin',
            {
              sourceMap: true,
              autoLabel: 'dev-only',
              labelFormat: '[local]',
            },
          ],
        ],
      },
    }),
    // @ts-ignore - vite-plugin-monaco-editor type issue
    monacoEditorPlugin.default({}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'monaco-editor': ['@monaco-editor/react'],
          animation: ['framer-motion', 'lottie-react'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**', // Exclude Playwright E2E tests
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'dist-ssr/**',
        'out/**',
        'electron-dist/**',
        'build/**',
        'docs/**',
        'src/test/**',
        'src/main.tsx',
        '**/*.config.{js,ts}',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/.vitepress/**',
        'playwright.config.ts',
        'commitlint.config.js',
        'eslint.config.js',
        'vite.config.ts',
        'src/components/DatabaseTester/**', // Temporary test component
      ],
      include: ['src/**/*.{ts,tsx}'],
      all: true,
      thresholds: {
        lines: 85,
        functions: 80, // Lower threshold for App.tsx integration handlers
        branches: 85,
        statements: 85,
      },
    },
  },
});
