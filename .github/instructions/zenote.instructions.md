---
applyTo: '**'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Zenoter Development Context

**Last Updated**: 2025-10-18 18:06:00 UTC  
**Current Phase**: Phase 1 - MVP Development  
**Current Sprint**: Sprint 1 (2025-10-17 to 2025-10-24)

## Project Overview

Zenoter is a modern, animated note-taking app for developers with VS Code-like interface. We prioritize smooth animations and great UX over lightweight footprint.

**🎯 NEW STRATEGY (Oct 2025)**: Web-first + mobile PWA → Desktop apps later. Monorepo architecture with shared code across all platforms. Auth + cloud sync from day 1 for multi-device experience.

## 🔄 CRITICAL: Always Update Progress

**WHEN OPENING THIS PROJECT**, Copilot should ALWAYS:

1. **Check Current Progress**: Review PLAN.md Sprint section and update if completed tasks exist
2. **Update Last Updated Timestamp**: Change the timestamp at the top of this file
3. **Document Completed Work**: If any features were implemented, update the "Current Sprint Progress" section below
4. **Identify Next Tasks**: Based on completed work, suggest the next logical steps
5. **Update Feature Status**: Mark completed features in the checklist below

This ensures continuity across sessions and different devices.

## Current Development Phase

**PHASE 1 - MVP (Web-First with Auth + Sync)**

- Focus: Web app with cloud sync, multi-device support
- Auth: Firebase Auth (email/password + OAuth)
- Database: IndexedDB (local) + Firestore (cloud)
- Target: Web PWA first → Mobile PWA → Desktop (Phase 3+)
- Monorepo: Shared `@zenoter/core` package for all platforms

## Tech Stack (ALWAYS USE THESE)

**Monorepo Architecture:**

- **Core**: React 18+ components (shared across all platforms)
- **Web/PWA**: Vite + IndexedDB + Firebase
- **Desktop** (Phase 3+): Electron + SQLite
- **Mobile Native** (Phase 4+): React Native

**Shared Stack:**

- Editor: Monaco Editor (desktop/web), CodeMirror 6 (mobile PWA)
- Animations: Framer Motion + Lottie
- State: Zustand
- Styling: CSS Modules (NOT CSS-in-JS - CSP compliant)
- Testing: Vitest (unit/integration), Playwright (e2e)
- Build: pnpm workspaces + Turborepo (optional)

**Backend:**

- Auth: Firebase Auth (OAuth + email/password)
- Database: IndexedDB (local cache) + Firestore (cloud)
- Hosting: Vercel/Netlify (web) + GitHub Releases (desktop)
- Future: PostgreSQL on Supabase (Phase 3+)

## Active Feature Flags

```typescript
// Phase 1 - Core features + Auth + Sync
LOCAL_STORAGE: true,        // IndexedDB for offline-first
BASIC_EDITOR: true,
FILE_TREE: true,
MARKDOWN_PREVIEW: true,
DARK_MODE: true,
AUTH_SYSTEM: true,          // Firebase Auth enabled
CLOUD_SYNC: true,           // Firestore sync enabled
ON_DEMAND_COMMITS: false,   // Premium: Manual commits (paywall)

// Phase 2+ - Advanced features
REAL_TIME_SYNC: false,      // WebSocket sync (premium)
VERSION_CONTROL: false,     // Git-like versioning
COLLABORATION: false,       // Real-time collaborative editing

// Phase 3+ - Desktop specific
DESKTOP_APP: false,         // Electron desktop app
OFFLINE_SQLITE: false,      // Desktop SQLite storage
```

## Development Principles

1. **ALWAYS write tests first (TDD/BDD approach)**
2. **Every component should have smooth animations**
3. **Prioritize modern, slick UI over lightweight**
4. **Use TypeScript strict mode for everything**
5. **Follow accessibility guidelines (WCAG 2.1 AA)**
6. **Implement feature flags for gradual rollout**
7. **Keep infrastructure costs minimal until scaling needed**
8. **CRITICAL: Maintain CSP compliance - NO inline styles or CSS-in-JS**
9. **ALWAYS research best practices from top-tier projects (VS Code, Electron official docs)**
10. **Security-first approach: Follow Electron Security Guide**

## Security & CSP Best Practices

**ALWAYS follow strict CSP even in development!**

**Reference Projects**:

