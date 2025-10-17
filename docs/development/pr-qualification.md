# Pull Request Qualification Pipeline

This document describes the automated qualification pipeline that all Pull Requests must pass before merging to `main` or `develop` branches.

## Overview

Every PR automatically triggers a comprehensive qualification pipeline that ensures code quality, type safety, test coverage, and build integrity.

## Pipeline Jobs

### 1. 🎨 Code Quality

- **ESLint**: Checks for code quality and consistency
- **Prettier**: Verifies code formatting
- **Commitlint**: Ensures commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

### 2. 🔍 Type Check

- **TypeScript**: Validates type safety across the entire codebase
- Runs in strict mode (no `any` types allowed)

### 3. 🧪 Unit & Integration Tests

- Runs all tests with **Vitest**
- Enforces **minimum 80% code coverage**
- Uploads coverage reports to Codecov
- Must pass all existing tests

### 4. 🎭 E2E Tests

- Runs end-to-end tests with **Playwright**
- Tests user workflows and interactions
- Uploads test reports as artifacts (available for 7 days)

### 5. 🏗️ Build Verification

- Verifies the application builds successfully
- Ensures all build artifacts are generated correctly
- Catches build-time errors

### 6. 🔒 Security Audit

- Runs `pnpm audit` to check for security vulnerabilities
- Alerts on moderate+ severity issues
- Security vulnerabilities get labeled for urgent attention

### 7. ✅ PR Status Summary

- Aggregates results from all jobs
- Provides a single pass/fail status
- PR can only be merged if ALL checks pass

## Dependency Management with Renovate

### Automatic Dependency Updates

Renovate bot automatically:

- Monitors dependencies for updates
- Groups related packages together
- Creates PRs with semantic commit messages
- Auto-merges PRs that pass all qualification checks

### Grouping Strategy

Dependencies are intelligently grouped to minimize PR noise:

| Group              | Packages                            | Auto-merge       |
| ------------------ | ----------------------------------- | ---------------- |
| **All Non-Major**  | All minor/patch updates             | ✅ Yes           |
| **React**          | react, react-dom, @types/react      | ✅ Yes           |
| **TypeScript**     | typescript, @types/\*               | ✅ Yes           |
| **Testing**        | vitest, playwright, testing-library | ✅ Yes           |
| **ESLint**         | eslint, typescript-eslint           | ✅ Yes           |
| **Vite**           | vite, @vitejs/\*                    | ✅ Yes           |
| **Animations**     | framer-motion, lottie-react         | ✅ Yes           |
| **Emotion**        | @emotion/\*                         | ✅ Yes           |
| **Electron**       | electron, electron-builder          | ❌ Manual review |
| **Major Updates**  | Any major version bump              | ❌ Manual review |
| **Security**       | CVE fixes                           | ❌ Manual review |
| **Documentation**  | vitepress, typedoc                  | ✅ Yes           |
| **GitHub Actions** | All actions updates                 | ✅ Yes           |

### Renovate Configuration

**Schedule**: Weekends (to avoid disrupting weekday development)

**Auto-merge Criteria**:

- Minor/patch updates only
- DevDependencies
- All qualification checks pass
- 3-day stability period
- No failing tests

**Manual Review Required**:

- Major version updates
- Electron-related packages
- Security vulnerabilities
- Updates that fail qualification checks

### Renovate PR Lifecycle

1. **Detection**: Renovate scans for updates (weekends)
2. **Grouping**: Related packages grouped into single PR
3. **PR Creation**: Automated PR with detailed changelog
4. **Qualification**: Full pipeline runs automatically
5. **Auto-approval**: Renovate PRs auto-approved by bot
6. **Auto-merge**: Squash-merged if all checks pass
7. **Failure Handling**: Failed PRs require manual intervention

## Branch Protection Rules

To enforce the qualification pipeline, configure these branch protection rules:

### For `main` branch:

- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale reviews on new commits
- ✅ Require status checks to pass:
  - Code Quality
  - Type Check
  - Tests
  - E2E Tests
  - Build Verification
