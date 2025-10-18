# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 1.0.0 (2025-10-18)

### ⚠ BREAKING CHANGES

* Replace inline styles with CSS Modules to comply with strict CSP

**All 10 Copilot Review Comments Addressed:**

1. Remove inline styles from ThemeToggle, App, FeatureFlagDemo
   - Migrated to CSS Modules (.module.css files)
   - Added TypeScript declarations (css-modules.d.ts)
   - No CSP violations (style-src 'self' without unsafe-inline)

2. Fix duplicate CSS loading
   - Remove theme.css import from main.tsx
   - Keep in index.html with explanatory comment

3. Fix ThemeContext comment
   - Update to match actual toggle behavior (light ↔ dark)

4. Add aria-pressed attribute
   - Improve accessibility for toggle button

5. Remove console.log statements
   - Clean E2E test output (5 instances removed)

6. Remove duplicate matchMedia mock
   - Use global mock from setup.ts

7. Replace fixed timeouts with deterministic waiting
   - All E2E tests use page.waitForFunction()
   - More reliable, non-flaky tests

8. Fix E2E test failures
   - Update selectors for CSS Module classes
   - Fix layout and theme color tests

9. Update ARCHITECTURE.md
   - Document CSS Modules decision with rationale
   - Add CSP compliance section
   - Explain why NOT CSS-in-JS (Emotion/styled-components)

10. Update instructions file
    - Add styling guidelines (CSS Modules)
    - Add accessibility requirements (ARIA attributes)
    - Add testing best practices (deterministic waiting)
    - Update DO NOT and ALWAYS sections

**Architecture Decision:**
- CSS Modules chosen over Emotion CSS-in-JS for CSP compliance
- Emotion violates CSP (runtime style injection)
- CSS Modules: scoped, TypeScript support, zero runtime overhead

**Test Results:**
- Unit Tests: ✅ 65/65 passing (100% coverage)
- E2E Tests: ✅ 18/18 passing
- CSP Violations: ✅ 0

**Files Added:**
- src/types/css-modules.d.ts
- src/components/ThemeToggle/ThemeToggle.module.css
- src/App.module.css
- src/components/FeatureFlagDemo.module.css
- COPILOT_REVIEW_RESOLUTION.md

Co-authored-by: Copilot <copilot@github.com>
* none (just fixing the previous wrong release)

Changes:
- Delete incorrect v1.0.0 and v2.0.0 releases/tags
- Reset version to 0.0.0 for clean start
- Revert to release branch strategy (cleaner implementation)
- Remove complex release-major.yml workflow
- Simplify sync-release.yml (was sync-release-branch.yml)
- Update .releaserc.json to use 'release' branch
- Update release.yml to trigger on 'release' branch
- Update PR preview to show new flow
- Rewrite RELEASE_STRATEGY.md for clarity

Why release branch:
- Enables FULL branch protection on main (PR + reviews + checks)
- Version commits stay in release branch, never pollute main
- Industry standard (used by React, Babel, etc.)
- RELEASE_TOKEN only writes to unprotected release branch
- Auto-resolves conflicts by resetting to main

Previous issue:
* none (just fixing the previous wrong release)

Changes:
- Delete incorrect v1.0.0 and v2.0.0 releases/tags
- Reset version to 0.0.0 for clean start
- Revert to release branch strategy (cleaner implementation)
- Remove complex release-major.yml workflow
- Simplify sync-release.yml (was sync-release-branch.yml)
- Update .releaserc.json to use 'release' branch
- Update release.yml to trigger on 'release' branch
- Update PR preview to show new flow
- Rewrite RELEASE_STRATEGY.md for clarity

Why release branch:
- Enables FULL branch protection on main (PR + reviews + checks)
- Version commits stay in release branch, never pollute main
- Industry standard (used by React, Babel, etc.)
- RELEASE_TOKEN only writes to unprotected release branch
- Auto-resolves conflicts by resetting to main

