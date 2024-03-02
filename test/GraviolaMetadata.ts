import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Graviola Metadata", function () {

  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners()

    const GraviolaMetadata = await ethers.getContractFactory("GraviolaMetadata")
    const graviolaMetadata = await GraviolaMetadata.deploy()

    return { graviolaMetadata, owner, otherAccount };
  }

  it("Test tokenURI", async () => {
    const {graviolaMetadata} = await deployFixture()
    await graviolaMetadata.debugAddMetadata(
      0, 
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png",
      "ethereum logo"
    )
    
    const data = await graviolaMetadata._tokenURI(0)
    const dataObj = await (await fetch(data)).json()
    console.log(dataObj)
    const expectedObj = {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png", 
      description: "ethereum logo",
      attributes: [
        {
          "trait_type": "Rarity",
          "value": 25
        }
      ]
    }

    expect(dataObj).to.be.eql(expectedObj)
  })



});