- ✅ Require branches to be up to date
- ✅ Require conversation resolution before merging
- ✅ Require signed commits (recommended)
- ✅ Include administrators
- ✅ Allow force pushes: No
- ✅ Allow deletions: No

## Creating a Pull Request

### 1. Create Feature Branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes Following Guidelines

- Write tests FIRST (TDD approach)
- Follow TypeScript strict mode
- Add smooth animations where applicable
- Update documentation
- Use conventional commit messages

### 3. Commit with Conventional Commits

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update API documentation"
git commit -m "test: add unit tests for service"
```

### 4. Push and Create PR

```bash
git push origin feat/your-feature-name
```

Then create PR on GitHub using the PR template.

### 5. Wait for Qualification Pipeline

- All checks run automatically
- Fix any failing checks
- Pipeline re-runs on each push

### 6. Review and Merge

- Get required approvals
- Ensure all checks pass
- Merge using **Squash and Merge** (preferred)

## Local Pre-flight Checks

Run these locally before pushing to catch issues early:

```bash
# Run all checks
pnpm lint              # ESLint
pnpm format:check      # Prettier
pnpm typecheck         # TypeScript
pnpm test              # Unit tests
pnpm test:coverage     # With coverage
pnpm test:e2e          # E2E tests
pnpm build             # Build verification

# Or use pre-commit hooks (already configured)
git commit -m "feat: your change"  # Runs lint-staged automatically
git push                            # Runs type check + tests
```

## Troubleshooting

### PR Check Failures

**Code Quality Failed**

```bash
pnpm lint:fix  # Auto-fix ESLint issues
pnpm format    # Auto-format with Prettier
```

**Type Check Failed**

```bash
pnpm typecheck  # See TypeScript errors
```

**Tests Failed**

```bash
pnpm test              # Run tests
pnpm test:coverage     # Check coverage
```

**E2E Tests Failed**

```bash
pnpm test:e2e          # Run locally
pnpm exec playwright show-report  # View last report
```

**Build Failed**

```bash
pnpm build  # Try building locally
```

### Renovate PRs Failing

1. Check the qualification pipeline logs
2. If legitimate failure, manually fix in renovate branch
3. If false positive, adjust Renovate config
4. For major updates, test locally first

## CI/CD Integration

### GitHub Actions Workflows

| Workflow               | Trigger        | Purpose                      |
| ---------------------- | -------------- | ---------------------------- |
| `pr-qualification.yml` | PR open/update | Run all qualification checks |
| `renovate-approve.yml` | Renovate PR    | Auto-approve Renovate PRs    |
| `docs.yml`             | Push to main   | Deploy documentation         |

### Required Secrets

- `GITHUB_TOKEN` - Automatically provided
- `CODECOV_TOKEN` - For coverage reports (optional)

## Best Practices

✅ **DO**:

- Write tests before implementation (TDD)
- Keep PRs small and focused
- Update documentation with code changes
- Use feature flags for new features
- Add animations to UI components
- Follow the PR template completely
- Respond to review comments promptly

❌ **DON'T**:

- Skip writing tests
- Use `any` in TypeScript
- Ignore accessibility
- Add cloud features in Phase 1
- Force push to PR branches after review
- Merge without all checks passing
- Bypass the qualification pipeline

## Phase-Specific Guidelines

### Phase 1 (Current - MVP)

- Focus on local features only
- No cloud infrastructure
- Basic editor + file tree
- Smooth animations required

### Phase 2+ (Future)

- Cloud sync features (behind feature flags)
- Authentication system
- Version control
- Requires additional qualification checks

## Support

For questions or issues with the qualification pipeline:

1. Check this documentation
2. Review GitHub Actions logs
3. Consult project maintainers
4. Open an issue with `ci/cd` label

---

**Remember**: The qualification pipeline exists to maintain code quality and prevent bugs from reaching production. All checks are there for a reason! 🚀
