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
      { text: 'API', link: '/api/introduction' },
      { text: 'Development', link: '/development/architecture' },
      {
        text: 'v1.0.0-alpha',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/getting-started' },
            { text: 'Configuration', link: '/guide/configuration' },
          ],
        },
        {
          text: 'Basic Usage',
          collapsed: false,
          items: [
            { text: 'Creating Notes', link: '/guide/creating-notes' },
            { text: 'Organizing Files', link: '/guide/organizing-files' },
            { text: 'Markdown Support', link: '/guide/markdown' },
            { text: 'Keyboard Shortcuts', link: '/guide/shortcuts' },
          ],
        },
        {
          text: 'Advanced',
          collapsed: false,
          items: [
            { text: 'Search & Filter', link: '/guide/search' },
            { text: 'Import & Export', link: '/guide/import-export' },
            { text: 'Themes', link: '/guide/themes' },
            { text: 'Settings', link: '/guide/settings' },
          ],
        },
      ],

      '/features/': [
        {
          text: 'Current Features',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/features/overview' },
            { text: 'Editor', link: '/features/editor' },
            { text: 'File Management', link: '/features/file-management' },
            { text: 'Preview', link: '/features/preview' },
            { text: 'Auto-save', link: '/features/auto-save' },
          ],
        },
        {
          text: 'Coming Soon',
          collapsed: false,
          items: [
            { text: 'Cloud Sync', link: '/features/cloud-sync' },
            { text: 'Version Control', link: '/features/version-control' },
            { text: 'Collaboration', link: '/features/collaboration' },
            { text: 'Mobile Apps', link: '/features/mobile' },
          ],
        },
      ],

      '/development/': [
        {
          text: 'Architecture',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/development/architecture' },
            { text: 'Tech Stack', link: '/development/tech-stack' },
            { text: 'Design Decisions', link: '/development/design-decisions' },
            { text: 'Folder Structure', link: '/development/folder-structure' },
          ],
        },
        {
          text: 'Development',
          collapsed: false,
          items: [
            { text: 'Setup', link: '/development/setup' },
            { text: 'Testing', link: '/development/testing' },
            { text: 'Feature Flags', link: '/development/feature-flags' },
            { text: 'Animation System', link: '/development/animations' },
          ],
        },
        {
          text: 'API Reference',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/api/introduction' },
            { text: 'Services', link: '/api/services' },
            { text: 'Stores', link: '/api/stores' },
            { text: 'Hooks', link: '/api/hooks' },
          ],
        },
        {
          text: 'Deployment',
          collapsed: false,
          items: [
            { text: 'Build Process', link: '/development/build' },
            { text: 'Release Strategy', link: '/development/release' },
            { text: 'Infrastructure', link: '/development/infrastructure' },
          ],
        },
      ],

      '/api/': [
        {
          text: 'Core APIs',
          collapsed: false,
          items: [
            { text: 'Introduction', link: '/api/introduction' },
            { text: 'Note Service', link: '/api/note-service' },
            { text: 'Database Service', link: '/api/database-service' },
            { text: 'Search Service', link: '/api/search-service' },
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
        placeholder: 'Search docs...',
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
