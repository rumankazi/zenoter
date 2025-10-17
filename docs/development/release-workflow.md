# Release Workflow - Build Verification Strategy

## Overview

The release workflow has been updated to **verify build artifacts before creating a release**. This prevents incomplete or broken releases from being published.

## Workflow Structure

```
┌─────────────────────┐
│  1. Verify Build    │  (Windows)
│  - Build installers │
│  - Check artifacts  │
│  - Verify sizes     │
└──────────┬──────────┘
           │
           ├─── ❌ Build fails → Workflow stops, no release created
           │
           ├─── ✅ Build succeeds
           ↓
┌─────────────────────┐
│  2. Create Release  │  (Ubuntu)
│  - semantic-release │
│  - Changelog        │
│  - Git tag          │
└──────────┬──────────┘
           │
           ├─── No new release → Workflow stops
           │
           ├─── New release created
           ↓
┌─────────────────────┐
│  3. Upload Assets   │  (Ubuntu)
│  - Download builds  │
│  - Upload to GitHub │
│  - Update notes     │
└─────────────────────┘
```

## Job Details

### Job 1: `verify-build` (Windows)

**Purpose:** Build and verify installers BEFORE creating any release

**Steps:**

1. Checkout code
2. Install dependencies
3. Build application (`pnpm run build`)
4. Build installers (`pnpm run electron:build`)
5. Verify artifacts:
   - Check `.exe` exists
   - Check `.zip` exists
   - Verify sizes > 100MB (catches incomplete builds)
6. Upload artifacts for next job

**Duration:** ~3-5 minutes

**Outputs:**

- `can-build`: `true` if all checks pass, otherwise job fails

**Why Windows?** electron-builder needs Windows to create Windows installers.

### Job 2: `release` (Ubuntu)

**Purpose:** Create GitHub release with semantic-release

**Conditions:**

- Only runs if `verify-build` succeeded
- Skipped if `verify-build` fails

**Steps:**

1. Checkout code
2. Run semantic-release
3. Parse version information
4. Create GitHub release (if needed)

**Duration:** ~1-2 minutes

**Outputs:**

- `new-release-published`: `true` if new release created
- `new-release-version`: Version number (e.g., "1.0.0")

**Why Ubuntu?** Faster for Node.js tasks, doesn't need Windows.

### Job 3: `upload-installers` (Ubuntu)

**Purpose:** Attach installers to the GitHub release

**Conditions:**

- Only runs if `release` created a new release
- Uses artifacts from `verify-build` job

**Steps:**

1. Download build artifacts from Job 1
2. Upload to GitHub Release
3. Add installation instructions to release notes

**Duration:** ~1 minute

**Why Ubuntu?** Just uploading files, doesn't need Windows.

## Verification Checks

The `verify-build` job performs these checks:

```bash
✅ Check .exe file exists
✅ Check .zip file exists
✅ Verify .exe size > 100MB
✅ Verify .zip size > 100MB
✅ List all artifacts with sizes
```

If **any** check fails:

- Job fails immediately
- Workflow stops
- No release is created
- GitHub Actions shows clear error

## Benefits

### 1. Fail Fast

❌ **Before:** Build errors discovered after release created  
✅ **After:** Build verified before release created

### 2. No Incomplete Releases

❌ **Before:** Release created, then installer upload fails  
✅ **After:** Installers built and verified first

### 3. Size Validation

❌ **Before:** Broken build creates 1KB files  
✅ **After:** Size check catches incomplete builds

### 4. Clear Errors

❌ **Before:** "Release created but no assets"  
✅ **After:** "Build failed: no .exe found"

### 5. Artifact Reuse

❌ **Before:** Build twice (once for check, once for upload)  
✅ **After:** Build once, upload from artifacts

## Time Investment

**Total workflow time:** ~5-8 minutes

| Stage              | Duration | Purpose                       |
| ------------------ | -------- | ----------------------------- |
| Build verification | 3-5 min  | Ensure artifacts can be built |
| Create release     | 1-2 min  | semantic-release + changelog  |
| Upload assets      | 1 min    | Attach installers to release  |

**Trade-off:** Adds 3-5 minutes upfront to prevent wasted releases.

## Failure Scenarios

### Scenario 1: Build Fails

```
verify-build: ❌ FAILED (electron-builder error)
release:      ⏭️  SKIPPED
upload:       ⏭️  SKIPPED

Result: No release created, no broken artifacts
```

### Scenario 2: No Artifacts

```
verify-build: ❌ FAILED (no .exe found)
release:      ⏭️  SKIPPED
upload:       ⏭️  SKIPPED

Result: No release created, clear error message
```

### Scenario 3: Artifacts Too Small

