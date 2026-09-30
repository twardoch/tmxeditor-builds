---
this_file: README.md
---
# TMXEditor community builds

[Website and downloads](https://code.twardoch.com/tmxeditor-builds/) · [All releases](https://github.com/twardoch/tmxeditor-builds/releases) · [Build a release](https://github.com/twardoch/tmxeditor-builds/actions/workflows/build.yml)

Builds the unmodified [TMXEditor source](https://github.com/maxprograms-com/TMXEditor)
for Windows x64, macOS Apple Silicon and macOS Intel. Electron is bundled;
users do not need Node.js installed.

<!-- usage:start -->
## Install and use

### Install on macOS

1. In **Apple menu → About This Mac**, check whether your Mac lists an Apple
   chip or an Intel processor. Download the matching **Apple Silicon** or **Intel** DMG.
2. Open the DMG and drag **TMXEditor** into **Applications**. Eject the disk image.
3. Open TMXEditor from Applications. These builds are not notarized. If macOS
   blocks the app because the developer cannot be verified, and you trust this
   download, use **System Settings → Privacy & Security → Open Anyway**, then
   confirm. See [Apple's opening instructions](https://support.apple.com/en-us/102445).

### Install on Windows

1. Download the **Windows x64** installer for a 64-bit Intel or AMD PC.
2. Run the `.exe` and follow the installer, choosing an installation folder if needed.
3. Open **TMXEditor** from the Start menu. The installer is unsigned; Windows
   may display a reputation warning. If SmartScreen offers **More info → Run
   anyway**, use it only if you trust the download. A managed PC may require
   your administrator's approval.

### Edit your first translation memory

1. Keep a copy of your original `.tmx` file. Launch TMXEditor and choose
   **File → Open** (`⌘O` on macOS, `Ctrl+O` on Windows).
2. Select a translation unit and edit its segment text. Use **Edit → Confirm
   Edit** (`Option+Enter` / `Alt+Enter`) to confirm the change.
3. Use **View → Filter Translation Units** or **View → Sort Translation Units**
   to find the entries you need.
4. Choose **File → Save As** to save a separate TMX file, or **File → Save**
   (`⌘S` / `Ctrl+S`) to update the current file. Confirming an edit and saving
   the file are separate steps.

To start from a spreadsheet, choose **File → Convert Excel File to TMX** or
**File → Convert CSV/TAB Delimited File to TMX**, then follow the conversion dialog.
Menu names here are from the English interface. For more detail, see the
[upstream user guide](https://github.com/maxprograms-com/TMXEditor/blob/master/tmxeditor_en.pdf).

### Update the app

Download the newest package for your platform from the
[download page](https://code.twardoch.com/tmxeditor-builds/), quit TMXEditor,
then replace the app in Applications on macOS or run the new Windows installer.
Keep your TMX files in your documents folder, separate from the application.
Older builds, checksums and matching source archives remain on the
[releases page](https://github.com/twardoch/tmxeditor-builds/releases).
<!-- usage:end -->

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

## Website maintenance

GitHub Pages publishes `main` → `/docs` at
<https://code.twardoch.com/tmxeditor-builds/>. The **Update website** workflow
runs after successful distributable workflows, on release changes, on website
source changes and by manual dispatch. It regenerates and commits `docs/`, then
explicitly requests a Pages build: commits made with `GITHUB_TOKEN` do not
automatically trigger branch-based Pages builds. No extra token is required.

Edit the usage section between the markers in this README to update both
surfaces. Edit `site/index.html` and `site/style.css` for layout and appearance;
`docs/` is generated. The site features the highest published stable version
and build revision, so an older rebuild or prerelease cannot replace it.

```sh
npm ci
npm run site                # requires an authenticated gh CLI
python3 -m http.server 8000 --directory docs
gh workflow run site.yml --repo twardoch/tmxeditor-builds
```

Open <http://localhost:8000> for a local preview. All download links and usage
instructions are static HTML; visitors do not need JavaScript or GitHub API access.

## Attribution and source

TMXEditor is copyright Maxprograms and distributed under EPL-1.0. These are
independent community builds, without Maxprograms commercial support. Every
release includes its upstream license and corresponding source. GitHub's
automatic “Source code” downloads contain this build repository, not TMXEditor.
The build scripts in this repository are MIT licensed.
