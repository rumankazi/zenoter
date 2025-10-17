# Release Strategy - Zenoter

**Last Updated**: 2025-10-17  
**Status**: ✅ Production Ready

## ��� Overview

Zenoter uses **semantic-release** with a **dedicated release branch** to enable full branch protection on `main` while automating releases.

### Key Features

- ✅ **Full main protection** - Requires PR, reviews, status checks - NO EXCEPTIONS
- ✅ **Clean separation** - Code in `main`, version commits in `release`
- ✅ **Automatic releases** - Triggered by conventional commits
- ✅ **Auto-generated notes** - GitHub CLI generates release notes
- ✅ **Simple & clean** - 2 workflows, easy to understand
- ✅ **Industry standard** - Same pattern used by React, Babel, etc.

## ��� Branch Strategy

### Structure

```
main (FULLY PROTECTED)
  ├── Requires PR + reviews
  ├── Requires all status checks
  ├── No direct pushes (even with token)
  └── Source of truth for code

release (UNPROTECTED - automation only)
  ├── Auto-synced from main
  ├── semantic-release runs here
  ├── Version commits stay here
  └── Never manually edited
```

### Why Release Branch?

| Aspect              | Main Branch Release     | Release Branch ✅                       |
| ------------------- | ----------------------- | --------------------------------------- |
| **Main protection** | Must exempt bot         | Fully protected                         |
| **Security**        | Token bypasses checks   | Token only writes to unprotected branch |
| **History**         | Version commits in main | Clean main, versions isolated           |
| **Best practice**   | Non-standard            | Industry standard                       |

## ��� Release Types

| Type      | Version Change | Trigger                        | Artifacts           |
| --------- | -------------- | ------------------------------ | ------------------- |
| **Major** | 0.1.0 → 1.0.0  | `feat!:` or `BREAKING CHANGE:` | Release + Installer |
| **Minor** | 0.1.0 → 0.2.0  | `feat:`                        | Release only        |
| **Patch** | 0.1.0 → 0.1.1  | `fix:`                         | Release only        |

## ��� How It Works

1. Merge PR to `main` → triggers sync workflow
2. Sync copies `main` to `release` branch
3. Push to `release` → triggers release workflow
4. semantic-release creates tag and GitHub Release
5. If major: Builds Windows installer

⚠️ **Warning**: Even `BREAKING CHANGE: none` triggers a major release!

## ��� Setup

### Branch Protection

**`main` branch** - FULLY PROTECTED:

- ✅ Require PR + reviews
- ✅ Require status checks
- ✅ No bypassing

**`release` branch** - UNPROTECTED:

- ❌ No protection (automation only)

### Required Secret

- `RELEASE_TOKEN`: Personal access token with `repo` scope

---

**Summary**: Release branch keeps `main` fully protected while enabling automated releases.
