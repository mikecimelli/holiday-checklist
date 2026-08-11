# Merge Plan for Feature Branches

This document outlines the recommended order for merging feature branches into `main`.

## Branches to Merge (in order)

### 1. ✅ better-destination-search
- **Commit**: 9b8af28
- **Status**: Ready to merge
- **Notes**: Improves destination search functionality. No conflicts expected.

### 2. ✅ fix-duplicate-template-icon  
- **Commit**: b382eaa
- **Status**: No code changes vs main
- **Notes**: Minimal/documentation changes. Safe to merge.

### 3. ✅ save-trip-as-template
- **Commit**: 3e763ce
- **Status**: Ready to merge first
- **Changes**: Adds `tripTypeIcon()` and `tripIcons()` functions (lines 846-868)
- **Notes**: Contains essential icon functionality. Merge this before update-app-icons.

### 4. ⚠️ update-app-icons
- **Commit**: d422507
- **Status**: Merge after save-trip-as-template
- **Changes**: Also adds `tripTypeIcon()` and `tripIcons()` functions
- **Notes**: **DUPLICATE FUNCTIONS** - Will conflict with save-trip-as-template. Resolution needed:
  - Compare implementations
  - Use the better version or merge both if they have different features
  - Only keep one implementation

### 5. ✅ remove-v2-file
- **Commit**: 677674e
- **Status**: Ready to merge last
- **Notes**: Cleanup task. Merge after all other features.

## Merge Strategy

- Use **squash merge** for cleaner history
- Or use **rebase merge** for preserving individual commits
- Avoid merge commits if possible (harder to revert)

## To Create PRs

Visit: https://github.com/mikecimelli/holiday-checklist/compare/{branch}
