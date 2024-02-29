import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

describe("Graviola", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  // NOTE: Only for local tests
  async function deployLockFixture() {
    const [owner, otherAccount] = await ethers.getSigners()
    const Graviola = await ethers.getContractFactory("Graviola")
    const graviola = await Graviola.deploy()

    return { graviola, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async () => {
      const { graviola } = await loadFixture(deployLockFixture);
      console.log(await graviola.hello())
    });
  })

});
