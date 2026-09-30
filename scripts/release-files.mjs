// this_file: scripts/release-files.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const files = readdirSync('artifacts').sort();
assert.equal(files.filter(f => f.endsWith('.dmg')).length, 2, 'Both Mac installers are required');
assert.equal(files.filter(f => f.endsWith('.exe')).length, 1, 'Windows installer is required');
assert.equal(files.filter(f => f.startsWith('build-')).length, 3, 'All build manifests are required');
for (const name of files.filter(f => f.startsWith('build-'))) {
  const manifest = JSON.parse(readFileSync(`artifacts/${name}`));
  assert.equal(manifest.upstreamCommit, process.env.UPSTREAM_SHA, 'All builds must use the same source');
  assert.equal(manifest.upstreamTag, process.env.UPSTREAM_TAG, 'All builds must use the same tag');
}
writeFileSync('artifacts/SHA256SUMS.txt', files.map(name =>
  `${createHash('sha256').update(readFileSync(`artifacts/${name}`)).digest('hex')}  ${name}\n`
).join(''));
writeFileSync('release-notes.md', `Community builds of [TMXEditor ${process.env.UPSTREAM_TAG}](https://github.com/maxprograms-com/TMXEditor/releases/tag/${process.env.UPSTREAM_TAG}).

| Download | Platform |
| --- | --- |
| macOS-arm64.dmg | Apple Silicon Mac |
| macOS-x64.dmg | Intel Mac |
| Windows-x64-Setup.exe | Windows x64 |

macOS apps are ad-hoc signed, not notarized. Windows installers are unsigned. OS security prompts may appear.

Built from upstream commit \`${process.env.UPSTREAM_SHA}\` without application source changes. Each packaged Electron runtime passed TMX import, language, Unicode, save and reopen checks. These checks do not cover every GUI feature.

The exact upstream source archive, EPL-1.0 license, build manifests and SHA-256 checksums are attached. GitHub's automatic source archives contain the build scripts instead. Maxprograms owns TMXEditor; these community builds are not official Maxprograms installers and do not include their commercial support.
`);
