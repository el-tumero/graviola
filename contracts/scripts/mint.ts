import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";
import { GRAVIOLA_ADDRESS } from "./constants";
import { parse } from "path";


async function main() {
  const [acc0] = await ethers.getSigners()
  const graviola = await ethers.getContractAt("Graviola", GRAVIOLA_ADDRESS)

  const fee = await graviola.estimateFee()

  const tx = await graviola.mint({value: fee + parseEther("0.007")})
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
