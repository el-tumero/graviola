import { ethers } from "hardhat";


async function main() {
  const [acc0] = await ethers.getSigners()
  const graviolaAddress = "0x799eE17b920928c6FbdcbdF40DD2718717f9c87E"

  const graviola = await ethers.getContractAt("Graviola", graviolaAddress)

  const checkData = await graviola.checkUpkeep(new Uint8Array([0]))
  if(!checkData.upkeepNeeded) {
    console.log("Nothing to perform!")
    return
  }

  const tx = await graviola.performUpkeep(checkData.performData)
  await tx.wait()
  console.log("Upkeep performed!")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
