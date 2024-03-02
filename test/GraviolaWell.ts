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

    it("Test", async () => {
        const { graviolaWell } = await deployFixture()

        console.log("generating random uint256...")
        const bytes = randomBytes(32)
        const input = ethers.toBigInt(bytes)
        console.log("rand input: ", input.toString())
        const res = await graviolaWell.rollWord(input)
        console.log("res: ", res)
    })

});
