const { runTypeChain } = require("typechain")

const BUILD_PATH = "./out"
const contractNames = ["Graviola", "GraviolaWell"]

const allFiles = contractNames.map(name => `${BUILD_PATH}/${name}.sol/${name}.json`)

runTypeChain({
    cwd: process.cwd(),
    filesToProcess: allFiles,
    allFiles,
    outDir: "typechain-types",
    target: "ethers-v6"
})