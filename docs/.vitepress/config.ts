/**
 * @copilot-context Zenoter Documentation Configuration
 * VitePress config for automated documentation with GitHub Pages
 */

import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Zenoter',
  description: 'A modern, animated note-taking app for developers',
  base: '/zenoter/', // GitHub Pages base path
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true, // Ignore dead links during build

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { property: 'og:title', content: 'Zenoter - Developer Notes Reimagined' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'A modern note-taking app with VS Code-like interface and smooth animations',
      },
    ],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Zenoter',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Features', link: '/features/overview' },
      { text: 'Development', link: '/development/architecture' },
      {
        text: 'Resources',
        items: [
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Release Workflow', link: '/development/release-workflow' },
          { text: 'PR Qualification', link: '/development/pr-qualification' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [{ text: 'Quick Start', link: '/guide/getting-started' }],
        },
      ],

      '/features/': [
        {
          text: 'Features',
          collapsed: false,
          items: [{ text: 'Overview', link: '/features/overview' }],
        },
      ],

      '/development/': [
        {
          text: 'Architecture',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/development/architecture' },
            { text: 'Development Plan', link: '/development/plan' },
            { text: 'Animation System', link: '/development/animations' },
          ],
        },
        {
          text: 'Workflows & CI/CD',
          collapsed: false,
          items: [
            { text: 'Release Workflow', link: '/development/release-workflow' },
            { text: 'PR Qualification', link: '/development/pr-qualification' },
            { text: 'Releases Guide', link: '/development/releases' },
            {
              text: 'Smart Artifact Verification',
              link: '/development/workflows/smart-artifact-verification',
            },
          ],
        },
        {
          text: 'Build & Deployment',
          collapsed: false,
          items: [
            { text: 'Code Signing', link: '/development/code-signing' },
            { text: 'Build Fixes', link: '/development/fixes/build_fix_summary' },
          ],
        },
        {
          text: 'Release Documentation',
          collapsed: true,
          items: [
            { text: 'Release Strategy', link: '/development/release/release_strategy' },
            { text: 'Release Setup', link: '/development/release/release_setup' },
            { text: 'Release Improvements', link: '/development/release/release_improvements' },
            { text: 'Release Fix', link: '/development/release/release_fix' },
            { text: 'Release Cleanup', link: '/development/release/release_cleanup_summary' },
            { text: 'Workflow Comparison', link: '/development/release/workflow_comparison' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rumankazi/zenoter' },
      { icon: 'discord', link: 'https://discord.gg/zenoter' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Ruman Kazi',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search docs',
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/rumankazi/zenoter/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdatedText: 'Last updated',

    // Custom theme colors
    carbonAds: undefined, // No ads in documentation
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    config: (_md) => {
      // Add custom markdown plugins if needed
    },
  },

  vite: {
    // Custom Vite config for documentation
    ssr: {
      noExternal: ['@docsearch/js'],
    },
  },
});
