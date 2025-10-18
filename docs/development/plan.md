# Zenoter Development Plan & Progress Tracker

**Project Start Date**: 2025-10-17  
**Current Phase**: Phase 1 - Web MVP with Auth + Sync  
**Last Updated**: 2025-10-18 22:00:00 UTC

## 🎯 Strategic Pivot (October 2025)

### Why We Changed Direction

**Previous Plan** (Electron desktop-first):

- ❌ Windows code signing: $200-400/year
- ❌ App store approval delays
- ❌ Update friction (installers)
- ❌ No mobile support
- ❌ Single platform initially

**New Plan** (Web-first + monorepo):

- ✅ Zero deployment costs (Vercel free tier)
- ✅ Instant updates, no installers
- ✅ Works on ALL devices from day 1
- ✅ Mobile PWA = native-like on phones
- ✅ Desktop when users request (Phase 3+)
- ✅ Auth + sync from start = multi-device experience

## Overview

This document tracks our development progress and serves as the single source of truth for project phases, feature flags, and deployment strategy. We follow a web-first monorepo approach with shared React components across all platforms.

## Documentation Strategy

### Documentation Site (docs.zenoter.app)

- **Framework**: VitePress (modern, fast, beautiful)
- **Hosting**: GitHub Pages (free)
- **Automation**: Auto-deploy on push to main
- **Content Types**:
  - User guides
  - Feature documentation
  - API reference (auto-generated)
  - Development docs
  - Roadmap & changelog

### Documentation Updates

- Auto-sync from code comments using TypeDoc
- Architecture docs copied from repo
- Version-specific documentation branches
- Search functionality built-in

## Infrastructure Strategy (Cost-Conscious Approach)

### Phase 1: MVP (0-1K users) - Current

- **Frontend**: Web app + PWA
- **Auth**: Firebase Auth (free tier: 50k users/month)
- **Database**: IndexedDB (local) + Firestore (free tier: 50k reads/day)
- **Hosting**: Vercel/Netlify (free tier)
- **Monitoring**: Sentry (free tier)
- **Cost**: $0/month ✅

### Phase 2: Growth (1K-10K users)

- **Database**: Firestore paid tier (~$25/month)
- **CDN**: Cloudflare (free)
- **Monitoring**: Sentry paid (~$10/month)
- **Cost**: $35-55/month

### Phase 3: Scale (10K+ users)

- **Database**: PostgreSQL on Supabase ($25/month)
- **API**: Cloud Run ($30-50/month)
- **Storage**: Cloud Storage ($10/month)
- **Monitoring**: Advanced analytics ($20/month)
- **Cost**: $85-105/month

### Phase 4: Desktop (When Requested)

- Add Electron apps using shared `@zenoter/core`
- SQLite for desktop storage
- When: 100+ user requests OR $500+ MRR
- Cost: +$0 (GitHub Releases hosting)

- **Database**: SQLite local + Cloud SQL (PostgreSQL - smallest instance)
- **Auth**: Firebase Auth or GCP Identity Platform
- **Hosting**: GCP Cloud Run (pay per use)
- **Storage**: GCP Cloud Storage
- **CDN**: Cloudflare (free tier)
- **Documentation**: Netlify with analytics
- **Cost**: $50-200/month

### Phase 4 (10,000+ users)

- \*\*Full GCP migration with auto-scaling
- **Cost**: $200+/month (scales with usage)

