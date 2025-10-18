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
  ADVANCED_SEARCH: false, // Regex + AST search (Pro)

  // Phase 3 - Pro Features (Disabled)
  CODE_EXECUTION: false, // Run JS/Python/TS (Pro)
  SNIPPET_LIBRARY: false, // Unlimited snippets (Pro)
  DIAGRAM_ADVANCED: false, // PlantUML, D2 (Pro)
  BROWSER_EXTENSION: false, // Web clipper (Pro)
  LIVE_TEMPLATES: false, // Dynamic templates (Pro)

  // Phase 4 - Team Features (Disabled)
  TEAM_WORKSPACES: false, // Multi-user RBAC (Team)
  DATABASE_RUNNER: false, // Query databases (Team)
  GIT_INTEGRATION: false, // GitHub/GitLab (Team)
  AUDIT_LOGS: false, // Activity tracking (Team)

  // Phase 5 - Enterprise Features (Disabled)
  AI_ASSISTANT: false, // GPT-4/Claude (Enterprise)
  TERMINAL_INTEGRATION: false, // Cloud terminals (Enterprise)
  SSO_SAML: false, // Enterprise auth (Enterprise)
  ON_PREMISE: false, // Self-hosted (Enterprise)

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

- [ ] Set up Firebase project (dev + prod environments)
- [ ] Implement auth UI (login/signup/reset)
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] Session management with custom claims
- [ ] **Premium user infrastructure setup**
  - [ ] Firestore collections (users, subscriptions, usage)
  - [ ] Security rules for user data
  - [ ] useEntitlement hook for client-side gating
  - [ ] Entitlement service (Cloud Function)
- [ ] Auth tests (30+ new tests)

#### Week 3: IndexedDB + Sync Engine (Nov 1-7)

- [ ] Implement IndexedDB storage
- [ ] Build sync engine (debounced, background)
- [ ] Conflict resolution (last-write-wins)
- [ ] Offline queue with retry
- [ ] Sync UI indicators
- [ ] Sync tests (40+ new tests)

**Git-like Commit System (Auto-Commits)**:

- [ ] Commit metadata schema (Firestore)
- [ ] Storage abstraction (Cloud Storage for blobs)
- [ ] Auto-commit service (daily at midnight)
- [ ] Commit history UI (timeline view)
- [ ] Restore from commit functionality
- [ ] Set up Stripe account (test mode)
- [ ] Create products & prices (Pro, Team, Enterprise)
- [ ] Webhook handler (Cloud Function)
- [ ] Test checkout flow in staging
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

### 🚀 Phase 4: Pro Features (Q2 2026)

**Target Date**: Q2 2026 (10 weeks)  
**Status**: Future  
**Infrastructure**: PostgreSQL + Cloud Run ($85-105/month)  
**Pricing**: $9/month or $90/year

#### Pro Features (Individual developers):

- [ ] **On-Demand Commits** (Week 1-2)
  - [ ] "Commit now" button in editor toolbar
  - [ ] Server-side entitlement check (Cloud Function)
  - [ ] Unlimited manual commits for premium users
  - [ ] Extended retention (1 year vs 30 days)
  - [ ] Pre-commit diff preview
  - [ ] Merge/replace restore options
  - [ ] Billing integration (Stripe webhook)
  - [ ] **Retention**: Free (30 days, 1 on-demand/month) vs Pro (1 year, unlimited)

- [ ] **Advanced Search** (Week 3-4)
  - [ ] Regex search across all notes
  - [ ] AST-based code structure search (find functions, classes)
  - [ ] Search within commit history
  - [ ] Search filters (language, date, tags)
  - [ ] Performance: Web Worker for parsing (non-blocking)

- [ ] **Snippet Library** (Week 5-6)
  - [ ] Unlimited snippets (free: 10 max)
  - [ ] Tab-triggers (e.g., 'rfc' → React component)
  - [ ] Variable support (${1:name}, $CURRENT_DATE)
  - [ ] Monaco CompletionItemProvider integration
  - [ ] Sync across devices (Firestore)

- [ ] **Browser Extension** (Week 7-8)
  - [ ] Chrome/Firefox/Edge support
  - [ ] One-click save from web pages
  - [ ] Screenshot with annotations
  - [ ] Auto-tag by domain
  - [ ] Readability.js for clean Markdown conversion

- [ ] **Diagram-as-Code** (Week 9-10)
  - [ ] PlantUML server-side rendering
  - [ ] D2 diagram support
  - [ ] GraphViz integration
  - [ ] Export to PNG/SVG/PDF
  - [ ] Caching for performance

**Goal**: 5% free → Pro conversion (500 Pro users @ $9 = $4,500 MRR)

---

### 👥 Phase 5: Team Features (Q3 2026)

