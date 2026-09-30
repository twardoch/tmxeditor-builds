---
this_file: CHANGELOG.md
---
# Changelog

## 2026-09-30

- Add the GitHub Pages download website with release-driven regeneration of `docs/`.
- Share installation, editing and update instructions between README and website.
- Add stable-version selection tests and an explicit branch-based Pages build request.
- Add daily upstream release checks and manual version/revision selection.
- Build macOS arm64/x64 DMGs and a Windows x64 NSIS installer on native runners.
- Gate publication on packaged-runtime TMX round-trip checks across all platforms.
- Attach corresponding source, license, provenance and checksums to each release.
- Resolve the exact Electron version from the separate upstream application.
- Publish and verify v4.1.0-build.1 on all three platforms; verify repeat-run skipping.
- Add CI tests for release selection, incomplete builds and checksum generation.