## Feature Flags Configuration

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  // Phase 1 - Core + Auth + Sync (All enabled)
  LOCAL_STORAGE: true, // IndexedDB for offline-first
  BASIC_EDITOR: true,
  FILE_TREE: true,
  MARKDOWN_PREVIEW: true,
  DARK_MODE: true,
  AUTH_SYSTEM: true, // Firebase Auth
  CLOUD_SYNC: true, // Firestore sync
  ON_DEMAND_COMMITS: false, // Premium: Manual commits (paywall)

  // Phase 2 - Advanced features (Disabled)
  REAL_TIME_SYNC: false, // WebSocket sync (premium)
  VERSION_CONTROL: false, // Git-like versioning
  COLLABORATION: false, // Real-time collaborative editing
  ADVANCED_SEARCH: false,

  // Phase 3 - Premium features (Disabled)
  CUSTOM_THEMES: false,
  AI_SUGGESTIONS: false,

  // Phase 4 - Desktop/Mobile (Disabled)
  DESKTOP_APP: false, // Electron app
  MOBILE_NATIVE: false, // React Native
  PLUGIN_SYSTEM: false,
};
```

};

````

## Development Phases

### 🚧 Phase 1: Web MVP with Auth + Sync (4 weeks) - CURRENT

**Target Date**: 2025-11-15
**Status**: In Progress (Week 1)
**Infrastructure**: Vercel + Firebase free tier, $0 cost

### Week 1: Monorepo Setup (Oct 18-24)

**Goal**: Extract shared code into packages, set up workspace, create editor abstraction

**Tasks**:
1. Create `pnpm-workspace.yaml`
2. Set up `packages/` folder structure:
   - `@zenoter/core` - React components, hooks, utilities
   - `@zenoter/shared` - Auth interfaces, sync engine, storage abstractions
   - `@zenoter/web` - Vite config, IndexedDB implementation
3. Move existing components to `@zenoter/core`:
   - FileTree, ThemeToggle, FeatureFlagDemo
   - Monaco Editor wrapper
   - All hooks (useFeatureFlag, useKeyboardShortcut, etc.)
4. Create editor abstraction layer:
   ```typescript
   // @zenoter/core/components/Editor/Editor.types.ts
   interface EditorProps {
     value: string;
     onChange: (value: string) => void;
     language: string;
     theme: 'light' | 'dark';
     readOnly?: boolean;
   }

   // Platform-specific implementations:
   // - MonacoEditor.tsx (desktop/web)
   // - CodeMirrorEditor.tsx (mobile PWA)
````

5. Create storage abstraction layer:
   ```typescript
   interface StorageAdapter {
     get(key: string): Promise<any>;
     set(key: string, value: any): Promise<void>;
     delete(key: string): Promise<void>;
     list(): Promise<string[]>;
   }
   ```
6. Update all imports to use workspace packages
7. Verify all 224 unit tests + 59 E2E tests pass
8. Maintain 90%+ code coverage

#### Week 2: Firebase Auth + Backend (Oct 25-31)

- [ ] Set up Firebase project
- [ ] Implement auth UI (login/signup/reset)
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] Session management
- [ ] Auth tests (30+ new tests)

#### Week 3: IndexedDB + Sync Engine (Nov 1-7)

- [ ] Implement IndexedDB storage
- [ ] Build sync engine (debounced, background)
- [ ] Conflict resolution (last-write-wins)
- [ ] Offline queue with retry
- [ ] Sync UI indicators
- [ ] **Git-like commit system (auto-daily saves)**
  - [ ] Commit metadata schema (Firestore)
  - [ ] Storage abstraction (Cloud Storage for blobs)
  - [ ] Auto-commit service (daily at midnight)
  - [ ] Commit history UI (timeline view)
  - [ ] Restore from commit functionality
- [ ] Sync tests (40+ new tests)

#### Week 4: Polish + Deploy (Nov 8-14)

- [ ] Performance optimization
- [ ] SEO setup
- [ ] Deploy to Vercel
- [ ] Analytics (GA + Sentry)
- [ ] Documentation updates
- [ ] Beta testing

**Deliverables**:

- ✅ Web app with auth + sync
- ✅ Works offline (IndexedDB cache)
- ✅ Deployed to production
- ✅ Lighthouse score > 90
- ✅ Zero infrastructure costs

---

### 📋 Phase 2: Mobile PWA (1 week)

**Target Date**: 2025-11-22  
**Status**: Planned  
**Infrastructure**: Same as Phase 1 ($0/month)

#### Week 5: PWA Features (Nov 15-21)

- [ ] Create PWA manifest
- [ ] Implement service worker
- [ ] Add install prompt
- [ ] Push notifications (optional)
- [ ] Mobile optimizations
- [ ] PWA testing

**Deliverables**:

- ✅ Installable PWA on iOS/Android
- ✅ Offline mode working
- ✅ Mobile-optimized UI

---

### 📈 Phase 3: Desktop Apps (When Requested)

**Target Date**: Q1 2026 or when triggered  
**Status**: Future  
**Trigger**: 100+ user requests OR $500+ MRR  
**Infrastructure**: +$0 (GitHub Releases)

#### Scope:

- [ ] Electron app using `@zenoter/core`
- [ ] SQLite for desktop storage
- [ ] Same auth/sync as web
- [ ] Windows → macOS → Linux
- [ ] Code signing (when affordable)
- [ ] Auto-update system

**Deliverables**:

- ✅ Windows app (.exe)
- ✅ macOS app (.dmg)
- ✅ Linux app (.AppImage)

---

### 🚀 Phase 4: Premium Features

**Target Date**: Q2 2026  
**Status**: Future  
**Infrastructure**: PostgreSQL + Cloud Run ($85-105/month)

#### Premium Features:

