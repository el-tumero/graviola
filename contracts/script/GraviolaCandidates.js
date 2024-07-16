const hh = require("hardhat");

async function main() {

    try {
        console.log("Starting...")
        const GraviolaWellFactory = await hh.ethers.getContractFactory("GraviolaWell")
        const GWell = (await GraviolaWellFactory.deploy());
        await GWell.waitForDeployment();
        const GWellAddress = await GWell.getAddress();
        console.log("Graviola Well addr: ", GWellAddress)
        console.log(await GWell.getRarityGroups())
    } catch (err) {
        console.log("Err: ", err)
    }


    // const x = await GraviolaWell.getFunction("getRarityGroups").call(null)
    // console.log(x)



    // const TGraviolaSeasonsCandidates = await hh.ethers.getContractFactory("TGraviolaSeasonsCandidates")
    // const tgsc = await TGraviolaSeasonsCandidates.deploy(100n)
    // console.log(tgsc)
}

main()

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });