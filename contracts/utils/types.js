const { runTypeChain } = require("typechain")

const BUILD_PATH = "../out"

const allFiles = [
    `${BUILD_PATH}/GraviolaMain.sol/Graviola.json`,
    `${BUILD_PATH}/GraviolaWell.sol/GraviolaWell.json`
]

async function generateContractTypes() {
    await runTypeChain({
        cwd: process.cwd(),
        filesToProcess: allFiles,
        allFiles,
        outDir: "typechain-types",
        target: "ethers-v6"
    })
}

if (require.main === module) {
    (async () => {
        await generateContractTypes()
    })()
}

module.exports = generateContractTypes