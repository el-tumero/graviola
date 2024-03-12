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
        it("Test", async() => {
            const {graviola, aiOracle} = await deployFixture()
            
            const preMintTx = await graviola.preMint()
            await preMintTx.wait()

            const upkeepData = await graviola.checkUpkeep(Uint8Array.from([0]))
            console.log(upkeepData)
        })    

  
    })
  })
  