**Target Date**: Q3 2026 (12 weeks)  
**Status**: Future  
**Infrastructure**: Multi-tenant Firestore + Cloud Run  
**Pricing**: $15/user/month (min 5 seats)

#### Team Features (5-50 users):

- [ ] **Team Workspaces** (Week 1-3)
  - [ ] Multi-tenant workspace architecture
  - [ ] Role-based access control (Owner, Admin, Editor, Viewer)
  - [ ] Invitation system (email + magic links)
  - [ ] Real-time collaboration (Firestore listeners)
  - [ ] Workspace settings (name, avatar, billing)

- [ ] **Shared Snippets & Templates** (Week 4-5)
  - [ ] Team snippet libraries
  - [ ] Live templates with variables (Handlebars.js)
  - [ ] Template picker in "New Note" dropdown
  - [ ] Conditional sections in templates

- [ ] **Audit Logs** (Week 6-7)
  - [ ] Track all note access, edits, deletions
  - [ ] 90-day retention (free: none)
  - [ ] Export to CSV for compliance
  - [ ] Filter by user, action, date

- [ ] **Database Query Runner** (Week 8-9)
  - [ ] Connect to PostgreSQL, MySQL, MongoDB
  - [ ] Run queries inline, see results
  - [ ] Secure proxy connections
  - [ ] Query history and favorites

- [ ] **Git Integration** (Week 10-11)
  - [ ] GitHub/GitLab OAuth
  - [ ] Auto-link commits to notes
  - [ ] PR status in notes
  - [ ] Branch-specific notes
  - [ ] Webhooks for sync

- [ ] **Priority Support** (Week 12)
  - [ ] 24-hour response time
  - [ ] Dedicated Slack channel (Enterprise)
  - [ ] Video onboarding (5+ teams)

**Goal**: 20% Pro → Team conversion (100 Team users = 20 teams × 5 users @ $15 = $1,500 MRR)

---

### 🏢 Phase 6: Enterprise Features (Q4 2026)

**Target Date**: Q4 2026 (12 weeks)  
**Status**: Future  
**Infrastructure**: Dedicated Cloud Run instances + Cloud SQL  
**Pricing**: Custom ($500+/month, starting $10,000/year)

#### Enterprise Features (50+ users, compliance needs):

- [ ] **AI Code Assistant** (Week 1-4)
  - [ ] OpenAI GPT-4 or Anthropic Claude integration
  - [ ] Generate code from descriptions
  - [ ] Explain complex snippets
  - [ ] Refactor suggestions
  - [ ] Unlimited usage (Pro: 100 requests/day)
  - [ ] Privacy: transient processing, no storage
  - [ ] Cost: ~$750/month for 1,000 Pro users

- [ ] **Terminal Integration** (Week 5-8)
  - [ ] Cloud-based Docker containers
  - [ ] xterm.js + WebSocket frontend
  - [ ] Sandboxed execution (no network, 5-min timeout)
  - [ ] Command allowlist (security)
  - [ ] Output capture in notes

- [ ] **SSO/SAML** (Week 9-10)
  - [ ] Okta, Azure AD, Google Workspace
  - [ ] SCIM provisioning (auto-add/remove users)
  - [ ] Group-based permissions

- [ ] **On-Premise Deployment** (Week 11-12)
  - [ ] Docker Compose setup
  - [ ] Kubernetes Helm charts
  - [ ] Air-gapped installation docs
  - [ ] Self-hosted update mechanism

- [ ] **SOC 2 Compliance**
  - [ ] Annual audit
  - [ ] Security questionnaire support
  - [ ] Penetration testing reports

**Goal**: Close 5 enterprise deals (50 users @ $50/user = $2,500 MRR)

---

### 💰 Revenue Projections (10,000 Users)

**Phase 4 Complete** (Q2 2026):

- 500 Pro users × $9 = $4,500 MRR
- **Total**: $4,500 MRR ($54,000 ARR)

**Phase 5 Complete** (Q3 2026):

- 500 Pro users × $9 = $4,500 MRR
- 100 Team users × $15 = $1,500 MRR
- **Total**: $6,000 MRR ($72,000 ARR)

**Phase 6 Complete** (Q4 2026):

- 500 Pro users × $9 = $4,500 MRR
- 100 Team users × $15 = $1,500 MRR
- 50 Enterprise users × $50 = $2,500 MRR
- **Total**: $8,500 MRR ($102,000 ARR)

**At 100,000 users** (2027+):

- 5,000 Pro × $9 = $45,000 MRR
- 1,000 Team × $15 = $15,000 MRR
- 500 Enterprise × $50 = $25,000 MRR
- **Total**: $85,000 MRR ($1,020,000 ARR) 🎉

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
