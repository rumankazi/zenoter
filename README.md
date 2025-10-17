# Zenoter 🚀

> A modern, animated note-taking app for developers with VS Code-like interface

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0--alpha-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

## ✨ Features

- 📝 **Monaco Editor** - VS Code's powerful editor at the core
- 🎨 **Beautiful Animations** - Smooth, modern animations throughout
- 🌙 **Dark/Light Themes** - Easy on the eyes for long coding sessions
- 🔍 **Advanced Search** - Full-text search with regex support
- 📁 **Drag & Drop** - Organize notes effortlessly
- ⚡ **Lightning Fast** - Instant startup and 60fps animations
- 💾 **Auto-Save** - Never lose your work
- 🔐 **Secure** - Local storage with optional cloud sync (coming soon)

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

- **Desktop Framework**: Electron + React 18+
- **Editor**: Monaco Editor
- **Animations**: Framer Motion + Lottie
- **State Management**: Zustand
- **Styling**: Emotion CSS-in-JS
- **Database**: SQLite (local), PostgreSQL (cloud - coming soon)
- **Testing**: Vitest + Playwright
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 🗺️ Roadmap

### Phase 1: MVP (Current) ⚡

- ✅ Core editor functionality
- ✅ File management
- ✅ Markdown preview
- ✅ Dark/Light themes
- ⏳ Windows installer

### Phase 2: Cloud Features ☁️

- 🔜 User authentication
- 🔜 Cloud synchronization
- 🔜 Version history
- 🔜 Web app (PWA)

### Phase 3: Premium Features 💎

- 🔜 Real-time sync
- 🔜 Custom themes
- 🔜 Advanced search
- 🔜 macOS & Linux support

### Phase 4: Mobile & Beyond 📱

- 🔜 iOS & Android apps
- 🔜 Collaboration features
- 🔜 Plugin system
- 🔜 AI-powered features

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