- VS Code: https://github.com/microsoft/vscode
- Electron Security: https://electronjs.org/docs/tutorial/security

### CSP Implementation Rules:

1. **NEVER use 'unsafe-inline' or 'unsafe-eval' in production**
2. **Apply CSP via Electron session.defaultSession.webRequest.onHeadersReceived**
3. **Remove CSP meta tags from HTML** - Electron controls CSP
4. **Development mode**: Use nonce-based CSP for Vite HMR
5. **Production mode**: Strict CSP (script-src 'self', style-src 'self')

### Why No Meta Tag CSP?

- Vite dev server injects styles via JavaScript for HMR
- Meta tag CSP blocks this → CSS Modules don't load → broken UI
- Solution: CSP via HTTP headers in Electron main process

### Problem-Solving Approach:

1. **Research** how VS Code/Electron/similar projects solve it
2. **Check** official documentation and security guides
3. **Implement** security-first solutions
4. **Test** in both dev and production modes
5. **Document** decisions in code comments

## Documentation Strategy

**IMPORTANT: Lightweight Documentation Approach**

- **DO NOT** create separate documentation for every incremental change
- **DO NOT** write docs for work-in-progress features
- **DO** add brief inline code comments for complex logic
- **DO** update relevant sections in existing docs (like PLAN.md) at major milestones
- **DO** document only when:
  - A complete feature is finished and tested
  - A major architecture decision is made
  - User-facing functionality changes significantly
  - API contracts are finalized

**Documentation Updates to Make:**

- Update PLAN.md Sprint section when sprint completes
- Update ARCHITECTURE.md only for major structural changes
- Update feature docs in `/docs` only at phase completions or major releases
- Keep inline TypeDoc comments for public APIs

**Focus on code quality and tests over documentation during development.**

## Code Style Guidelines

- Functional React components with hooks
- TypeScript strict mode (no `any` types)
- Animations using Framer Motion patterns
- Test files in `src/test/` directory following source structure
- E2E tests in `src/test/e2e/` subdirectory
- Feature flags for new functionality
- Comments for complex logic

## Styling Guidelines (CRITICAL FOR CSP)

**ALWAYS use CSS Modules, NEVER inline styles or CSS-in-JS:**

```tsx
// ✅ CORRECT - CSS Modules
import styles from './Component.module.css';
export const Component = () => <div className={styles.container}>...</div>;

// ❌ WRONG - Inline styles (violates CSP)
export const Component = () => <div style={{ padding: '20px' }}>...</div>;

// ❌ WRONG - Emotion/styled-components (violates CSP)
import { css } from '@emotion/css';
const container = css`
  padding: 20px;
`;
```

**Why CSS Modules:**

- CSP compliant (no `'unsafe-inline'` needed)
- Scoped styles (no naming conflicts)
- TypeScript support via `src/types/css-modules.d.ts`
- Works with CSS variables for theming
- Zero runtime overhead

**File naming**: `Component.module.css` (not `.css` or `.styles.ts`)

**Theme integration**: Use CSS variables in module files

```css
.container {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

## Animation Standards

```typescript
// Always use these animation presets
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 300 },
};
```

## Accessibility Requirements

**ALWAYS include proper ARIA attributes:**

```tsx
// ✅ Toggle buttons need aria-pressed
<button aria-pressed={isActive} onClick={toggle}>...</button>

// ✅ Icon buttons need aria-label
<button aria-label="Close dialog" onClick={close}>✕</button>

