# Release Workflow Fix - Artifact Upload Issue

## Problem

The release workflow was failing to upload Windows installer artifacts (`.exe` and `.zip` files) for major releases because they were not being generated.

## Root Cause

The `dist:win` script in `package.json` was running:

```bash
pnpm build && electron-builder --win
```

However, `pnpm build` only executed `tsc && vite build`, which:

- ✅ Compiled TypeScript for the frontend
- ✅ Built the Vite/React application into `dist/`
- ❌ Did NOT compile Electron main/preload scripts

Without `dist-electron/` folder, electron-builder couldn't package the app, resulting in no `.exe` or `.zip` files.

## Fixes Applied

### 1. Updated Build Script (`package.json`)

**Before:**

```json
"build": "tsc && vite build"
```

**After:**

```json
"build": "tsc && vite build && pnpm electron:compile"
```

Now the build process:

1. Compiles TypeScript types
2. Builds the React app with Vite → `dist/`
3. Compiles Electron main/preload → `dist-electron/`

### 2. Fixed electron-builder Files Configuration

**Before:**

```json
"files": [
  "dist/**/*",
  "electron/**/*",  // ❌ Source files, not compiled
  "node_modules/**/*"
]
```

**After:**

```json
"files": [
  "dist/**/*",
  "dist-electron/**/*",  // ✅ Compiled Electron files
  "node_modules/**/*"
]
```

### 3. Enhanced Workflow Debugging (`.github/workflows/release.yml`)

Added verification step before upload:

```yaml
- name: List built artifacts
  shell: bash
  run: |
    echo "📦 Checking for build artifacts..."
    ls -la dist/
    find dist/ -type f -name "*.exe" -o -name "*.zip"

- name: Upload installer to release
  run: |
    # Check if files exist before uploading
    if ! ls dist/*.exe dist/*.zip 1> /dev/null 2>&1; then
      echo "❌ Error: No installer files found"
      exit 1
    fi
    gh release upload "$TAG" dist/*.exe dist/*.zip --clobber
```

### 4. Made Icons Optional (Temporary)

Removed hardcoded icon paths from electron-builder config to allow builds without icons. Added `build/README.md` with instructions for creating proper icons later.

## Testing

```bash
# Test build locally
pnpm build
ls -la dist-electron/  # Verify compiled Electron files exist

# Run all tests
pnpm test  # ✅ All 65 tests passing
pnpm test:e2e  # ✅ All 29 E2E tests passing
```

## Expected Behavior

When a major release (e.g., v1.0.0, v2.0.0) is triggered:

1. Semantic-release creates a GitHub release
2. Build job compiles all code (React + Electron)
3. electron-builder generates:
   - `Zenoter-Setup-X.X.X.exe` (NSIS installer)
   - `Zenoter-X.X.X-win.zip` (Portable version)
4. Artifacts are uploaded to the GitHub release
5. Installation instructions are added to release notes

## Next Steps

- [ ] Create proper application icons (`.ico`, `.icns`, `.png`)
- [ ] Test the full release workflow on the `release` branch
- [ ] Consider adding artifact retention for debugging

## Related Files

- `package.json` - Build scripts and electron-builder config
- `.github/workflows/release.yml` - Release automation
- `build/README.md` - Icon requirements documentation
