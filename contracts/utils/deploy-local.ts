import "dotenv/config"
import hardhat from "hardhat"

export default async function deployLocal() {
    const lm = await hardhat.ethers.deployContract("LocalMigration")
    console.log("Migration deployed!")

    const tx = await lm.run()
    await tx.wait()
    console.log("Contracts deployed!")

    const names = await lm.getNames()
    const addresses = await lm.getAddresses()

    const output: Record<string, string> = {}

    names.forEach((name: string, index: number) => {
        output[`${name}_ADDRESS`] = addresses[index]
    })

    return output
}
