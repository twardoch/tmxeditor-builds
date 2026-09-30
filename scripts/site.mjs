// this_file: scripts/site.mjs
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { marked } from 'marked';
import semver from 'semver';

const repository = 'twardoch/tmxeditor-builds';
const github = `https://github.com/${repository}`;
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const platforms = [
  ['macOS-arm64.dmg', 'macOS', 'Apple Silicon', 'For Macs with an Apple M-series chip'],
  ['macOS-x64.dmg', 'macOS', 'Intel', 'For Macs with an Intel processor'],
  ['Windows-x64-Setup.exe', 'Windows', '64-bit Intel / AMD', 'An installer with a choice of install location'],
];

export function selectRelease(releases) {
  const stable = releases.filter(release => !release.draft && !release.prerelease && semver.valid(release.tag_name));
  stable.sort((a, b) => semver.rcompare(a.tag_name, b.tag_name));
  assert.ok(stable.length, 'No published stable release found');
  return stable[0];
}

function assetLink(release, suffix) {
  const asset = release.assets.find(item => item.name.endsWith(suffix));
  assert.ok(asset, `Missing asset: ${suffix}`);
  assert.ok(asset.browser_download_url.startsWith(`${github}/releases/download/`), 'Unexpected download URL');
  return { ...asset, url: escape(asset.browser_download_url) };
}

export function renderSite(release, readme, template) {
  const usage = readme.split('<!-- usage:start -->')[1]?.split('<!-- usage:end -->')[0];
  assert.ok(usage && readme.includes('<!-- usage:end -->'), 'README usage markers are required');
  const downloads = platforms.map(([suffix, os, arch, description]) => {
    const asset = assetLink(release, suffix);
    return `<article class="download"><h3>${os}</h3><p class="arch">${arch}</p><p>${description}</p><a class="button" href="${asset.url}">Download ${os === 'macOS' ? 'DMG' : 'installer'} <span aria-hidden="true">↓</span><span class="sr-only"> for ${os} ${arch}</span></a><small>${(asset.size / 1048576).toFixed(1)} MB · ${os === 'macOS' ? '.dmg' : '.exe'}</small></article>`;
  }).join('\n');
  const values = {
    release: escape(release.tag_name),
    date: new Date(release.published_at).toISOString().slice(0, 10),
    downloads,
    extras: `<a href="${assetLink(release, 'SHA256SUMS.txt').url}">SHA-256 checksums</a> · <a href="${assetLink(release, 'TMXEditor-source.tar.gz').url}">Matching source code</a> · <a href="${github}/releases/tag/${encodeURIComponent(release.tag_name)}">Release notes</a>`,
    usage: marked.parse(usage, { async: false }),
  };
  return template.replace(/\{\{(release|date|downloads|extras|usage)\}\}/g, (_, key) => values[key]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pages = JSON.parse(execFileSync('gh', ['api', `repos/${repository}/releases?per_page=100`, '--paginate', '--slurp'], { encoding: 'utf8', timeout: 60000, maxBuffer: 20 * 1024 * 1024 }));
  const release = selectRelease(pages.flat());
  const html = renderSite(release, readFileSync('README.md', 'utf8'), readFileSync('site/index.html', 'utf8'));
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/index.html', html);
  copyFileSync('site/style.css', 'docs/style.css');
  writeFileSync('docs/.nojekyll', '');
  console.log(`Built docs/ for ${release.tag_name}`);
}
