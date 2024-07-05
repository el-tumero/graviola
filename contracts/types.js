const { runTypeChain } = require("typechain")

const BUILD_PATH = "./out"

// const contractNames = ["GraviolaMain", "GraviolaWell"]
// const allFiles = contractNames.map(name => `${BUILD_PATH}/${name}.sol/${name}.json`)

const allFiles = [
    `${BUILD_PATH}/GraviolaMain.sol/Graviola.json`,
    `${BUILD_PATH}/GraviolaWell.sol/GraviolaWell.json`
]

runTypeChain({
    cwd: process.cwd(),
    filesToProcess: allFiles,
    allFiles,
    outDir: "typechain-types",
    target: "ethers-v6"
})