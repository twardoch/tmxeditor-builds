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
- marked 18.0.14: renders the README usage section into the static website.
- semver 7.7.4: selects the newest stable release and build revision correctly.

The website uses plain HTML/CSS with no browser JavaScript or external fonts.
GitHub Pages serves generated `docs/` from the main branch; the website workflow
requests a Pages build through the official REST API after generation.

References: [builder configuration](https://www.electron.build/configuration/),
[GitHub releases API](https://docs.github.com/en/rest/releases/releases),
[runner images](https://github.com/actions/runner-images).