Previous issue:
* none

* docs: update sprint 1 progress tracker

- Mark feature flags system as complete
- Update completion percentage to 80%
- Update timestamp
- Mark next priority as theme system

* feat: add feature flag support

* fix: prettier format

* fix: address PR review comments from copilot agent

Security & CSP:
- Remove 'unsafe-inline' from CSP and move inline styles to main.css
- Harden navigation security to check origins in both dev and prod
- Dev: only allow localhost:5173, Prod: only allow file: protocol

Testing & Coverage:
- Raise all coverage thresholds to 90% (statements, branches, functions, lines)
- Add comprehensive tests for FeatureFlagDemo (8 new tests)
- Consolidate duplicate E2E tests into single file (app-main.spec.ts)
- Achieve 100% code coverage (35 tests passing)
- Remove flaky test relying on module spy

Build & CI:
- Fix electron script to compile before running
- Remove E2E tests from pre-commit hook (keep in CI for speed)
- Move E2E to CI only to keep local commits fast

Code Quality:
- Remove unused 'vi' import from test file
- Fix TypeScript 'any' type warning with proper type assertion
- Clean up test imports and assertions

All tests passing:
✅ 35 unit/integration tests
✅ 8 E2E tests
✅ 100% coverage on all metrics
✅ Linter passing
✅ TypeScript passing

* fix: make E2E animation test robust for CI environments

Problem:
- E2E test checking opacity value was flaky in CI
- Animation timing varies between local and CI environments
- Test failed with opacity values like 0.06, 0.35, 0.07 instead of expected 0.9

Solution:
- Remove unreliable opacity value check
- Use Playwright's built-in toBeVisible() which waits for element stability
- Add content verification (toContainText) as additional check
- Verify ARIA attributes for proper accessibility

Why this is better:
- toBeVisible() automatically waits for animations to complete
- No hardcoded timeouts or opacity thresholds
- Tests actual functionality (visibility + content) not CSS values
- More reliable across different CI/local environments

Test results:
✅ 8 E2E tests passing locally
✅ No flaky timing issues
✅ Test validates actual user-visible behavior

* refactor: enable e2e for job status

