const hre = require("hardhat");

async function main() {
  
    const TGraviolaSeasonsCandidates = await hre.ethers.getContractFactory("TGraviolaSeasonsCandidates")
    const tgsc = await TGraviolaSeasonsCandidates.deploy(100n)
    


//   console.log(tgsc)
    
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});