// ✅ Semantic HTML first
<nav aria-label="Main navigation">...</nav>
```

**Testing for accessibility:**

- All interactive elements must be keyboard accessible
- Test with `tab` key navigation
- Verify screen reader announcements (aria-label, aria-pressed, etc.)
- Color contrast must meet WCAG AA standards

## Current Sprint Focus

**Sprint 1 (2025-10-17 to 2025-10-24)** - Foundation Setup

### Sprint 1 Progress Tracker

- [x] Project setup with Electron + React
- [x] TypeScript strict mode configured
- [x] Vitest + Playwright setup
- [x] Basic file tree component
- [x] Initial test suite (65 unit tests, 100% coverage)
- [x] CI/CD pipeline with semantic-release
- [x] GitHub Pages documentation site deployed
- [x] Create Electron main/preload files
- [x] Implement feature flags system (27 tests)
- [x] Build theme system (dark/light/auto mode)
- [x] Modern minimalistic theme toggle
- [x] Full CSS variable theming system
- [x] Comprehensive E2E visual tests (18 tests)
- [x] Integrate Monaco Editor
- [x] Set up SQLite database
- [x] Database CRUD operations with IPC
- [x] NotesList component with glass-panel UI
- [x] SaveButton with state management
- [x] Error handling & toast notifications
- [x] Auto-save functionality (500ms debounce)
- [x] Keyboard shortcuts (Ctrl+S)

### Current Status Summary

**Completed (100% of Sprint 1)**:

- ✅ Infrastructure & build system
- ✅ Testing framework with 85.25% coverage (224 unit tests)
- ✅ Documentation site deployed
- ✅ CI/CD automation
- ✅ Electron desktop app structure
- ✅ Feature flags system (27 tests passing)
- ✅ Complete theme system (dark/light/auto)
- ✅ Modern theme toggle with icon animations
- ✅ CSS variable theming throughout app
- ✅ Comprehensive E2E visual tests (18 E2E tests)
- ✅ Monaco Editor integration
- ✅ SQLite database with migrations & IPC
- ✅ Full CRUD operations for notes
- ✅ NotesList with glass-panel create button
- ✅ SaveButton with unsaved changes indicator
- ✅ Error handling with minimalistic toast notifications
- ✅ Auto-save with debouncing (500ms)
- ✅ Keyboard shortcuts (useKeyboardShortcut hook)

**Known Issues**:

- Coverage at 85.25% (below 90% target) - Main issue: App.tsx integration tests need expansion
- React 19 async cleanup warnings in tests (cosmetic, doesn't affect functionality)

**Next Sprint Focus**: Increase test coverage to 90%+, polish UI, and additional features

## Testing Requirements

- Minimum 90% code coverage
- Write test first, then implement
- Use descriptive test names
- Include edge cases

**CRITICAL Testing Best Practices:**

```typescript
// ✅ CORRECT - Deterministic waiting in E2E tests
await page.waitForFunction(
  (expected) => document.querySelector('[data-testid="btn"]')?.textContent === expected,
  'Click me'
);

// ✅ CORRECT - Wait for element dimensions to match expected state
await page.waitForFunction(
  (selector) => {
    const el = document.querySelector(selector);
    return el && el.getBoundingClientRect().width > 1600;
  },
  'main'
);

// ❌ WRONG - Fixed timeouts (flaky tests)
await page.waitForTimeout(500);

// ✅ CORRECT - Clean test output (no console.log)
test('should update state', async () => {
  // Test logic without console.log
});

// ❌ WRONG - Console.log in tests (clutters CI)
test('should update state', async () => {
  console.log('Initial state:', state);
});

