import {
    loadFixture, mine,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import { ethers } from "hardhat";
  import { AbiCoder, EventLog } from "ethers"
  import { randomBytes } from "crypto";
  
describe("GraviolaTemp", function () { 
    async function deployFixture() {
      const [owner, otherAccount] = await ethers.getSigners()
  
      const VrfHost = await ethers.getContractFactory("VRFHostMock")
      const vrfHost = await VrfHost.deploy()
  
      const AIOracle = await ethers.getContractFactory("AIOracleMock")
      const aiOracle = await AIOracle.deploy()
  
      const Graviola = await ethers.getContractFactory("Graviola")
      const graviola = await Graviola.deploy(await aiOracle.getAddress(), await vrfHost.getAddress())
  
      return { graviola, aiOracle, vrfHost, owner};
    }
  
    describe("Tests", function () {
        it("Mint one NFT", async() => {
            const {graviola, aiOracle} = await deployFixture()
            const mintTx = await graviola.mint({value: 10001n})
            await mintTx.wait()
            const aiTx = await aiOracle.invokeCallback(0n, new TextEncoder().encode("hello!"))
            await aiTx.wait()
            console.log(await graviola.getMetadata(0n))
            expect(await graviola.totalSupply()).to.be.eq(1n)
        }) 
    })
  })
  