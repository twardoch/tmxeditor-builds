// this_file: electron-builder.cjs
// Electron lives in the upstream app, not this packaging project's node_modules.
module.exports = {
  electronVersion: require('./upstream/node_modules/electron/package.json').version,
  appId: 'io.github.twardoch.tmxeditor',
  productName: 'TMXEditor',
  directories: { app: 'upstream', output: 'dist' },
  asar: true,
  files: ['**/*', '!ts/**', '!docs/**', '!tsconfig.json', '!package-lock.json'],
  mac: {
    target: 'dmg',
    category: 'public.app-category.productivity',
    identity: '-',
    notarize: false,
    hardenedRuntime: false,
    artifactName: 'TMXEditor-${version}-macOS-${arch}.${ext}',
  },
  win: {
    target: 'nsis',
    artifactName: 'TMXEditor-${version}-Windows-${arch}-Setup.${ext}',
  },
  nsis: { oneClick: false, perMachine: false, allowToChangeInstallationDirectory: true, runAfterFinish: false },
};
