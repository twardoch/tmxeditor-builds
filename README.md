---
this_file: README.md
---
# TMXEditor community builds

[Download installers](https://github.com/twardoch/tmxeditor-builds/releases) · [Build a release](https://github.com/twardoch/tmxeditor-builds/actions/workflows/build.yml)

Builds the unmodified [TMXEditor source](https://github.com/maxprograms-com/TMXEditor)
for Windows x64, macOS Apple Silicon and macOS Intel. Electron is bundled;
users do not need Node.js installed.

## Build a new release

1. Open **Actions → Build distributables → Run workflow**.
2. Leave **Upstream release tag** empty for the latest stable release, or enter
   an existing upstream release tag such as `v4.1.0`.
3. Keep **Build revision** at `1`. To rebuild a published version, increase it.
4. Run the workflow. All three packages must pass before the release is published.

CLI equivalent:

```sh
gh workflow run build.yml --repo twardoch/tmxeditor-builds
# Explicit version or packaging revision:
gh workflow run build.yml --repo twardoch/tmxeditor-builds -f upstream_tag=v4.1.0 -f revision=2
```

Every day at 07:23 UTC, the workflow checks GitHub's latest stable upstream
release. It skips an already published build. Explicit prereleases can be
built manually and remain marked as prereleases. If multiple upstream releases
appear between checks, only the latest is selected; older versions can be built
manually. No personal access token or signing secrets are needed.

GitHub may delay scheduled runs and disables scheduled workflows in public
repositories after 60 days without repository activity. Re-enable the workflow
in Actions if that happens; the manual button remains available.
See [GitHub's schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).

## Downloads

| File | Use |
| --- | --- |
| `TMXEditor-*-macOS-arm64.dmg` | Apple Silicon Mac |
| `TMXEditor-*-macOS-x64.dmg` | Intel Mac |
| `TMXEditor-*-Windows-x64-Setup.exe` | Windows x64 installer |
| `TMXEditor-source.tar.gz` | Exact upstream source used for all three builds |
| `build-*.json` | Source/build commits, platform and dependency versions |
| `SHA256SUMS.txt` | Checksums of attached artifacts |

On macOS, open the DMG and drag TMXEditor to Applications. On Windows, run
the installer. These builds have no commercial code-signing certificates:
macOS uses an ad-hoc signature without notarization, and Windows is unsigned.
Operating-system security prompts may therefore appear.

## How it works

The workflow resolves the release tag to one commit, checks it out on three
native GitHub runners, installs locked npm dependencies, compiles TypeScript,
and packages with [electron-builder](https://www.electron.build/).
The app's own Electron runtime then imports a bilingual TMX fixture, checks
Unicode and languages, saves it and reopens it. macOS also verifies the app
signature and DMG integrity. GUI workflows are not comprehensively tested.

The publication job uploads all files to a draft before publishing it.
Failed builds publish nothing; failed draft uploads can be retried. Published
releases are skipped, so rebuilds use a new `-build.N` suffix. The suffix belongs
to the release tag; installer names and app versions retain the upstream version.

## Local build

Use Node.js 24.21 or newer, Git, npm and a native macOS or Windows x64 host.
Run these commands in Bash (Git Bash on Windows):

```sh
git clone --branch v4.1.0 --depth 1 https://github.com/maxprograms-com/TMXEditor.git upstream
npm ci
npm --prefix upstream ci
npm --prefix upstream run build
npm test
npm run package -- --mac --arm64  # Intel: --mac --x64; Windows: --win --x64
node scripts/verify-package.mjs
```

Output goes into `dist/`; verified installers are copied to `artifacts/`.
Upstream dependency or build changes may require updating this repository.

## Attribution and source

TMXEditor is copyright Maxprograms and distributed under EPL-1.0. These are
independent community builds, without Maxprograms commercial support. Every
release includes its upstream license and corresponding source. GitHub's
automatic “Source code” downloads contain this build repository, not TMXEditor.
The build scripts in this repository are MIT licensed.
