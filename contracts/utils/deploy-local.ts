import 'dotenv/config'
import hardhat from 'hardhat'
import { DeployedContractEnum } from './deployed-contract'

export default async function deployLocal() {
    const lm = await hardhat.ethers.deployContract('LocalMigration')
    await lm.waitForDeployment()
    console.log('Migration deployed!')

    await (await lm.deploy()).wait()
    console.log('Contracts deployed!')

    await (await lm.setup()).wait()
    console.log('Contracts configured!')

    const output: Record<string, string> = {}

    for (const [key, value] of Object.entries(DeployedContractEnum)) {
        output[`${key}_ADDRESS`] = await lm.getDeployedContractAddress(value)
    }

    return output
}
