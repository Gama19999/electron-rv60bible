async function optimizeLocales(forgeConfig, packageResult) {
    const fs = require('node:fs')
    const path = require('node:path')
    const localesDir = path.join(packageResult.outputPaths[0], 'locales')
    if (fs.existsSync(localesDir)) {
        fs.readdir(localesDir, (err, files) => {
            if (err) throw err
            for (const file of files) {
                if (file === 'es-419.pak') {
                    console.log(`Keeping locale file: ${file}`)
                    continue
                }
                fs.unlink(path.join(localesDir, file), (err) => {
                    if (err) throw err
                    console.log(`Deleted unused locale file: ${file}`)
                })
            }
        })
    }
}

module.exports = optimizeLocales;