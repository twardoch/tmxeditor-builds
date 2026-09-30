---
this_file: DEPENDENCIES.md
---
# Dependencies

- Node.js 24 and npm: compile the upstream TypeScript application and run scripts.
- electron-builder 26.15.3: create native DMGs and a Windows NSIS installer.
  Its dependency tree is locked in package-lock.json.
- Upstream package-lock.json: pins TMXEditor's Electron, TypeScript and runtime dependencies.
- Official GitHub Actions checkout, setup-node, github-script, upload-artifact and
  download-artifact: source resolution, runners and artifact transfer.
- GitHub CLI: draft release creation, upload and publication, using GITHUB_TOKEN.

References: [builder configuration](https://www.electron.build/configuration/),
[GitHub releases API](https://docs.github.com/en/rest/releases/releases),
[runner images](https://github.com/actions/runner-images).
