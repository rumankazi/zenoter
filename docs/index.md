---
layout: home

hero:
  name: 'Zenoter'
  text: 'A beautiful, animated note-taking app for developers'
  tagline: 'VS Code-like interface meets smooth animations. Your notes, reimagined.'
  image:
    src: /hero.png
    alt: Zenoter
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/rumankazi/zenoter

features:
  - icon: 📝
    title: Powerful Markdown Editor
    details: Full-featured markdown support with syntax highlighting, live preview, and VS Code's Monaco Editor at its core
    link: /features/editor

  - icon: 🎨
    title: Beautiful Animations
    details: Smooth, modern animations throughout the interface for a delightful user experience
    link: /development/animations

  - icon: 🔍
    title: Advanced Search
    details: Full-text search with regex support and instant results across all your notes
    link: /features/search

  - icon: 🌙
    title: Dark & Light Themes
    details: Beautiful themes optimized for long coding sessions with smooth transitions
    link: /guide/themes

  - icon: ⚡
    title: Lightning Fast
    details: Built with performance in mind - instant startup, 60fps animations, and responsive interactions
    link: /development/architecture

  - icon: 🔄
    title: Cloud Sync (Coming Soon)
    details: Seamlessly sync your notes across devices with end-to-end encryption
    link: /features/cloud-sync
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

.VPHero {
  animation: fadeInUp 0.6s ease;
}

.VPFeatures {
  animation: fadeInUp 0.8s ease 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .VPHero,
  .VPFeatures {
    animation: none;
  }
}
</style>
