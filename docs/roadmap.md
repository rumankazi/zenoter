# Roadmap

**Last Updated**: October 18, 2025  
**Strategy**: Web-First → Mobile PWA → Desktop Apps (when requested)

---

## 🚧 Phase 1: Web MVP with Auth + Sync (Current)

**Timeline**: 4 weeks (Oct 18 - Nov 15, 2025)  
**Target Release**: November 15, 2025

### Core Features

- ✅ Monaco Editor integration
- ✅ Markdown preview with syntax highlighting
- ✅ Dark/Light/Auto themes
- ✅ Auto-save (500ms debounce)
- ✅ Keyboard shortcuts
- ⏳ Firebase Authentication (Google, GitHub, Email)
- ⏳ Cloud sync with Firestore
- ⏳ Offline-first (IndexedDB)
- ⏳ Conflict resolution UI
- ⏳ Deploy to Vercel

### What You Can Do

- Create and edit notes with VS Code-like editor
- Sync notes across all devices
- Work offline, sync when online
- Sign in with Google/GitHub
- Beautiful animations throughout

### Infrastructure

- **Hosting**: Vercel (free tier)
- **Auth**: Firebase Auth (free tier: 50k users)
- **Database**: Firestore + IndexedDB (free tier: 50k reads/day)
- **Cost**: $0/month ✅

---

## 📱 Phase 2: Mobile PWA

**Timeline**: 1 week (Nov 15-22, 2025)  
**Target Release**: November 22, 2025

### Planned Features

- 📲 Installable PWA on iOS/Android
- 🔄 Service worker for offline mode
- 📬 Push notifications (optional)
- 👆 Touch gesture optimizations
- 🎨 Mobile-specific UI adjustments
- **✏️ CodeMirror 6 Editor** (500KB, touch-optimized)
  - Syntax highlighting for 50+ languages
  - Native mobile selection
  - Auto-indentation and bracket matching
  - Code folding and search/replace
  - Battery-efficient

### What You'll Get

- Install app on phone like a native app
- Works offline with background sync
- Fast load times (cached assets)
- Native-like experience
- Touch-optimized editor (85% smaller than Monaco)

### Infrastructure

- Same as Phase 1 (still $0/month)

---

## �️ Phase 3: Desktop Apps (When Users Request)

**Timeline**: Q1 2026 (or when 100+ user requests)  
**Condition**: 100+ desktop requests OR $500+ MRR

### Platform Support

- 🪟 Windows (.exe)
- 🍎 macOS (.dmg)
- 🐧 Linux (.AppImage, Snap)

### Features

- Same features as web (shared codebase)
- SQLite for desktop storage
- Native menus and system tray
- Auto-update system
- Code signing (when revenue allows)

### Why Later?

- Code signing costs $200-400/year
- Web + PWA covers 95% of use cases
- Desktop when users specifically request it

---

## 🚀 Phase 4: Premium Features

**Timeline**: Q2 2026  
**Goal**: Revenue generation + advanced features

### Premium Tier ($5-10/month)

- ⚡ Real-time collaboration
- � Version history (Git-like)
- 🎨 Custom themes
- 🔍 Advanced search (regex, filters)
- � Unlimited storage
- 🏢 Workspace management
- 💼 Priority support

### Advanced Features

- 🤝 Real-time collaborative editing
- 🔌 Plugin ecosystem
- 🤖 AI-powered suggestions
- 📊 Analytics dashboard
- � Internationalization (i18n)
- 📡 Public API for integrations

---

## Feature Voting

Want to influence our roadmap? Vote for features or suggest new ones!

<div class="feature-voting">
  <a href="https://github.com/rumankazi/zenoter/discussions" class="vote-button">
    🗳️ Vote on Features
  </a>
  <a href="https://github.com/rumankazi/zenoter/issues/new" class="vote-button">
    💡 Suggest New Feature
  </a>
</div>

## Release Cadence

- **Alpha Releases**: Weekly during active development
- **Beta Releases**: Bi-weekly after Phase 1
- **Stable Releases**: Monthly after v1.0.0
- **Security Updates**: As needed (within 48 hours)

## Version History

### v1.0.0-alpha (Current)

- Initial release
- Core editing features
- Local storage only

### v1.0.0-beta (Planned)

- Cloud sync
- Authentication
- Web app

### v1.0.0 (Planned)

- First stable release
- Full documentation
- Community launch

<style>
.feature-voting {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.vote-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.vote-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>
