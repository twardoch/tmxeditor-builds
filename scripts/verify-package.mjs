// this_file: scripts/verify-package.mjs
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';

const mac = process.platform === 'darwin';
assert.ok(mac || process.platform === 'win32', 'Build on macOS or Windows');
const arch = process.arch;
const app = mac ? `dist/mac${arch === 'arm64' ? '-arm64' : ''}/TMXEditor.app` : 'dist/win-unpacked';
const executable = resolve(app, mac ? 'Contents/MacOS/TMXEditor' : 'TMXEditor.exe');
const asar = resolve(app, mac ? 'Contents/Resources/app.asar' : 'resources/app.asar');
assert.ok(existsSync(asar), 'Packaged application archive must exist');
execFileSync(executable, [resolve('scripts/smoke-test.mjs'), asar], {
  env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }, stdio: 'inherit', timeout: 120000,
});
const extension = mac ? '.dmg' : '.exe';
const installers = readdirSync('dist').filter(name => name.endsWith(extension));
assert.equal(installers.length, 1, 'Exactly one installer must be built per runner');
if (mac) {
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' });
  execFileSync('hdiutil', ['verify', join('dist', installers[0])], { stdio: 'inherit' });
}
mkdirSync('artifacts', { recursive: true });
copyFileSync(join('dist', installers[0]), join('artifacts', installers[0]));
const pkg = JSON.parse(readFileSync('upstream/package.json'));
const lock = JSON.parse(readFileSync('upstream/package-lock.json'));
writeFileSync(`artifacts/build-${process.platform}-${arch}.json`, JSON.stringify({
  upstreamTag: process.env.UPSTREAM_TAG,
  upstreamCommit: process.env.UPSTREAM_SHA,
  buildCommit: process.env.GITHUB_SHA,
  version: pkg.version,
  electron: lock.packages['node_modules/electron'].version,
  node: process.version,
  platform: process.platform,
  arch,
  installer: installers[0],
  smokeTest: 'TMX import, languages, Unicode, save and reopen passed',
}, null, 2) + '\n');
