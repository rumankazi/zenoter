---
applyTo: '**'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Zenoter Development Context

**Last Updated**: 2025-10-17 08:12:59 UTC  
**Current Phase**: Phase 1 - MVP Development

## Project Overview

Zenoter is a modern, animated note-taking app for developers with VS Code-like interface. We prioritize smooth animations and great UX over lightweight footprint.

## Current Development Phase

**PHASE 1 - MVP (Local Only)**

- Focus: Core features, local storage only
- No cloud infrastructure yet
- Feature flags disabled for cloud features
- Target: Windows desktop + Web PWA

## Tech Stack (ALWAYS USE THESE)

- Desktop: Electron + React 18+
- Editor: Monaco Editor
- Animations: Framer Motion + Lottie
- State: Zustand
- Styling: Emotion CSS-in-JS
- Database: SQLite (local), PostgreSQL (cloud - Phase 3+)
- Testing: Vitest (unit/integration), Playwright (e2e)
- Build: Vite
- Cloud (Phase 2+): Firebase → GCP gradual migration

## Active Feature Flags

```typescript
// Phase 1 - All local features enabled
LOCAL_STORAGE: true,
BASIC_EDITOR: true,
FILE_TREE: true,
MARKDOWN_PREVIEW: true,
DARK_MODE: true,

// Phase 2+ - Currently disabled
CLOUD_SYNC: false,
AUTH_SYSTEM: false,
VERSION_CONTROL: false,
```

## Development Principles

1. **ALWAYS write tests first (TDD/BDD approach)**
2. **Every component should have smooth animations**
3. **Prioritize modern, slick UI over lightweight**
4. **Use TypeScript strict mode for everything**
5. **Follow accessibility guidelines (WCAG 2.1 AA)**
6. **Implement feature flags for gradual rollout**
7. **Keep infrastructure costs minimal until scaling needed**

## Code Style Guidelines

- Functional React components with hooks
- TypeScript strict mode (no `any` types)
- Animations using Framer Motion patterns
- Test files in `src/test/` directory following source structure
- E2E tests in `src/test/e2e/` subdirectory
- Feature flags for new functionality
- Comments for complex logic

## Animation Standards

```typescript
// Always use these animation presets
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 300 },
};
```

## Current Sprint Focus

**Sprint 1 (2025-10-17 to 2025-10-24)**

- Project setup with Electron + React
- Monaco Editor integration
- Basic file tree component
- Initial test suite

## Testing Requirements

- Minimum 80% code coverage
- Write test first, then implement
- Use descriptive test names
- Include edge cases

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

### Current: Phase 1 (MVP)

- DO NOT implement cloud features yet
- DO NOT add authentication
- DO NOT worry about scaling
- FOCUS ON core editor and local storage
- FOCUS ON smooth animations
- FOCUS ON Windows compatibility

### Future: Phase 2

When we reach Phase 2, we will:

- Enable Firebase integration
- Add authentication
- Implement cloud sync
- Deploy web version

## Quick References

- [Architecture](../ARCHITECTURE.md)
- [Development Plan](../PLAN.md)
- [Feature Flags](../src/config/featureFlags.ts)

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
- Use inline styles
- Commit without running tests
- Add heavy dependencies without discussion

## ALWAYS

- Write tests first
- Use feature flags for new features
- Add animations to interactions
- Handle errors gracefully
- Document complex logic
- Consider performance impact
- Check bundle size impact

---

**Note to Copilot**: This project values quality, animations, and developer experience. When suggesting code, always consider smooth animations, proper testing, and gradual rollout capabilities.