// ✅ CORRECT - Bash glob file checks (CI/CD workflows)
if ! ls dist/*.exe >/dev/null 2>&1; then
  echo "No .exe files found"
  exit 1
fi

// ❌ WRONG - [ -f ] with glob patterns (doesn't work)
if [ ! -f dist/*.exe ]; then  # This fails with multiple matches
  exit 1
fi

// ✅ CORRECT - Use global mocks from setup.ts
// No need to mock matchMedia in individual tests

// ❌ WRONG - Duplicate mocks
beforeEach(() => {
  window.matchMedia = vi.fn(); // Already in setup.ts
});
```

## File Naming Conventions

- Components: PascalCase (NoteEditor.tsx)
- Utilities: camelCase (markdown.ts)
- Unit/Integration Tests: \*.test.ts or \*.spec.ts (in src/test/)
- E2E Tests: \*.e2e.ts (in src/test/e2e/)
- Styles: \*.styles.ts (Emotion)

## Test Directory Structure

```
src/test/
  ├── setup.ts              # Test environment setup
  ├── components/           # Component tests mirroring src/components/
  │   └── FileTree/
  │       └── FileTree.test.tsx
  ├── services/             # Service tests
  ├── utils/                # Utility tests
  └── e2e/                  # End-to-end tests (Playwright)
      └── editor.e2e.ts
```

## Import Order

1. External packages
2. Internal components
3. Hooks
4. Services
5. Utils
6. Types
7. Styles

## Performance Budgets

- Startup: < 3 seconds
- Animation: 60fps minimum
- Search: < 100ms response
- Memory: < 300MB idle

## Security Considerations

- Sanitize all user input
- Use context isolation in Electron
- Implement CSP headers
- Encrypt sensitive data

## Phase-Specific Instructions

### Current: Phase 1 (Web MVP with Auth + Sync)

- ✅ IMPLEMENT Firebase Auth (email/password + Google OAuth)
- ✅ IMPLEMENT cloud sync with Firestore
- ✅ BUILD offline-first architecture (IndexedDB + background sync)
- ✅ DEPLOY web app to Vercel/Netlify
- ✅ FOCUS ON smooth animations and modern UX
- ✅ CREATE monorepo structure (`@zenoter/core` shared package)
- ✅ USE Monaco Editor for desktop/web (full VS Code experience)
- ✅ USE CodeMirror 6 for mobile PWA (500KB, touch-optimized, production-proven)
- ⚠️ DO NOT worry about Electron/Desktop yet (Phase 3+)
- ⚠️ DO NOT implement real-time collaboration yet (Phase 2+)

### Phase 2: Mobile PWA + Advanced Features

- Add PWA manifest and service workers
- Implement push notifications
- Add offline queue for failed syncs
- Real-time sync (WebSocket)
- Version history

### Phase 3: Desktop Apps (When Users Request)

- Electron app using `@zenoter/core`
- SQLite for desktop storage
- Same auth/sync as web
- Windows → macOS → Linux

### Phase 4: Native Mobile (If Needed)

- React Native using shared business logic
- iOS and Android apps

## Quick References

- [Architecture](../../docs/development/architecture.md)
- [Development Plan](../../docs/development/plan.md)
- [Documentation Site](https://rumankazi.github.io/zenoter/)

## Phase 1 Feature Completion Checklist

### Week 1-2: Foundation (Current)

- [x] Project infrastructure setup
- [x] Testing framework (Vitest + Playwright)
- [x] CI/CD with semantic-release
- [x] Documentation site (VitePress + GitHub Pages)
- [x] Electron main process implementation
- [x] Feature flags system (`src/config/featureFlags.ts`)
- [ ] Theme system (dark/light mode)
- [ ] Base component library

### Week 3-4: Core Features

- [ ] Monaco Editor integration
- [ ] File tree with drag-and-drop
- [ ] SQLite database setup
- [ ] Note CRUD operations
- [ ] Markdown preview pane
- [ ] Auto-save functionality

### Week 5-6: Polish & Testing

- [ ] Framer Motion animations throughout
- [ ] Keyboard shortcuts system
- [ ] Search implementation (local)
- [ ] Import/Export (markdown files)
- [ ] Settings panel
- [ ] Complete E2E test suite
- [ ] Windows installer (.exe)

## Common Patterns

### Component Structure

```typescript
interface Props {
  // Always define explicit props
}

export const Component: FC<Props> = ({ prop }) => {
  // Hooks first
  // Logic second
  // Render last
  return <motion.div {...fadeIn}>Content</motion.div>;
};
```

### Service Pattern

```typescript
class ServiceName {
  private static instance: ServiceName;

  static getInstance(): ServiceName {
    if (!this.instance) {
      this.instance = new ServiceName();
    }
    return this.instance;
  }
}
```

### Feature Flag Usage

```typescript
const Feature = () => {
  const isEnabled = useFeatureFlag('FEATURE_NAME');
  if (!isEnabled) return null;
  return <FeatureComponent />;
};
```

## DO NOT

- Use `any` type in TypeScript
- Skip writing tests
- Add cloud features in Phase 1
- Ignore accessibility
- **Use inline styles or CSS-in-JS (CSP violation)**
- **Use fixed timeouts in E2E tests (flaky)**
- **Add console.log statements to tests**
- Commit without running tests
- Add heavy dependencies without discussion
- Duplicate mocks that exist in setup.ts

## ALWAYS

- Write tests first
- Use CSS Modules (never inline styles or CSS-in-JS)
- Add ARIA attributes for accessibility (aria-label, aria-pressed, etc.)
- Use deterministic waiting in E2E tests (never fixed timeouts)
- Remove console.log from tests before committing
- Use feature flags for new features
- Add animations to interactions
- Handle errors gracefully
- Document complex logic
- Consider performance impact
- Verify CSP compliance (no 'unsafe-inline' needed)

---

**Note to Copilot**: This project values quality, animations, and developer experience. When suggesting code, always consider smooth animations, proper testing, and gradual rollout capabilities.