- [ ] **On-Demand Commits** (Premium gated)
  - [ ] "Commit now" button in editor toolbar
  - [ ] Server-side entitlement check (Cloud Function)
  - [ ] Unlimited manual commits for premium users
  - [ ] Extended retention (1 year vs 30 days)
  - [ ] Pre-commit diff preview
  - [ ] Merge/replace restore options
  - [ ] Billing integration (Stripe webhook)
- [ ] Real-time collaboration
- [ ] Advanced search
- [ ] Custom themes
- [ ] Premium tier ($5-10/month)

**Retention Policies**:

- **Free users**: 1 auto-daily commit/day, 30-day retention, 1 on-demand/month
- **Premium users**: Unlimited on-demand commits, 1-year retention

**Goal**: $500+ MRR (50+ premium users)

---

## Documentation Tasks Checklist

### Phase 1 Documentation

- [ ] Set up VitePress project
- [ ] Configure GitHub Pages deployment
- [ ] Create homepage with features
- [ ] Write getting started guide
- [ ] Document keyboard shortcuts
- [ ] Create markdown syntax guide
- [ ] Add architecture documentation
- [ ] Generate API docs from TypeScript
- [ ] Create contribution guide
- [ ] Add changelog

### Phase 2 Documentation

- [ ] Document authentication methods
- [ ] Create sync troubleshooting guide
- [ ] PWA installation instructions
- [ ] Cloud features overview
- [ ] Privacy & security docs

### Phase 3 Documentation

- [ ] Premium features guide
- [ ] Custom theme creation
- [ ] Performance optimization tips
- [ ] Advanced search guide
- [ ] Subscription management

### Phase 4 Documentation

- [ ] Mobile app guides
- [ ] Plugin development API
- [ ] Enterprise deployment
- [ ] Collaboration features
- [ ] Migration guides

## Release Strategy

### Versioning

- **1.0.0-alpha**: Internal testing (Phase 1)
- **1.0.0-beta**: Public beta (Phase 2)
- **1.0.0**: First stable release (Phase 2 complete)
- **1.1.0**: Premium features (Phase 3)
- **2.0.0**: Mobile apps (Phase 4)

### Distribution Channels

1. **Phase 1**: GitHub Releases + Documentation site
2. **Phase 2**: GitHub + Website + Web App
3. **Phase 3**: Microsoft Store + Mac App Store
4. **Phase 4**: iOS App Store + Google Play Store

### User Rollout Strategy

```typescript
interface RolloutConfig {
  feature: string;
  percentage: number;
  criteria: 'random' | 'beta_users' | 'premium' | 'all';
  startDate: Date;
  endDate?: Date;
}

const rolloutPlan: RolloutConfig[] = [
  {
    feature: 'CLOUD_SYNC',
    percentage: 10,
    criteria: 'beta_users',
    startDate: new Date('2025-12-01'),
  },
  {
    feature: 'CLOUD_SYNC',
    percentage: 100,
    criteria: 'all',
    startDate: new Date('2025-12-15'),
  },
];
```

## Testing Strategy Per Phase

### Phase 1 (MVP)

- Unit tests: 80% coverage minimum
- Integration tests: Critical paths
- E2E tests: 5 core scenarios
- Manual testing: Windows only
- Documentation review: Technical accuracy

### Phase 2 (Cloud)

- Unit tests: 85% coverage
- Integration tests: All API endpoints
- E2E tests: 10 scenarios including auth
- Manual testing: Windows + Web
- Documentation: User feedback incorporated

### Phase 3 (Scale)

- Unit tests: 90% coverage
- Load testing: 1000 concurrent users
- E2E tests: 20 scenarios
- Performance testing: < 100ms response times
- Documentation: Video tutorials added

## Monitoring & Analytics (Cost-Conscious)

### Phase 1-2: Minimal Monitoring

- Sentry (free tier) for error tracking
- Google Analytics (free) for usage
- GitHub Issues for bug reports
- VitePress analytics for docs

### Phase 3+: Enhanced Monitoring

- GCP Cloud Monitoring
- Custom analytics dashboard
- A/B testing framework
- User feedback system
- Documentation search analytics

## Success Metrics

### Phase 1 Success Criteria

- [ ] 50 alpha testers
- [ ] < 5 critical bugs
- [ ] 4+ star average feedback
- [ ] Core features working offline
- [ ] 100+ documentation page views

### Phase 2 Success Criteria

- [ ] 500 beta users
- [ ] 50 users using cloud sync
- [ ] < 2% error rate
- [ ] 10 GitHub stars
- [ ] 1000+ documentation visits

### Phase 3 Success Criteria

- [ ] 1,000+ active users
- [ ] 50+ premium subscribers
- [ ] < 100ms search response
- [ ] 4.5+ app store rating
- [ ] 5000+ monthly doc visits

