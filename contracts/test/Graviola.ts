import {
  loadFixture, mine,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AbiCoder, EventLog, parseEther } from "ethers"
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

    return { graviola, aiOracle, owner};
  }

  const fee = parseEther("0.006")

  describe("Tests", function () {

    it("Full local mint test", async () => {
      const {graviola, aiOracle, owner} = await loadFixture(deployFixture)
      const reqTx = await graviola.mint({value: fee})
      await reqTx.wait()

      const aioTx = await aiOracle.invokeCallback(0, ethers.toUtf8Bytes("image-cid"))
      await aioTx.wait()

      // const uri = await graviola.tokenURI(0)
      expect(await graviola.ownerOf(0n)).to.be.eq(owner.address)
      // const obj = await (await fetch(uri)).json()
      
      // console.log(obj)
    })

    it("Mint 3 tokens & tradeUp", async () => {
      const {graviola, aiOracle} = await loadFixture(deployFixture)

      for (let i = 0; i < 3; i++) {
        const reqTx = await graviola.mint({value: fee})
        await reqTx.wait()
        const aioTx = await aiOracle.invokeCallback(i, ethers.toUtf8Bytes("image-url"+i))
        await aioTx.wait()

        const uri = await graviola.tokenURI(i)
        const obj = await (await fetch(uri)).json()
        console.log(obj.attributes[0].value)
      }
      console.log("minted")

      const tupTx = await graviola.tradeUp([0n, 1n, 2n], {value: fee})
      const recp = await tupTx.wait()
      // console.log(recp)

      const aioTx = await aiOracle.invokeCallback(3n, ethers.toUtf8Bytes("image-url"+"3"))
      await aioTx.wait()

      const uri = await graviola.tokenURI(3n)
      const obj = await (await fetch(uri)).json()
      console.log(obj)

    })


  })

});
