# Smart Qualification Workflow

**Last Updated**: 2025-10-19

## Overview

The qualification workflow intelligently runs only the necessary checks based on the files changed in a PR. This saves CI/CD time and resources while maintaining code quality standards.

## How It Works

### 1. Change Detection

The `detect-changes` job analyzes which files changed and categorizes them:

| Category         | File Patterns                           | Example Files                   |
| ---------------- | --------------------------------------- | ------------------------------- |
| **code**         | `src/**/*.{ts,tsx}`, `electron/**/*.ts` | App components, services, hooks |
| **tests**        | `src/test/**/*.{test,spec}.{ts,tsx}`    | Unit tests, integration tests   |
| **e2e**          | `src/test/e2e/**/*.e2e.{ts,tsx}`        | Playwright E2E tests            |
| **docs**         | `docs/**`, `*.md`                       | Documentation files             |
| **config**       | `*.config.{js,ts}`, `tsconfig*.json`    | Build configs, linting configs  |
| **workflows**    | `.github/workflows/**`                  | GitHub Actions workflows        |
| **dependencies** | `package.json`, `pnpm-lock.yaml`        | npm dependencies                |

### 2. Conditional Job Execution

Each qualification job runs only when relevant files change:

#### Code Quality

**Runs when:**

- ✅ Source code changes (`code`)
- ✅ Test file changes (`tests`)
- ✅ Config changes (`config`)
- ✅ Workflow changes (`workflows`)

**Skips when:**

- ⏭️ Only documentation changes

**Why:** Linting and formatting rules apply to code and tests, but not pure docs.

---

#### Type Check

**Runs when:**

- ✅ Source code changes (`code`)
- ✅ Test file changes (`tests`)
- ✅ E2E test changes (`e2e`)
- ✅ Config changes (TypeScript configs)

**Skips when:**

- ⏭️ Only documentation changes
- ⏭️ Only workflow changes (unless TypeScript configs modified)

**Why:** TypeScript compilation needed for any `.ts`/`.tsx` files.

---

#### Unit Tests

**Runs when:**

- ✅ Source code changes (`code`)
- ✅ Test file changes (`tests`)
- ✅ Dependency changes (`dependencies`)

**Skips when:**

- ⏭️ Only documentation changes
- ⏭️ Only workflow changes

**Why:** Tests verify code behavior. Dependency changes could affect test outcomes.

---

#### E2E Tests

**Runs when:**

- ✅ Source code changes (`code`)
- ✅ E2E test changes (`e2e`)
- ✅ Dependency changes (`dependencies`)

**Skips when:**

- ⏭️ Only documentation changes
- ⏭️ Only unit test changes
- ⏭️ Only workflow changes

**Why:** E2E tests are expensive (~30s). Skip when only docs or workflows change.

---

#### Build Verification

**Runs when:**

- ✅ Source code changes (`code`)
- ✅ Config changes (`config`)
- ✅ Dependency changes (`dependencies`)

**Skips when:**

- ⏭️ Only documentation changes
- ⏭️ Only test file changes (if no code changes)

**Why:** Build artifacts only affected by source code, configs, or dependencies.

---

#### Security Audit

**Runs when:**

- ✅ Dependency changes (`dependencies`)
- ✅ Scheduled runs (daily)

**Skips when:**

- ⏭️ Only code changes (dependencies unchanged)
- ⏭️ Only documentation changes

**Why:** Security audit only relevant when dependencies change. Run daily to catch new CVEs.

---

### 3. Status Summary (Required Check)

The `status-summary` job **always runs** and serves as the single required check for PR merges.

**Key Logic:**

- ✅ **Passed**: Job succeeded
- ⏭️ **Skipped**: Job skipped (treated as success)
- ❌ **Failed**: Job failed (blocks PR merge)

**Status Summary passes if:**

- All executed jobs succeeded **OR**
- All executed jobs succeeded or were skipped

**Status Summary fails if:**

- Any job explicitly failed (not skipped)

## Examples

### Example 1: Documentation-Only PR

**Changed Files:**

```
docs/guide/getting-started.md
README.md
```

**Jobs Run:**

- ✅ `detect-changes` (always runs)
- ⏭️ `code-quality` (skipped)
- ⏭️ `type-check` (skipped)
- ⏭️ `test` (skipped)
- ⏭️ `e2e-tests` (skipped)
- ⏭️ `build` (skipped)
- ⏭️ `security` (skipped)
- ✅ `status-summary` (always runs, passes because no failures)

**Result:** PR can merge in ~30 seconds (no expensive tests)

---

### Example 2: Feature Implementation PR

**Changed Files:**

```
src/components/NewFeature/NewFeature.tsx
src/components/NewFeature/NewFeature.module.css
src/test/components/NewFeature/NewFeature.test.tsx
src/test/e2e/new-feature.e2e.ts
```

**Jobs Run:**

- ✅ `detect-changes` (detects: code, tests, e2e)
- ✅ `code-quality` (code + tests changed)
- ✅ `type-check` (code + tests changed)
- ✅ `test` (code + tests changed)
- ✅ `e2e-tests` (code + e2e changed)
- ✅ `build` (code changed)
- ⏭️ `security` (dependencies unchanged)
- ✅ `status-summary` (all jobs must pass)

**Result:** Full qualification suite runs (~3-4 minutes)

---

### Example 3: Dependency Update PR

**Changed Files:**

```
package.json
pnpm-lock.yaml
```

**Jobs Run:**

- ✅ `detect-changes` (detects: dependencies)
- ⏭️ `code-quality` (no code changes)
- ⏭️ `type-check` (no TypeScript changes)
- ✅ `test` (dependencies changed)
- ✅ `e2e-tests` (dependencies changed)
- ✅ `build` (dependencies changed)
- ✅ `security` (dependencies changed - **important!**)
- ✅ `status-summary` (executed jobs must pass)