### Phase 4 Success Criteria

- [ ] 10,000+ users across platforms
- [ ] 500+ premium subscribers
- [ ] 5+ enterprise customers
- [ ] Self-sustaining revenue
- [ ] Community-contributed docs

## Risk Management

### Technical Risks

1. **Electron performance**: Mitigate with lazy loading
2. **Sync conflicts**: Implement robust conflict resolution
3. **Data loss**: Multiple backup strategies
4. **Security breaches**: End-to-end encryption, regular audits
5. **Documentation drift**: Auto-generate from code

### Business Risks

1. **Slow adoption**: Focus on developer communities
2. **Competition**: Differentiate with animations and UX
3. **Infrastructure costs**: Start with free tiers, scale gradually
4. **Platform restrictions**: Follow app store guidelines strictly
5. **Documentation maintenance**: Automate where possible

## Current Sprint (Update Weekly)

### Sprint 1: 2025-10-17 to 2025-10-24

**Goal**: Project foundation and core infrastructure

**Status**: 90% Complete ✅

**Completed Tasks**:

- [x] Initialize Electron + React project
- [x] Set up TypeScript and build configuration (strict mode)
- [x] Create basic file tree component
- [x] Write comprehensive test suite (65 unit tests, 100% coverage)
- [x] Set up VitePress documentation
- [x] Deploy docs to GitHub Pages
- [x] Create Electron main/preload processes
- [x] Implement feature flags system (config, service, hooks)
- [x] Set up CI/CD pipeline with semantic-release
- [x] Configure git hooks (pre-commit with comprehensive checks)
- [x] Implement E2E test suite (18 tests with Playwright)
- [x] **Build complete theme system (dark/light/auto)**
- [x] **Modern minimalistic theme toggle**
- [x] **CSS variable system for all components**
- [x] **Comprehensive visual E2E tests**

**Remaining Tasks**:

- [ ] Integrate Monaco Editor
- [ ] Set up SQLite database
- [ ] Implement auto-save functionality

**Blockers**: None

**Notes**:

- Theme system complete with modern icon-morph toggle
- 100% test coverage maintained (65 unit + 18 E2E tests)
- All components now use CSS variables for theming
- Fixed position theme toggle with smooth animations
- Next focus: Monaco Editor integration for note editing

---

## Team Notes & Decisions Log

### 2025-10-17

**Morning Session:**

- Decided to prioritize animations over lightweight footprint
- Chose Electron despite larger bundle size for better animation support
- Selected Monaco Editor for VS Code-like experience
- Planned incremental rollout strategy to minimize costs
- Added VitePress for modern documentation site
- Set up automated documentation deployment

**Afternoon Session:**

- Implemented Electron main/preload processes with proper security (context isolation)
- Created comprehensive E2E test suite (8 tests covering core functionality)
- Fixed UI consistency issues (web vs desktop color matching)
- Resolved console errors (preload module loading, CSP warnings)
- Reorganized git hooks for optimal developer workflow
- Implemented complete feature flag system using TDD approach
  - Config, service layer, React hooks all tested (27 tests)
  - Created visual demo component with Framer Motion animations
  - 100% test coverage on feature flag system
- Updated progress tracking to 80% of Sprint 1 complete

**Evening Session:**

- Built complete theme system with dark/light/auto modes
  - ThemeContext with system preference detection
  - CSS variable system for all colors, shadows, spacing
  - localStorage persistence for theme preference
- Redesigned theme toggle (modern icon-morph animation)
  - No sliding toggle, just icon that morphs in place
  - Sun/moon icons with smooth rotation transitions
  - Fixed position (top-right) with transparent background
  - Clean minimalistic design that blends with UI
- Fixed theme CSS loading issues
  - Added theme.css link to index.html
  - Made all components use CSS variables
  - Verified visual theme changes with E2E tests
- Added comprehensive visual E2E tests (5 new tests)
  - CSS variables loading verification
  - Theme switching visual confirmation
  - Background color changes tested
- Updated all components to use theme variables
  - FileTree, FeatureFlagDemo, App all themed
- Achieved 100% test coverage (65 unit + 18 E2E tests)
- Updated progress to 90% of Sprint 1 complete

---

## Quick Links

- [Architecture](./ARCHITECTURE.md)
- [GitHub Repository](https://github.com/rumankazi/zenoter)
- [Documentation Site](https://rumankazi.github.io/zenoter/)
- [CI/CD Pipeline](#)
- [Feature Flag Dashboard](#)
- [Analytics Dashboard](#)

---

**Next Update Due**: 2025-10-24 (End of Sprint 1)
