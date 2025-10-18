# Zenoter 🚀

> A modern, cloud-synced note-taking app for developers with VS Code-like interface

**🎯 Strategy**: Web-first → Mobile PWA → Desktop apps | Multi-device sync from day 1

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Qualification](https://github.com/rumankazi/zenoter/actions/workflows/qualification.yml/badge.svg)](https://github.com/rumankazi/zenoter/actions/workflows/qualification.yml)
[![CodeQL Advanced](https://github.com/rumankazi/zenoter/actions/workflows/codeql.yml/badge.svg)](https://github.com/rumankazi/zenoter/actions/workflows/codeql.yml)

## ✨ Features

- 📝 **Monaco Editor** - VS Code's powerful editor at the core
- ☁️ **Cloud Sync** - Access your notes from any device
- 🔐 **Secure Auth** - Firebase Auth with OAuth (Google, GitHub)
- 📡 **Offline-First** - Works without internet, syncs when online
- 🎨 **Beautiful Animations** - Smooth, modern animations throughout
- 🌙 **Dark/Light Themes** - Easy on the eyes for long coding sessions
- 🔍 **Advanced Search** - Full-text search (Pro: regex + AST)
- ⚡ **Lightning Fast** - Instant startup and 60fps animations
- 💾 **Auto-Save** - Never lose your work
- 🕰️ **Time Travel** - Daily auto-commits, restore any previous version
- ⚡ **On-Demand Commits** (Pro) - Save snapshots anytime with custom messages
- 📱 **Progressive Web App** - Install on mobile like a native app
- 📝 **Snippet Library** - Reusable code templates (Pro: unlimited)
- 🌐 **Browser Extension** (Pro) - Save web content instantly
- 📊 **Advanced Diagrams** (Pro) - PlantUML, D2, GraphViz
- 👥 **Team Workspaces** (Team) - Collaborate with RBAC
- 🗄️ **Database Runner** (Team) - Query PostgreSQL/MySQL inline
- 🔗 **Git Integration** (Team) - Sync with GitHub/GitLab
- 🤖 **AI Code Assistant** (Enterprise) - Generate & refactor code
- 🖥️ **Terminal Integration** (Enterprise) - Run commands in cloud

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Windows 10/11 (macOS and Linux coming soon)

### Installation

```bash
# Clone the repository
git clone https://github.com/rumankazi/zenoter.git
cd zenoter

# Install dependencies with pnpm
pnpm install

# Start development
pnpm electron:dev

# Run tests
pnpm test
```

### Build for Production

```bash
# Build for current platform
pnpm dist

# Build for specific platform
pnpm dist:win   # Windows
pnpm dist:mac   # macOS
pnpm dist:linux # Linux
```

## 📚 Documentation

Visit our [documentation site](https://rumankazi.github.io/zenoter/) for detailed guides and API references.

## Quick Links

- [Getting Started](https://rumankazi.github.io/zenoter/guide/getting-started)
- [Features Overview](https://rumankazi.github.io/zenoter/features/overview)
- [Development Guide](https://rumankazi.github.io/zenoter/development/architecture)
- [Roadmap](https://rumankazi.github.io/zenoter/roadmap)

## 🛠️ Tech Stack

### Tech Stack

- **Frontend**: React 18+ (shared across all platforms)
- **Editor**: Monaco Editor (desktop/web), CodeMirror 6 (mobile PWA)
- **Database**: IndexedDB (local) + Firestore (cloud sync)
- **Auth**: Firebase Auth (OAuth + email/password)
- **Animations**: Framer Motion + Lottie
- **Styling**: CSS Modules (CSP compliant)
- **State**: Zustand
- **Testing**: Vitest + Playwright
- **Hosting**: Vercel/Netlify (web) + GitHub Releases (desktop)

## 🗺️ Roadmap

### Phase 1: Web MVP with Auth + Sync (4 weeks) ⚡

- ✅ Core editor functionality
- ✅ Firebase authentication
- ✅ Cloud sync with Firestore
- ✅ Offline-first architecture (IndexedDB)
- ✅ Markdown preview
- ✅ Dark/Light themes
- ⏳ Git-like commits (daily auto-save)
- ⏳ Commit history & restore
- ⏳ Deploy to Vercel

### Phase 2: Mobile PWA (1 week) 📱

- 🔜 PWA manifest
- 🔜 Service worker for offline
- 🔜 Push notifications
- 🔜 Install prompt

### Phase 3: Desktop Apps (When users request) �️

- 🔜 Electron app using shared code
- 🔜 Windows → macOS → Linux
- 🔜 Same auth/sync as web

### Phase 4: Pro Features (Q2 2026) 🚀

- 🔜 On-demand commits (Premium: $9/month)
- 🔜 Advanced search (regex + AST)
- 🔜 Unlimited snippet library
- 🔜 Browser extension (web clipper)
- 🔜 Advanced diagrams (PlantUML, D2)

### Phase 5: Team Features (Q3 2026) 👥

- 🔜 Team workspaces with RBAC ($15/user/month)
- 🔜 Shared snippets & templates
- 🔜 Database query runner
- 🔜 Git integration (GitHub/GitLab)
- 🔜 Audit logs

### Phase 6: Enterprise Features (Q4 2026) 🏢

- 🔜 AI code assistant (Custom pricing)
- 🔜 Terminal integration
- 🔜 SSO/SAML authentication
- 🔜 On-premise deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add some amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Monaco Editor team for the amazing editor
- Framer Motion for smooth animations
- The React and Electron communities

## 📬 Contact

- **Developer**: Ruman Kazi
- **GitHub**: [@rumankazi](https://github.com/rumankazi)
- **Discord**: [Join our community](https://discord.gg/zenoter)

---

**Note**: Zenoter is currently in alpha. Expect rapid development and potential breaking changes.
