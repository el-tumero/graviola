import { expect } from "chai";
import { ECDH, randomBytes } from "crypto";
import { ethers } from "hardhat";

describe("Graviola Enum", function () {

    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners()
    
        const VrfHost = await ethers.getContractFactory("VRFHostMock")
        const vrfHost = await VrfHost.deploy()
    
        const AIOracle = await ethers.getContractFactory("AIOracleMock")
        const aiOracle = await AIOracle.deploy()
    
        const Graviola = await ethers.getContractFactory("Graviola")
        const graviola = await Graviola.deploy(await aiOracle.getAddress(), await vrfHost.getAddress())
    
        return { graviola, aiOracle, vrfHost, owner, otherAccount};
    }

    it("Mint & burn test", async () => {
        const { graviola, owner } = await deployFixture()

        const mintTx = await graviola.debugMint(owner.address)
        await mintTx.wait()

        let data = await graviola.ownedTokens(owner.address)
        expect(data).to.be.eql([0n])

        const burnTx = await graviola.burn(0)
        await burnTx.wait()
        
        data = await graviola.ownedTokens(owner.address)
        expect(data).to.be.eql([])
    })

    it("Mint & transfer test", async () => {
        const { graviola, owner, otherAccount } = await deployFixture()
        const mintTx = await graviola.debugMint(owner.address)
        await mintTx.wait()


        const transferTx = await graviola.transferFrom(owner.address, otherAccount.address, 0n)
        await transferTx.wait()

        expect(await graviola.ownedTokens(owner.address)).to.be.eql([])

        expect(await graviola.ownerOf(0n)).to.be.eq(otherAccount.address)

        expect(await graviola.ownedTokens(otherAccount.address)).to.be.eql([0n])

    })

});
