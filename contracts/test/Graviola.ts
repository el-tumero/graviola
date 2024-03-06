import {
  loadFixture, mine,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AbiCoder, EventLog } from "ethers"
import { randomBytes } from "crypto";

describe("Graviola", function () {

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

    it("VRF Mock test", async () => {
      const {graviola, vrfHost, owner} = await loadFixture(deployFixture)

      const reqTx = await graviola.requestMint()
      const {logs: logs0} = (await reqTx.wait())!
      const [refId] = (logs0.find(evt => evt instanceof EventLog && evt.fragment.name == "RequestSent") as EventLog).args as unknown as [bigint]
      expect(refId).to.be.eq(0n)

      // upkeep logic
      let checkData = await graviola.checkUpkeep(new Uint8Array([0]))
      expect(checkData.upkeepNeeded).to.be.eq(false)

      // add rounds
      let addTx = await vrfHost.addRound(ethers.toBigInt(randomBytes(32)))
      await addTx.wait()
      addTx = await vrfHost.addRound(ethers.toBigInt(randomBytes(32)))
      await addTx.wait()
      addTx = await vrfHost.addRound(ethers.toBigInt(randomBytes(32)))
      await addTx.wait()

      checkData = await graviola.checkUpkeep(new Uint8Array([0]))
      expect(checkData.upkeepNeeded).to.be.eq(true)
      
      const [op, id] = AbiCoder.defaultAbiCoder().decode(["uint8", "uint256"], checkData.performData)
      expect(op).to.be.eq(0n)
      expect(id).to.be.eq(0n)

      const performTx = await graviola.performUpkeep(checkData.performData)
      await performTx.wait()

      expect(await graviola.ownerOf(0)).to.be.eq(await owner.address)
    })

    it("Full local mint test", async () => {
      const {graviola, vrfHost, aiOracle} = await loadFixture(deployFixture)
      const reqTx = await graviola.requestMint()
      await reqTx.wait()

      for (let i = 0; i < 3; i++) {
        await(await vrfHost.addRound(ethers.toBigInt(randomBytes(32)))).wait()
      }

      let checkData = await graviola.checkUpkeep(new Uint8Array([0]))
      expect(checkData.upkeepNeeded).to.be.eq(true)

      let performTx = await graviola.performUpkeep(checkData.performData)
      await performTx.wait()

      const aioTx = await aiOracle.invokeCallback(0, ethers.toUtf8Bytes("https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png"))
      await aioTx.wait()

      checkData = await graviola.checkUpkeep(new Uint8Array([0]))
      expect(checkData.upkeepNeeded).to.be.eq(true)
      const [op, id] = AbiCoder.defaultAbiCoder().decode(["uint8", "uint256"], checkData.performData)
      expect(op).to.be.eq(1n)
      expect(id).to.be.eq(0n)

      performTx = await graviola.performUpkeep(checkData.performData)
      await performTx.wait()

      const uri = await graviola.tokenURI(0)
      const obj = await (await fetch(uri)).json()
      
      console.log(obj)

    })

  })

});
