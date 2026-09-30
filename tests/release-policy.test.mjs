// this_file: tests/release-policy.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import policy from '../scripts/release-policy.cjs';

test('release tags distinguish rebuilds and accept upstream prereleases', () => {
  assert.equal(policy.releaseTag('v4.1.0', '1'), 'v4.1.0-build.1');
  assert.equal(policy.releaseTag('4.1.0-beta.1', 2), '4.1.0-beta.1-build.2');
});
test('invalid tags and revisions fail before any build or publication', () => {
  for (const tag of ['', '../main', 'main', 'v4.1.0\nattack']) {
    assert.throws(() => policy.releaseTag(tag, 1), /Unsupported/);
  }
  for (const revision of ['', '0', '-1', '1.5', '10000', '1\n']) {
    assert.throws(() => policy.releaseTag('v4.1.0', revision), /revision/);
  }
});
test('published builds skip while missing and failed draft builds retry', () => {
  assert.equal(policy.needsBuild(null), true);
  assert.equal(policy.needsBuild({ draft: true }), true);
  assert.equal(policy.needsBuild({ draft: false }), false);
});
