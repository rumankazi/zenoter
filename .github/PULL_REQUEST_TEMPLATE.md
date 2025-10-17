# ⚠️ CRITICAL: Avoid Accidental Major Releases!

**DO NOT use `BREAKING CHANGE:` in your PR unless you intend a major release (v1.0.0, v2.0.0, etc.)**

❌ **WRONG** (triggers major):

```
BREAKING CHANGE: none
BREAKING CHANGE: N/A
```

✅ **CORRECT** (no release keyword):

```
Just describe changes normally
```

---

## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (patch: v0.1.0 → v0.1.1)
- [ ] ✨ New feature (minor: v0.1.0 → v0.2.0)
- [ ] 💥 Breaking change (major: v0.1.0 → v1.0.0) - **RARE!**
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update (changes that don't affect code logic)
- [ ] ♻️ Refactoring (code restructuring without changing functionality)
- [ ] ⚡️ Performance improvement
- [ ] ✅ Test updates
- [ ] 🔧 Configuration/build changes
- [ ] 📦 Dependency updates

## Related Issues

<!-- Link to related issues using #issue_number -->

Closes #

## Changes Made

<!-- List the main changes made in this PR -->

-
-
-

## Testing

<!-- Describe the testing you've done -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed
- [ ] All tests pass locally

## Screenshots/Videos

<!-- If applicable, add screenshots or videos to help explain your changes -->

## Checklist

<!-- Ensure all items are checked before requesting review -->

- [ ] My code follows the project's code style guidelines

## Phase Compliance

<!-- Mark the current phase -->

- [ ] Phase 1 - MVP (Local only, no cloud features)
- [ ] Phase 2+ - Cloud features (requires feature flag)

## Release Versioning

- [ ] I understand how conventional commits affect versioning
- [ ] I have NOT accidentally used `BREAKING CHANGE:` keyword

## Additional Notes

<!-- Add any additional notes for reviewers -->

---
