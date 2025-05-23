const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const util = require('./electron/util')

module.exports = {
  packagerConfig: {
    name: 'Biblia RV60',
    executableName: 'rv60bible',
    ignore: ['.idea','data/files','.gitignore','forge.config.js'],
    icon: util.getPath('..', 'ic_color.ico'),
  },
  rebuildConfig: {force: true},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
  ],
  plugins: [
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
  outDir: 'dist'
};
