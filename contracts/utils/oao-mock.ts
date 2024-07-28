import hardhat from "hardhat"
import localAddresses from "../addresses-local.json"

const IMG_URL = "QmTjUY4rQLrgv8tjedXoXDmXRtahL1bcFVK64jnTkiVGEn"
const OAOContractAddress = localAddresses.OAO_ADDRESS

async function main() {
    const AIOracleMock = await hardhat.ethers.getContractAt(
        "AIOracleMock",
        OAOContractAddress,
    )

    const tx = await AIOracleMock.invokeNextCallback(
        hardhat.ethers.toUtf8Bytes(IMG_URL),
    )
    const recp = await tx.wait()
    console.log(recp)
    console.log("Output added!")
}

main()