```
verify-build: ❌ FAILED (.exe only 5MB, expected >100MB)
release:      ⏭️  SKIPPED
upload:       ⏭️  SKIPPED

Result: Incomplete build detected, no release
```

### Scenario 4: No New Release

```
verify-build: ✅ PASSED
release:      ✅ PASSED (no new release needed)
upload:       ⏭️  SKIPPED

Result: Commit doesn't trigger release (no feat:/fix:)
```

### Scenario 5: Success

```
verify-build: ✅ PASSED
release:      ✅ PASSED (v1.2.3 created)
upload:       ✅ PASSED (assets attached)

Result: Complete release with installers
```

## Workflow Triggers

```yaml
on:
  push:
    branches:
      - release
  workflow_dispatch: # Manual trigger
```

**When it runs:**

- Push to `release` branch
- Manual trigger from GitHub Actions UI

**When it doesn't run:**

- Push to `main`, `develop`, or feature branches
- Pull requests (to save CI time)

## PR Testing Strategy

Since building installers takes 3-5 minutes, we **don't** run this on PRs.

**Instead:**

- Regular CI runs unit tests (~30s)
- Regular CI runs E2E tests (~1min)
- Release workflow verifies full build only before release

**Reasoning:**

- PRs merged 10-20 times per day
- Releases created 1-3 times per week
- Saves 30-50 minutes of CI time per day

## Local Testing

You can verify the build locally before pushing to `release`:

```bash
# Full build test (same as CI)
rm -rf dist && pnpm run electron:build

# Verify artifacts
ls -lh dist/*.exe dist/*.zip

# Check sizes
du -sh dist/*.exe dist/*.zip
```

Expected output:

```
182M  Zenoter-Setup-0.1.0.exe
242M  Zenoter-Setup-0.1.0.zip
```

## Monitoring

### GitHub Actions Dashboard

**Success:**

```
✅ verify-build (3m 24s)
✅ release (1m 12s)
✅ upload-installers (45s)
```

**Build Failure:**

```
❌ verify-build (2m 10s) - ERROR: No .exe installer found
⏭️  release - Skipped
⏭️  upload-installers - Skipped
```

**No Release:**

```
✅ verify-build (3m 18s)
✅ release (1m 05s) - No release published
⏭️  upload-installers - Skipped
```

### Logs

Each job provides detailed logs:

**verify-build logs:**

```
🔍 Checking for build artifacts...
✅ Build artifacts verified:
-rwxr-xr-x  182M  Zenoter-Setup-0.1.0.exe
-rw-r--r--  242M  Zenoter-Setup-0.1.0.zip
✅ All artifacts verified successfully
```

**release logs:**

```
Published release 1.2.3
✅ New release published: v1.2.3
```

**upload-installers logs:**

```
📤 Uploading artifacts to release v1.2.3...
✅ Artifacts uploaded successfully
✅ Release notes updated
```

## Comparison: Before vs After

### Before (Old Workflow)

```
1. Create release (1-2 min)
2. Try to build installers (3-5 min)
3. Upload if successful

Problems:
- Release created even if build fails
- Broken releases published
- No size validation
- Confusing errors
```

### After (New Workflow)

```
1. Build and verify (3-5 min) ← FAIL FAST HERE
2. Create release only if build succeeded (1-2 min)
3. Upload pre-built artifacts (1 min)

Benefits:
- No broken releases
- Clear error messages
- Size validation
- Artifact reuse
```

## Configuration

Key workflow settings in `.github/workflows/release.yml`:

```yaml
verify-build:
  runs-on: windows-latest # Need Windows for electron-builder

release:
  needs: verify-build # Wait for build verification
  if: needs.verify-build.outputs.can-build == 'true' # Only run if build succeeded

upload-installers:
  needs: [verify-build, release] # Wait for both
  if: needs.release.outputs.new-release-published == 'true' # Only run if release created
```

## Future Improvements

Potential enhancements:

1. **Cache builds:** Speed up subsequent runs
2. **Parallel platforms:** Build Windows + macOS simultaneously
3. **Artifact signing:** Add code signing step
4. **Smoke tests:** Run basic E2E tests on built installers
5. **Version validation:** Ensure package.json version matches tag

## Questions & Answers

**Q: Why not build on PRs?**  
A: Too slow (3-5 min), wastes CI time, not needed for every commit

**Q: What if I want to test builds in PR?**  
A: Add `workflow_dispatch` trigger and run manually

**Q: Can I skip verification?**  
A: No, that defeats the purpose. Test locally first.

**Q: What if build passes locally but fails in CI?**  
A: Check Node.js version, pnpm version, dependencies differences

**Q: How do I debug build failures?**  
A: Check "verify-build" job logs in GitHub Actions

---

**Status:** Implemented and ready to use. Next push to `release` branch will use new workflow.
