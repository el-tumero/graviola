import { ethers } from "hardhat";
import { GRAVIOLA_ADDRESS } from "./constants";

async function main() {
  const [acc0] = await ethers.getSigners()
  const graviola = await ethers.getContractAt("Graviola", GRAVIOLA_ADDRESS)

  const prompt = "goblin, human, alien"

  const response = await graviola.readPromptResponse(prompt) 
  console.log(response)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
