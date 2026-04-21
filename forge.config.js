const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('node:path');
const { deleteUnusedLocales } = require('./hooks/delete-unused-locales');

module.exports = {
  packagerConfig: {
    executableName: 'rv60bible',
    icon: path.join('www', 'assets', 'icons', 'rv60bible.ico'), // change to rv60bible.png for Linux
    ignore: ['hooks', 'linux', 'schemas', '.gitignore', 'forge.config.js', 'installer_script.iss', 'README.md'],
    asar: false, // No asar
    tmpdir: false,
    electronLanguages: ['es-419'],
  },
  rebuildConfig: { force: true },
  makers: [
    {
      name: '@electron-forge/maker-zip',
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
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false, // No asar
      [FuseV1Options.OnlyLoadAppFromAsar]: false, // No asar
    }),
  ],
  hooks: {
    postPackage: deleteUnusedLocales,
  },
  outDir: 'D:\\SOFTWARE ' // change path for Linux
};
