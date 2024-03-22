import { expect } from "chai";
import { randomBytes } from "crypto";
import { ethers } from "hardhat";

describe("Graviola Well", function () {

    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners()

        const GraviolaWell = await ethers.getContractFactory("GraviolaWell")
        const graviolaWell = await GraviolaWell.deploy()
        return { graviolaWell, owner, otherAccount };
    }

    function generateSeed() {
        return ethers.toBigInt(randomBytes(32))
    }

    it("TradeUp", async () => {
        const { graviolaWell } = await deployFixture()

        const output = await graviolaWell._tradeUp(generateSeed(), 0n, 480000n)


        console.log(output)
    })

    // it("Check words probability", async () => {
    //     const { graviolaWell } = await deployFixture()
    //     const result = await graviolaWell.getAllWords()
    //     console.log(result)
    // })

});
