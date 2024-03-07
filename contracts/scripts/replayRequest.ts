import { ethers } from "hardhat";
import { GRAVIOLA_ADDRESS } from "./constants";

async function main() {
  const [acc0] = await ethers.getSigners()
  const graviola = await ethers.getContractAt("Graviola", GRAVIOLA_ADDRESS)
  const tokenId = 3

  const tx = await graviola.replayOAORequest(tokenId)
  await tx.wait()
//   for (let i = 0; i < totalSupply; i++) {
//     // console.log("owner:", await graviola.ownerOf(i))
//     const data = await graviola.getMetadata(i)
//     console.log(data)
//   }
 
  // const data = await graviola.tokenURI(tokenId)
  // const obj = await (await fetch(data)).json()
  // console.log(obj)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
