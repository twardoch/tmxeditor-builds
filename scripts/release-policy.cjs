// this_file: scripts/release-policy.cjs
// Keep release selection testable without contacting GitHub.
function releaseTag(tag, revision) {
  if (tag.trim() !== tag || !/^v?\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?$/.test(tag)) {
    throw new Error(`Unsupported upstream release tag: ${tag}`);
  }
  if (String(revision).trim() !== String(revision) || !/^[1-9]\d{0,3}$/.test(String(revision))) {
    throw new Error('Build revision must be an integer from 1 to 9999');
  }
  return `${tag}-build.${revision}`;
}
function needsBuild(release) {
  return !release || release.draft;
}
module.exports = { releaseTag, needsBuild };