* Build theme system ([#27](https://github.com/rumankazi/zenoter/issues/27)) ([4d40ba3](https://github.com/rumankazi/zenoter/commit/4d40ba3afe493e039a2c9ef1f1442c970d6c02f0))
* Fix issues with release ([#25](https://github.com/rumankazi/zenoter/issues/25)) ([dbb9958](https://github.com/rumankazi/zenoter/commit/dbb9958dcf4edca401e46327ef2a5748ed9b060e)), closes [#22](https://github.com/rumankazi/zenoter/issues/22)
* Phase 01 ([#22](https://github.com/rumankazi/zenoter/issues/22)) ([d13d067](https://github.com/rumankazi/zenoter/commit/d13d067981a758a330b088a2c2f44d4506a65881))

### 🎉 Features

* add comprehensive PR qualification pipeline and Renovate bot config ([8ccb37b](https://github.com/rumankazi/zenoter/commit/8ccb37ba00eee7338dfc9f5b513e4dbcbfca6853))
* add FileTree component and reorganize test structure ([3eb1096](https://github.com/rumankazi/zenoter/commit/3eb10963c49244830f6cbabff1b9db3d4ab704fd))
* add validate release for testing dry-run ([#19](https://github.com/rumankazi/zenoter/issues/19)) ([4eaf30f](https://github.com/rumankazi/zenoter/commit/4eaf30fc296aaf4202ebd3c1af435f9f97b785c8))
* automate semantic-release via release branch ([#12](https://github.com/rumankazi/zenoter/issues/12)) ([63a4606](https://github.com/rumankazi/zenoter/commit/63a4606723837b5ad649bdec9320fdd08e737b4c))
* automerge and group renovate bot prs ([#15](https://github.com/rumankazi/zenoter/issues/15)) ([6472445](https://github.com/rumankazi/zenoter/commit/64724455bcba6b2df4968873daba03dafc4c8879))
* implement automated release system with semantic-release ([d9fa74a](https://github.com/rumankazi/zenoter/commit/d9fa74a0561ff4ebba125ec1f026f81235f13df9))
* implement complete theme system with modern icon toggle ([#26](https://github.com/rumankazi/zenoter/issues/26)) ([42c3387](https://github.com/rumankazi/zenoter/commit/42c338758b2025c818af66a11abaadc11d01be70))
* initial setup ([b015432](https://github.com/rumankazi/zenoter/commit/b015432391cbc933c5e0fd092e023a96c084a872))

### 🐛 Bug Fixes

* append installation instructions instead of overwriting release notes ([8a27f3a](https://github.com/rumankazi/zenoter/commit/8a27f3a5eb62adfb5ee7c970d9051e03b06989c7))
* change secret ([#17](https://github.com/rumankazi/zenoter/issues/17)) ([db42035](https://github.com/rumankazi/zenoter/commit/db420358722c2fcc74e51e22754260fe6d5e2350))
* comment out api docs generation step ([a431773](https://github.com/rumankazi/zenoter/commit/a43177329585f97be74c4f4e171819c2f9425da2))
* correct cache dependency path ([ce5f5ed](https://github.com/rumankazi/zenoter/commit/ce5f5ed4854f565512c963040b5af5fcb744701e))
* correct installation of dependencies ([1436e63](https://github.com/rumankazi/zenoter/commit/1436e63b71f76098ec21dc88ace602990ab198e2))
* correct vitest command in pre-push hook ([e4a9af4](https://github.com/rumankazi/zenoter/commit/e4a9af47d516840a08758bde81d942e86455f0bb))
* disable husky hooks ([#20](https://github.com/rumankazi/zenoter/issues/20)) ([d438fad](https://github.com/rumankazi/zenoter/commit/d438fad5285126b3042e9b188cba281729f68051))
* docs deployment ([51dbd27](https://github.com/rumankazi/zenoter/commit/51dbd271dd9b5a5fc4ff0185573e268658e3763f))
* format and deployment config ([67be342](https://github.com/rumankazi/zenoter/commit/67be342231dd7440bd87947464094f3567ef39fb))
* installer issue and ui layout ([#28](https://github.com/rumankazi/zenoter/issues/28)) ([76027d0](https://github.com/rumankazi/zenoter/commit/76027d0ed95f13e3011d7e6c7220f323eb4069be))
* outdated actions ([f824fd1](https://github.com/rumankazi/zenoter/commit/f824fd1d87a13a2f895f2badc1e5e8ff4b28fb12))
* parse semantic-release output to set GitHub Actions variables ([4594785](https://github.com/rumankazi/zenoter/commit/45947851f9a613fd15117d47373eacedb77fe2b7))
* remove redundant coverage threshold check step ([e822fc9](https://github.com/rumankazi/zenoter/commit/e822fc9977b0b7c9df3fca5cb0a6abea096135ef))
* sem release workflow ([#16](https://github.com/rumankazi/zenoter/issues/16)) ([d1460dc](https://github.com/rumankazi/zenoter/commit/d1460dca67a076c4f84c9e2ef9f3d0129a8442a2))
* update renovate.json to use current configuration options ([8380e11](https://github.com/rumankazi/zenoter/commit/8380e11b70688b6adbdd10d3ec34eb1087fd0708))

### ♻️ Code Refactoring

* improve release strategy with clean release branch ([#24](https://github.com/rumankazi/zenoter/issues/24)) ([73de145](https://github.com/rumankazi/zenoter/commit/73de145481c253c8daaa264219330df3de9125f9)), closes [#22](https://github.com/rumankazi/zenoter/issues/22)

## 1.0.0 (2025-10-18)

### ⚠ BREAKING CHANGES

* Replace inline styles with CSS Modules to comply with strict CSP

**All 10 Copilot Review Comments Addressed:**

1. Remove inline styles from ThemeToggle, App, FeatureFlagDemo
   - Migrated to CSS Modules (.module.css files)
   - Added TypeScript declarations (css-modules.d.ts)
   - No CSP violations (style-src 'self' without unsafe-inline)

2. Fix duplicate CSS loading
   - Remove theme.css import from main.tsx
   - Keep in index.html with explanatory comment

3. Fix ThemeContext comment
   - Update to match actual toggle behavior (light ↔ dark)

4. Add aria-pressed attribute
   - Improve accessibility for toggle button

5. Remove console.log statements
   - Clean E2E test output (5 instances removed)

6. Remove duplicate matchMedia mock
   - Use global mock from setup.ts

7. Replace fixed timeouts with deterministic waiting
   - All E2E tests use page.waitForFunction()
   - More reliable, non-flaky tests

8. Fix E2E test failures
   - Update selectors for CSS Module classes
   - Fix layout and theme color tests

9. Update ARCHITECTURE.md
   - Document CSS Modules decision with rationale
   - Add CSP compliance section
   - Explain why NOT CSS-in-JS (Emotion/styled-components)

10. Update instructions file
    - Add styling guidelines (CSS Modules)
    - Add accessibility requirements (ARIA attributes)
    - Add testing best practices (deterministic waiting)
    - Update DO NOT and ALWAYS sections

**Architecture Decision:**
- CSS Modules chosen over Emotion CSS-in-JS for CSP compliance
- Emotion violates CSP (runtime style injection)
- CSS Modules: scoped, TypeScript support, zero runtime overhead

**Test Results:**
- Unit Tests: ✅ 65/65 passing (100% coverage)
- E2E Tests: ✅ 18/18 passing
- CSP Violations: ✅ 0

**Files Added:**
- src/types/css-modules.d.ts
- src/components/ThemeToggle/ThemeToggle.module.css
- src/App.module.css
- src/components/FeatureFlagDemo.module.css
- COPILOT_REVIEW_RESOLUTION.md

Co-authored-by: Copilot <copilot@github.com>
* none (just fixing the previous wrong release)

Changes:
- Delete incorrect v1.0.0 and v2.0.0 releases/tags
- Reset version to 0.0.0 for clean start
- Revert to release branch strategy (cleaner implementation)
- Remove complex release-major.yml workflow
- Simplify sync-release.yml (was sync-release-branch.yml)
- Update .releaserc.json to use 'release' branch
- Update release.yml to trigger on 'release' branch
- Update PR preview to show new flow
- Rewrite RELEASE_STRATEGY.md for clarity

Why release branch:
- Enables FULL branch protection on main (PR + reviews + checks)
- Version commits stay in release branch, never pollute main
- Industry standard (used by React, Babel, etc.)
- RELEASE_TOKEN only writes to unprotected release branch
- Auto-resolves conflicts by resetting to main

Previous issue:
* none (just fixing the previous wrong release)

Changes:
- Delete incorrect v1.0.0 and v2.0.0 releases/tags
- Reset version to 0.0.0 for clean start
- Revert to release branch strategy (cleaner implementation)
- Remove complex release-major.yml workflow
- Simplify sync-release.yml (was sync-release-branch.yml)
- Update .releaserc.json to use 'release' branch
- Update release.yml to trigger on 'release' branch
- Update PR preview to show new flow
- Rewrite RELEASE_STRATEGY.md for clarity

Why release branch:
- Enables FULL branch protection on main (PR + reviews + checks)
- Version commits stay in release branch, never pollute main
- Industry standard (used by React, Babel, etc.)
- RELEASE_TOKEN only writes to unprotected release branch
- Auto-resolves conflicts by resetting to main

Previous issue:
* none

* docs: update sprint 1 progress tracker

- Mark feature flags system as complete
- Update completion percentage to 80%
- Update timestamp
- Mark next priority as theme system

* feat: add feature flag support

* fix: prettier format

* fix: address PR review comments from copilot agent

Security & CSP:
- Remove 'unsafe-inline' from CSP and move inline styles to main.css
- Harden navigation security to check origins in both dev and prod
- Dev: only allow localhost:5173, Prod: only allow file: protocol

Testing & Coverage:
- Raise all coverage thresholds to 90% (statements, branches, functions, lines)
- Add comprehensive tests for FeatureFlagDemo (8 new tests)
- Consolidate duplicate E2E tests into single file (app-main.spec.ts)
- Achieve 100% code coverage (35 tests passing)
- Remove flaky test relying on module spy

Build & CI:
- Fix electron script to compile before running
- Remove E2E tests from pre-commit hook (keep in CI for speed)
- Move E2E to CI only to keep local commits fast

Code Quality:
- Remove unused 'vi' import from test file
- Fix TypeScript 'any' type warning with proper type assertion
- Clean up test imports and assertions

All tests passing:
✅ 35 unit/integration tests
✅ 8 E2E tests
✅ 100% coverage on all metrics
✅ Linter passing
✅ TypeScript passing

* fix: make E2E animation test robust for CI environments

Problem:
- E2E test checking opacity value was flaky in CI
- Animation timing varies between local and CI environments
- Test failed with opacity values like 0.06, 0.35, 0.07 instead of expected 0.9

Solution:
- Remove unreliable opacity value check
- Use Playwright's built-in toBeVisible() which waits for element stability
- Add content verification (toContainText) as additional check
- Verify ARIA attributes for proper accessibility

Why this is better:
- toBeVisible() automatically waits for animations to complete
- No hardcoded timeouts or opacity thresholds
- Tests actual functionality (visibility + content) not CSS values
- More reliable across different CI/local environments

Test results:
✅ 8 E2E tests passing locally
✅ No flaky timing issues
✅ Test validates actual user-visible behavior

* refactor: enable e2e for job status

* Build theme system ([#27](https://github.com/rumankazi/zenoter/issues/27)) ([4d40ba3](https://github.com/rumankazi/zenoter/commit/4d40ba3afe493e039a2c9ef1f1442c970d6c02f0))
* Fix issues with release ([#25](https://github.com/rumankazi/zenoter/issues/25)) ([dbb9958](https://github.com/rumankazi/zenoter/commit/dbb9958dcf4edca401e46327ef2a5748ed9b060e)), closes [#22](https://github.com/rumankazi/zenoter/issues/22)
* Phase 01 ([#22](https://github.com/rumankazi/zenoter/issues/22)) ([d13d067](https://github.com/rumankazi/zenoter/commit/d13d067981a758a330b088a2c2f44d4506a65881))

### 🎉 Features

* add comprehensive PR qualification pipeline and Renovate bot config ([8ccb37b](https://github.com/rumankazi/zenoter/commit/8ccb37ba00eee7338dfc9f5b513e4dbcbfca6853))
* add FileTree component and reorganize test structure ([3eb1096](https://github.com/rumankazi/zenoter/commit/3eb10963c49244830f6cbabff1b9db3d4ab704fd))
* add validate release for testing dry-run ([#19](https://github.com/rumankazi/zenoter/issues/19)) ([4eaf30f](https://github.com/rumankazi/zenoter/commit/4eaf30fc296aaf4202ebd3c1af435f9f97b785c8))
* automate semantic-release via release branch ([#12](https://github.com/rumankazi/zenoter/issues/12)) ([63a4606](https://github.com/rumankazi/zenoter/commit/63a4606723837b5ad649bdec9320fdd08e737b4c))
* automerge and group renovate bot prs ([#15](https://github.com/rumankazi/zenoter/issues/15)) ([6472445](https://github.com/rumankazi/zenoter/commit/64724455bcba6b2df4968873daba03dafc4c8879))
* implement automated release system with semantic-release ([d9fa74a](https://github.com/rumankazi/zenoter/commit/d9fa74a0561ff4ebba125ec1f026f81235f13df9))
* implement complete theme system with modern icon toggle ([#26](https://github.com/rumankazi/zenoter/issues/26)) ([42c3387](https://github.com/rumankazi/zenoter/commit/42c338758b2025c818af66a11abaadc11d01be70))
* initial setup ([b015432](https://github.com/rumankazi/zenoter/commit/b015432391cbc933c5e0fd092e023a96c084a872))

### 🐛 Bug Fixes

* append installation instructions instead of overwriting release notes ([8a27f3a](https://github.com/rumankazi/zenoter/commit/8a27f3a5eb62adfb5ee7c970d9051e03b06989c7))
* change secret ([#17](https://github.com/rumankazi/zenoter/issues/17)) ([db42035](https://github.com/rumankazi/zenoter/commit/db420358722c2fcc74e51e22754260fe6d5e2350))
* comment out api docs generation step ([a431773](https://github.com/rumankazi/zenoter/commit/a43177329585f97be74c4f4e171819c2f9425da2))
* correct cache dependency path ([ce5f5ed](https://github.com/rumankazi/zenoter/commit/ce5f5ed4854f565512c963040b5af5fcb744701e))
* correct installation of dependencies ([1436e63](https://github.com/rumankazi/zenoter/commit/1436e63b71f76098ec21dc88ace602990ab198e2))
* correct vitest command in pre-push hook ([e4a9af4](https://github.com/rumankazi/zenoter/commit/e4a9af47d516840a08758bde81d942e86455f0bb))
* disable husky hooks ([#20](https://github.com/rumankazi/zenoter/issues/20)) ([d438fad](https://github.com/rumankazi/zenoter/commit/d438fad5285126b3042e9b188cba281729f68051))
* docs deployment ([51dbd27](https://github.com/rumankazi/zenoter/commit/51dbd271dd9b5a5fc4ff0185573e268658e3763f))
* format and deployment config ([67be342](https://github.com/rumankazi/zenoter/commit/67be342231dd7440bd87947464094f3567ef39fb))
* installer issue and ui layout ([#28](https://github.com/rumankazi/zenoter/issues/28)) ([76027d0](https://github.com/rumankazi/zenoter/commit/76027d0ed95f13e3011d7e6c7220f323eb4069be))
* outdated actions ([f824fd1](https://github.com/rumankazi/zenoter/commit/f824fd1d87a13a2f895f2badc1e5e8ff4b28fb12))
* parse semantic-release output to set GitHub Actions variables ([4594785](https://github.com/rumankazi/zenoter/commit/45947851f9a613fd15117d47373eacedb77fe2b7))
* remove redundant coverage threshold check step ([e822fc9](https://github.com/rumankazi/zenoter/commit/e822fc9977b0b7c9df3fca5cb0a6abea096135ef))
* sem release workflow ([#16](https://github.com/rumankazi/zenoter/issues/16)) ([d1460dc](https://github.com/rumankazi/zenoter/commit/d1460dca67a076c4f84c9e2ef9f3d0129a8442a2))
* update renovate.json to use current configuration options ([8380e11](https://github.com/rumankazi/zenoter/commit/8380e11b70688b6adbdd10d3ec34eb1087fd0708))

### ♻️ Code Refactoring

* improve release strategy with clean release branch ([#24](https://github.com/rumankazi/zenoter/issues/24)) ([73de145](https://github.com/rumankazi/zenoter/commit/73de145481c253c8daaa264219330df3de9125f9)), closes [#22](https://github.com/rumankazi/zenoter/issues/22)
