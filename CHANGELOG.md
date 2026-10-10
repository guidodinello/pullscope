# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Vitest test suite with validation tests (#6).

### Changed

- Upgraded WXT to 0.21, unblocking the vite/svelte/vitest security fixes (#16).
- Added a minimal storage utility and moved debouncing into its own utility (#6).
- CI workflow now runs with least-privilege permissions (#9).

### Fixed

- Filter store initialization no longer registers multiple storage listeners or
  ends up in an inconsistent state when `init()` runs more than once (#6).
- Message broadcasting handles promise rejections per tab, so a closed tab or a
  content script that isn't ready no longer causes unhandled rejections (#6).
- A failure while mounting the content script now shows an error message
  instead of failing silently (#6).
- Fixed a memory leak from a debounced function created on every init, the
  checkbox not showing its checkmark when checked, and the filter editor not
  updating when switching between filters (#6).

### Security

- Pinned transitive dependencies to patched versions and bumped build/test
  tooling to close Dependabot vulnerability alerts (#10, #11, #15, #17, #18).
  All of it is dev tooling; nothing here ships in the built extension.

## [0.1.0] - 2025-12-16

### Added

- More default filters for better GitHub PR filtering.
- Flatpak Chrome script support for Linux users.
- GitHub funding configuration with Buy Me a Coffee support.

### Changed

- Overrode GitHub's bottom margin on `p` tags in the filter UI for consistency.

### Fixed

- GitHub SPA navigation is now detected using Turbo events.
- `REPO_PAGE_PATTERN` is more generic, supporting more repository URL patterns.

## [0.0.2] - 2025-11-18

### Added

- MIT License.

### Changed

- Safer filter defaults: `DEFAULT_FILTERS` now only includes GitHub's default
  filters (#3).
- Code style and formatting improvements (#1, #2).

### Fixed

- The extension now works when navigating from a repository page to the PRs tab
  through GitHub's internal navigation. The content script's URL match was too
  restrictive (only PR pages) (#4).

## [0.0.1] - 2025-11-16

### Added

- First public release.
- Automatic filter application on any GitHub PR page.
- Real-time sync: toggling a filter updates every open tab immediately.
- Custom filter management using GitHub's search syntax.
- Chrome/Chromium (Manifest V3) and Firefox (Manifest V2) builds.

[Unreleased]: https://github.com/guidodinello/pullscope/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/guidodinello/pullscope/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/guidodinello/pullscope/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/guidodinello/pullscope/releases/tag/v0.0.1
