import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";


async function main() {
  const [acc0] = await ethers.getSigners()

  const graviola = await ethers.getContractAt("Graviola", "0x4420B1c9284565DcB9B01A19B749166D4C5a8eCC")

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
