// this_file: tests/release-files.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

test('publication requires complete matching builds and produces correct checksums', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'tmx-release-test-'));
  const artifact = name => join(scratch, 'artifacts', name);
  const run = () => spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/release-files.mjs', import.meta.url))], {
    cwd: scratch, env: { ...process.env, UPSTREAM_TAG: 'v4.1.0', UPSTREAM_SHA: 'abc123' }, encoding: 'utf8',
  });
  try {
    mkdirSync(join(scratch, 'artifacts'));
    assert.notEqual(run().status, 0, 'Missing installers must block publication');
    for (const name of ['arm64.dmg', 'x64.dmg', 'setup.exe', 'TMXEditor-source.tar.gz', 'TMXEditor-LICENSE.txt']) {
      writeFileSync(artifact(name), 'test payload');
    }
    for (const platform of ['darwin-arm64', 'darwin-x64', 'win32-x64']) {
      writeFileSync(artifact(`build-${platform}.json`), JSON.stringify({ upstreamTag: 'v4.1.0', upstreamCommit: 'wrong' }));
    }
    assert.notEqual(run().status, 0, 'Mixed source commits must block publication');
    for (const platform of ['darwin-arm64', 'darwin-x64', 'win32-x64']) {
      writeFileSync(artifact(`build-${platform}.json`), JSON.stringify({ upstreamTag: 'v4.1.0', upstreamCommit: 'abc123' }));
    }
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    const expected = createHash('sha256').update('test payload').digest('hex');
    assert.ok(readFileSync(artifact('SHA256SUMS.txt'), 'utf8').includes(`${expected}  arm64.dmg`), 'Checksum must match the actual payload');
    assert.match(readFileSync(join(scratch, 'release-notes.md'), 'utf8'), /abc123/, 'Notes must identify the exact source');
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
});
