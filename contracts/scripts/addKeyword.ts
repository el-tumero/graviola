import { ethers } from "hardhat";
import { GRAVIOLA_ADDRESS } from "./constants";

async function main() {
  const [acc0] = await ethers.getSigners()
  const graviola = await ethers.getContractAt("Graviola", GRAVIOLA_ADDRESS)

  const keyword = "android"
 
  const tx = await graviola.addWordToWell(keyword, 13231232412412441n)
  await tx.wait()
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
