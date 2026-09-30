---
this_file: WORK.md
---
# Work

## Website — verification in progress

Implemented a static download site generated from published release assets and
the README usage section. Local tests (7), actionlint and desktop/mobile browser
checks pass. The 390px mobile layout has no horizontal overflow; navigation to
the usage guide works. Hosted workflow and Pages verification are next.

## 2026-09-30 — completed

Created the public repository and published
[v4.1.0-build.1](https://github.com/twardoch/tmxeditor-builds/releases/tag/v4.1.0-build.1).

- [Hosted build](https://github.com/twardoch/tmxeditor-builds/actions/runs/36747800493):
  Windows x64, macOS arm64 and macOS x64 all passed native packaging and
  packaged-Electron TMX import, language, Unicode, save and reopen checks.
- Both Mac runners passed strict code-signature verification and DMG checks.
- Downloaded the hosted arm64 DMG, mounted it read-only, verified its signature
  and reran the TMX smoke test from the mounted application: passed.
- Downloaded all nine release assets; all eight SHA-256 entries matched.
- All 561 files in the released source archive matched upstream tag v4.1.0
  (commit `88490b387f10d0141f29c8af807e871a79fe217d`) byte for byte.
- [Second dispatch](https://github.com/twardoch/tmxeditor-builds/actions/runs/36748386509)
  passed resolution and skipped build/publication for the existing release.
- Four local Node tests passed; actionlint and git diff --check passed.
- Initial hosted run exposed Electron lookup in the wrong project directory;
  fixed by resolving its exact installed version from upstream/node_modules.

Limitations: no Apple notarization or Windows certificate; smoke tests cover
the packaged data-processing runtime, not every GUI feature or installer interaction.
Daily schedule is configured; the initial build and skip behavior were exercised
through manual dispatch. GitHub's public-repository inactivity rule still applies.
