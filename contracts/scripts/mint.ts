import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";


async function main() {
  const [acc0] = await ethers.getSigners()
  const graviolaAddress = "0x799eE17b920928c6FbdcbdF40DD2718717f9c87E"

  const graviola = await ethers.getContractAt("Graviola", graviolaAddress)

  const tx = await graviola.requestMint()
  const recp = (await tx.wait())!
  console.log(recp.logs)


  console.log("Mint script")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