**Result:** Tests + security audit run (~2-3 minutes)

---

### Example 4: Workflow Update PR

**Changed Files:**

```
.github/workflows/pr-metadata.yml
```

**Jobs Run:**

- ✅ `detect-changes` (detects: workflows)
- ✅ `code-quality` (workflow syntax validation)
- ⏭️ `type-check` (no TypeScript changes)
- ⏭️ `test` (no code changes)
- ⏭️ `e2e-tests` (no code changes)
- ⏭️ `build` (no build changes)
- ⏭️ `security` (no dependencies changed)
- ✅ `status-summary` (passes if code-quality passes)

**Result:** Quick validation (~1 minute)

---

## Branch Protection Setup

To use this workflow as your required check:

### GitHub Repository Settings

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rule for `main` branch
3. Enable: **Require status checks to pass before merging**
4. Search and select: **Status Summary** (only this one!)
5. Enable: **Require branches to be up to date before merging** (optional)
6. Save changes

### Why Only "Status Summary"?

- ✅ Single required check simplifies branch protection
- ✅ Automatically handles skipped jobs (treated as success)
- ✅ Fails only when jobs explicitly fail
- ✅ Works with conditional job execution
- ✅ No need to update branch protection when adding/removing jobs

### ❌ Don't Require Individual Jobs

**Bad approach:**

```
Required checks:
- Code Quality ❌ (fails if skipped)
- Type Check ❌ (fails if skipped)
- Tests ❌ (fails if skipped)
- E2E Tests ❌ (fails if skipped)
- Build ❌ (fails if skipped)
```

**Good approach:**

```
Required checks:
- Status Summary ✅ (handles all logic)
```

---

## Benefits

### 1. **Faster CI/CD Times**

- Documentation PRs: ~30 seconds (vs ~4 minutes)
- Workflow updates: ~1 minute (vs ~4 minutes)
- Code changes: Full suite still runs

### 2. **Cost Savings**

- Fewer CI/CD minutes consumed
- Reduced GitHub Actions usage
- Lower infrastructure costs

### 3. **Better Developer Experience**

- Faster feedback on doc-only changes
- Clear indication of what's being tested
- Reduced wait times for simple PRs

### 4. **Maintained Quality**

- All relevant checks still run for code changes
- No compromise on testing coverage
- Security audits on dependency changes

---

## Maintenance

### Adding New Jobs

1. Add the job to `qualification.yml`
2. Add conditional logic based on `detect-changes` outputs
3. Add the job to `needs` array in `status-summary`
4. Update the failure check in `status-summary`

**Example:**

```yaml
new-job:
  name: New Check
  runs-on: ubuntu-latest
  needs: detect-changes
  if: |
    needs.detect-changes.outputs.code == 'true' ||
    github.event_name == 'schedule'
  steps:
    # ... job steps
```

### Adding New File Categories

1. Update the `filters` section in `detect-changes`
2. Add new output to job outputs
3. Reference in conditional `if` statements

**Example:**

```yaml
filters: |
  styles:
    - 'src/**/*.css'
    - 'src/**/*.module.css'
```

---

## Troubleshooting

### Issue: Job always skips when it should run

**Solution:** Check the `if` condition includes the relevant file category:

```yaml
if: |
  needs.detect-changes.outputs.code == 'true' ||
  needs.detect-changes.outputs.YOUR_CATEGORY == 'true'
```

### Issue: Status Summary fails on docs-only PR

**Solution:** Verify the failure check only fails on `failure` result, not `skipped`:

```yaml
if [[ "${{ needs.job-name.result }}" == "failure" ]]; then
exit 1
fi
```

### Issue: Job runs on every PR

**Solution:** Ensure the job has a conditional `if` statement. Jobs without `if` always run.

---

## Schedule & Manual Runs

### Scheduled Runs (Daily)

The workflow runs daily at 03:00 UTC with **all jobs enabled**:

```yaml
on:
  schedule:
    - cron: '0 3 * * *'
```

**Purpose:** Catch issues from external factors (new CVEs, dependency issues, etc.)

### Manual Runs

Trigger via GitHub Actions UI with **all jobs enabled**:

```yaml
on:
  workflow_dispatch:
```

**Use cases:**

- Test qualification before pushing
- Verify all checks after infrastructure changes
- Debug workflow issues

---

## Performance Metrics

### Before Smart Qualification

| PR Type           | Average Time |
| ----------------- | ------------ |
| Documentation     | ~4 minutes   |
| Workflow update   | ~4 minutes   |
| Feature (code)    | ~4 minutes   |
| Dependency update | ~4 minutes   |

**Total CI time per week:** ~40 minutes (10 PRs × 4 min)

### After Smart Qualification

| PR Type           | Average Time | Frequency  |
| ----------------- | ------------ | ---------- |
| Documentation     | ~30 seconds  | 30% of PRs |
| Workflow update   | ~1 minute    | 10% of PRs |
| Feature (code)    | ~4 minutes   | 50% of PRs |
| Dependency update | ~3 minutes   | 10% of PRs |

**Total CI time per week:** ~16 minutes (60% reduction!)

---

## Best Practices

1. **Keep file patterns specific** - Avoid overly broad patterns that trigger unnecessary jobs
2. **Test workflow changes** - Use `workflow_dispatch` to verify changes before merging
3. **Monitor skip rates** - Ensure jobs aren't being skipped too aggressively
4. **Update documentation** - Keep this doc updated when changing job logic
5. **Review periodically** - Reassess patterns as codebase structure changes

---

## Related Documentation

- [Qualification Workflow](../pr-qualification.md)
- [CI/CD Overview](../release-workflow.md)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/best-practices-for-workflows)
