# Release Process

This document describes the automated release workflow for Zenoter using semantic versioning and semantic-release.

## 📋 Table of Contents

- [Overview](#overview)
- [Release Types](#release-types)
- [Automated Releases](#automated-releases)
- [Manual Major Releases](#manual-major-releases)
- [Commit Convention](#commit-convention)
- [PR Labels](#pr-labels)
- [Release Artifacts](#release-artifacts)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Zenoter uses **semantic-release** for automated version management and releases. Every merge to `main` can trigger a release based on conventional commit messages.

### Key Principles

- ✅ **Automated** - Releases happen automatically on merge to main
- ✅ **Semantic Versioning** - Follows semver (MAJOR.MINOR.PATCH)
- ✅ **Conventional Commits** - Commit messages determine release type
- ✅ **Selective Artifacts** - Only major releases include installers
- ✅ **CHANGELOG** - Automatically generated and maintained

## 📦 Release Types

| Type           | Version Bump | Example       | Trigger                  | Artifacts                          |
| -------------- | ------------ | ------------- | ------------------------ | ---------------------------------- |
| **Major**      | X.0.0        | 0.1.0 → 1.0.0 | Breaking change or label | GitHub Release + Windows Installer |
| **Minor**      | x.Y.0        | 0.1.0 → 0.2.0 | New feature              | GitHub Release only                |
| **Patch**      | x.y.Z        | 0.1.0 → 0.1.1 | Bug fix                  | GitHub Release only                |
| **No Release** | -            | -             | Chore, docs, style       | Nothing                            |

## 🤖 Automated Releases

### How It Works

1. **Merge PR to main**
2. **GitHub Actions triggered**
3. **semantic-release analyzes commits**
4. **Determines version bump** (if needed)
5. **Creates release** (tag, GitHub Release, CHANGELOG)
6. **Builds installers** (for major releases only)

### What Gets Released

**Minor/Patch Releases:**

- ✅ Git tag (e.g., `v0.2.0`)
- ✅ GitHub Release with notes
- ✅ Updated CHANGELOG.md
- ❌ No installers

**Major Releases:**

- ✅ Everything above, PLUS:
- ✅ Windows installer (.exe)
- ✅ Windows portable (.zip)
- ✅ Installation instructions
- ✅ System requirements

## 🛠️ Manual Major Releases

For on-demand major releases (e.g., v1.0.0, v2.0.0):

### Using GitHub UI

1. Go to **Actions** tab
2. Click **"Create Major Release"** workflow
3. Click **"Run workflow"**
4. Fill in:
   - **Version**: `1.0.0` (must be greater than current)
   - **Release notes**: Optional breaking changes description
5. Click **"Run workflow"**

### What Happens

1. ✅ Validates version format
2. ✅ Updates package.json
3. ✅ Generates CHANGELOG
4. ✅ Creates git tag
5. ✅ Creates GitHub Release
6. ✅ Builds Windows installer
7. ✅ Uploads installer to release

## 📝 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

### Format

```
<type>[(optional scope)][!]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type        | Description             | Release Type | Example                                 |
| ----------- | ----------------------- | ------------ | --------------------------------------- |
| `feat:`     | New feature             | Minor        | `feat: add search functionality`        |
| `fix:`      | Bug fix                 | Patch        | `fix: resolve FileTree rendering issue` |
| `perf:`     | Performance improvement | Patch        | `perf: optimize editor load time`       |
| `feat!:`    | Breaking change         | Major        | `feat!: redesign API`                   |
| `docs:`     | Documentation only      | None         | `docs: update README`                   |
| `style:`    | Code style/formatting   | None         | `style: format with prettier`           |
| `refactor:` | Code refactoring        | None         | `refactor: simplify FileTree logic`     |
| `test:`     | Tests only              | None         | `test: add FileTree tests`              |
| `chore:`    | Maintenance             | None         | `chore: update dependencies`            |
| `ci:`       | CI/CD changes           | None         | `ci: update workflow`                   |

### Breaking Changes

**Method 1: Using `!` suffix**

```bash
git commit -m "feat!: redesign editor initialization API"
```

**Method 2: Using footer**

```bash
git commit -m "feat: redesign editor API

BREAKING CHANGE: Editor now requires config object for initialization"
```

### Examples

**Feature (Minor Release)**

```bash
git commit -m "feat: add Monaco editor integration"
# Results in: 0.1.0 → 0.2.0
```

**Bug Fix (Patch Release)**

```bash
git commit -m "fix: resolve sidebar collapse animation"
# Results in: 0.1.0 → 0.1.1
```

**Breaking Change (Major Release)**

```bash
git commit -m "feat!: change storage format

BREAKING CHANGE: Notes are now stored in SQLite database.
Migration script required for existing users."
# Results in: 0.1.0 → 1.0.0
```

**No Release**

```bash
git commit -m "docs: update installation guide"
# No release created
```

## 🏷️ PR Labels

Override version bumping using PR labels:

### Available Labels

| Label          | Effect              | Use Case                              |
| -------------- | ------------------- | ------------------------------------- |
| `semver-major` | Force major release | Critical updates that should be major |
| `semver-minor` | Force minor release | Group fixes as feature release        |
| `release-skip` | Skip release        | No release even with feat/fix commits |

### How to Use

1. **Create or open PR**
2. **Add label** from the right sidebar
3. **Merge PR**
4. **Release created** based on label

### Example Workflow

```
PR Title: "feat: add multiple features"
Commits:
  - feat: add feature A
  - feat: add feature B
  - fix: minor bug

Label: semver-major
Result: Creates major release (e.g., 0.1.0 → 1.0.0) with installers
```

### PR Title Convention

If your PR title follows conventional commits format, it will be respected:

```
PR Title: "feat!: redesign editor API"
Result: Major release (even without label)
```

## 📦 Release Artifacts

### Minor/Patch Releases (Automated)

**What's Created:**

- GitHub Release page
- Git tag (e.g., `v0.2.0`)
- Release notes from commits
- Updated CHANGELOG.md

**Example Release Notes:**

```markdown
## [0.2.0] - 2025-10-17

### 🎉 Features

- Add Monaco editor integration (#23)
- Add file tree animations (#24)

### 🐛 Bug Fixes

- Fix FileTree rendering issue (#25)

### Contributors

@rumankazi
```

### Major Releases (v1.0.0+)

**What's Created:**

- Everything from minor/patch, PLUS:
- `Zenoter-Setup-X.Y.Z.exe` (Windows installer, ~80MB)
- `Zenoter-X.Y.Z-win.zip` (Portable version, ~100MB)
- Installation instructions
- System requirements

**Example Release Notes:**

```markdown
## 💥 v1.0.0 - Major Release

### 💥 Breaking Changes

- Redesigned storage format (migration required)
- Changed editor initialization API

### 🎉 Features

- Full Monaco editor integration
- Advanced file tree with animations
- Dark/light theme support

### 📦 Installation

#### Windows Installer

1. Download `Zenoter-Setup-1.0.0.exe`
2. Run the installer
3. Follow installation wizard

#### Portable Version

1. Download `Zenoter-1.0.0-win.zip`
2. Extract to preferred location
3. Run `Zenoter.exe`

### System Requirements

- Windows 10/11 (64-bit)
- 4GB RAM minimum
- 500MB free disk space
```

## 🔍 Troubleshooting

### Release Not Created

**Check:**

1. ✅ Are there `feat:` or `fix:` commits?
2. ✅ Did semantic-release run successfully?
3. ✅ Check Actions tab for workflow logs
4. ✅ Is `GITHUB_TOKEN` configured?

**Common Issues:**

- Only `chore:` or `docs:` commits → No release (expected)
- Commit message format incorrect → Not recognized
- Previous release failed → May need manual intervention

### Wrong Version Bump

**Check:**

1. ✅ Commit message format
2. ✅ Breaking change syntax (`!` or `BREAKING CHANGE:`)
3. ✅ PR labels applied

**Fix:**

- If wrong version released, create new PR with correct commit type
- For major version, use manual workflow instead

### Installer Not Built

**Check:**

1. ✅ Is it a major release (v1.0.0+)?
2. ✅ Check build-installers job in Actions
3. ✅ Windows runner availability
4. ✅ Build artifacts in dist/ folder

**Note:** Only major releases include installers by design.

### semantic-release Fails

**Check:**

1. ✅ GITHUB_TOKEN permissions
2. ✅ No uncommitted changes
3. ✅ Not a merge conflict
4. ✅ Dependencies installed correctly

**Manual Recovery:**

```bash
# 1. Fix the issue locally
# 2. Create new commit with fix
# 3. Push to main
# 4. semantic-release will run again
```

## 📊 Release History

View all releases:

- **GitHub**: [Releases Page](https://github.com/rumankazi/zenoter/releases)
- **Local**: `CHANGELOG.md`
- **Tags**: `git tag -l`

### Example CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2025-10-17

### 💥 Breaking Changes

- Redesigned storage format

### 🎉 Features

- Add Monaco editor
- Add file tree

## [0.2.0] - 2025-10-10

### 🎉 Features

- Add search functionality

## [0.1.0] - 2025-10-01

### 🎉 Features

- Initial MVP release
```

## 🎯 Best Practices

### DO ✅

- Use conventional commit format
- Write clear, descriptive commit messages
- Group related changes in single PR
- Add PR labels when needed
- Test locally before merging
- Review CHANGELOG after release

### DON'T ❌

- Mix breaking changes with features (separate PRs)
- Use vague commit messages
- Skip commit message format
- Force push to main after tag created
- Manually edit version in package.json (handled automatically)
- Delete release tags

## 🚀 Quick Reference

### Trigger Minor Release

```bash
git commit -m "feat: add new feature"
git push origin feature-branch
# Create PR → Merge to main → v0.1.0 → v0.2.0
```

### Trigger Patch Release

```bash
git commit -m "fix: resolve bug"
git push origin bugfix-branch
# Create PR → Merge to main → v0.1.0 → v0.1.1
```

### Trigger Major Release (Automatic)

```bash
git commit -m "feat!: breaking API change

BREAKING CHANGE: Redesigned editor API"
git push origin feature-branch
# Create PR → Merge to main → v0.1.0 → v1.0.0 + installers
```

### Trigger Major Release (Manual)

```
GitHub → Actions → "Create Major Release" → Run workflow
Input: version=1.0.0
Result: v1.0.0 + installers
```

### Force Major via PR Label

```
Create PR → Add label "semver-major" → Merge
Result: Major release with installers
```

## 📞 Support

For issues with the release process:

1. Check workflow logs in Actions tab
2. Review this documentation
3. Check `CHANGELOG.md` for history
4. Open issue with `ci/cd` label

---

**Last Updated**: 2025-10-17
**Version**: 1.0
