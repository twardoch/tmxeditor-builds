// this_file: tests/site.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectRelease, renderSite } from '../scripts/site.mjs';

const release = (tag, extra = {}) => ({
  tag_name: tag, draft: false, prerelease: false,
  html_url: `https://github.com/twardoch/tmxeditor-builds/releases/tag/${tag}`,
  published_at: '2026-09-30T17:00:42Z',
  assets: ['macOS-arm64.dmg', 'macOS-x64.dmg', 'Windows-x64-Setup.exe', 'SHA256SUMS.txt', 'TMXEditor-source.tar.gz']
    .map(name => ({ name, size: 1048576, browser_download_url: `https://github.com/twardoch/tmxeditor-builds/releases/download/${tag}/${name}` })),
  ...extra,
});
test('site selects highest stable version then build revision, not publication order', () => {
  const selected = selectRelease([
    release('v4.0.0-build.20'), release('v4.1.0-build.2'), release('v4.1.0-build.10'),
    release('v5.0.0-build.1', { draft: true }), release('v6.0.0-build.1', { prerelease: true }),
  ]);
  assert.equal(selected.tag_name, 'v4.1.0-build.10');
  assert.throws(() => selectRelease([]), /No published stable/);
});
test('site renders actual download links and shared README instructions without browser JavaScript', () => {
  const html = renderSite(release('v4.1.0-build.1'), '<!-- usage:start -->\n## Install and use\n\nChoose **File → Open**.\n<!-- usage:end -->', '{{release}} {{date}} {{downloads}} {{extras}} {{usage}}');
  assert.match(html, /releases\/download\/v4.1.0-build.1\/macOS-arm64.dmg/);
  assert.match(html, /<strong>File → Open<\/strong>/);
  assert.doesNotMatch(html, /<script|\{\{/);
});
test('missing assets, unsafe links and missing shared instructions fail the build', () => {
  const readme = '<!-- usage:start -->hello<!-- usage:end -->';
  assert.throws(() => renderSite(release('v4.1.0-build.1', { assets: [] }), readme, ''), /Missing asset/);
  const unsafe = release('v4.1.0-build.1');
  unsafe.assets[0].browser_download_url = 'javascript:alert(1)';
  assert.throws(() => renderSite(unsafe, readme, ''), /Unexpected download URL/);
  assert.throws(() => renderSite(release('v4.1.0-build.1'), '# README', ''), /usage markers/);
});
