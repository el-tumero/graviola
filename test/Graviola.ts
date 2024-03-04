import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { AbiCoder, EventLog } from "ethers"

describe("Graviola", function () {

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners()

    const Coordinator = await ethers.getContractFactory("VRFCoordinatorV2Mock")
    const BASEFEE = 100000000000000000n
    const GASPRICELINK = 1000000000n
    const KEYHASH = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"

    const coordinator = await Coordinator.deploy(BASEFEE, GASPRICELINK)

    const tx = await coordinator.createSubscription()
    const recp = await tx.wait()
    if(!recp) throw Error("Create sub tx failed")

    const evt = recp.logs.find(evt => evt instanceof EventLog && evt.fragment.name === "SubscriptionCreated") as EventLog | undefined
    if(!evt) throw Error("Create sub tx failed - no event")

    const [subId] = evt.args as unknown as [bigint, string]
    await (await coordinator.fundSubscription(subId, 1000000000000000000n)).wait()

    const AIOracle = await ethers.getContractFactory("AIOracleMock")
    const aiOracle = await AIOracle.deploy()

    const Graviola = await ethers.getContractFactory("Graviola")
    const graviola = await Graviola.deploy(subId, await coordinator.getAddress(), KEYHASH, await aiOracle.getAddress())

    
    await (await coordinator.addConsumer(subId, await graviola.getAddress())).wait()

    return { graviola, coordinator, aiOracle, owner, otherAccount };
  }

  describe("Tests", function () {

    it("VRF Mock test", async () => {
      const {graviola, coordinator, owner} = await loadFixture(deployFixture)

      const reqTx = await graviola.requestMint()
      const {logs: logs0} = (await reqTx.wait())!
      const [requestId] = (logs0.find(evt => evt instanceof EventLog && evt.fragment.name == "RequestSent") as EventLog).args as unknown as [bigint]

      const fulTx = await coordinator.fulfillRandomWords(requestId, await graviola.getAddress())
      await fulTx.wait()

      const {randomWords} = await graviola.getRequestStatus(requestId)

      expect(randomWords[0]).to.be.eql(78541660797044910968829902406342334108369226379826116161446442989268089806461n)
      expect(await graviola.ownerOf(0)).to.be.eq(await owner.address)
    })

    it("Full local mint test", async () => {
      const {graviola, coordinator, aiOracle} = await loadFixture(deployFixture)
      const reqTx = await graviola.requestMint()
      const {logs: logs0} = (await reqTx.wait())!

      const [requestId] = (logs0.find(evt => evt instanceof EventLog && evt.fragment.name == "RequestSent") as EventLog).args as unknown as [bigint]
      const fulTx = await coordinator.fulfillRandomWords(requestId, await graviola.getAddress())
      await fulTx.wait()

      const [status0] = await graviola.checkUpkeep(Uint8Array.from([0]))
      expect(status0).to.be.eq(false)

      const aioTx = await aiOracle.invokeCallback(0, ethers.toUtf8Bytes("https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png"))
      await aioTx.wait()


      let [status1, id] = await graviola.checkUpkeep(Uint8Array.from([0]))
      expect(status1).to.be.eq(true)
      
      const pTx = await graviola.performUpkeep(id)
      await pTx.wait()

      const uri = await graviola.tokenURI(0)
      const obj = await (await fetch(uri)).json()

      console.log(obj)

      // expect(obj).be.eql(expectedObj)
      // expect(graviola.tokenURI(1)).to.be.revertedWith("Metadata is empty!")
    })

  })

});
