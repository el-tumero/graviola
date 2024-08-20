import 'dotenv/config'
import hardhat from 'hardhat'
import { DeployedContractEnum } from './deployed-contract'

// Values for Arbitrum Sepolia
const VRF_WRAPPER_ADDRESS = '0x29576aB8152A09b9DC634804e4aDE73dA1f3a3CC'
const OAO_PROXY_ADDRESS = '0x0A0f4321214BB6C7811dD8a71cF587bdaF03f0A0'

export default async function deployTestnet() {
    console.log('Deployment start...')
    const tm = await hardhat.ethers.deployContract('TestnetMigration')
    await tm.waitForDeployment()
    console.log('Migration deployed!')
    console.log('Migrator address:', await tm.getAddress())

    const [owner] = await hardhat.ethers.getSigners()

    const GraviolaToken =
        await hardhat.ethers.getContractFactory('GraviolaToken')
    const GraviolaSeasonsArchive = await hardhat.ethers.getContractFactory(
        'GraviolaSeasonsArchive',
    )
    const GraviolaSeasonsGovernor = await hardhat.ethers.getContractFactory(
        'GraviolaSeasonsGovernor',
    )
    const GraviolaCollection =
        await hardhat.ethers.getContractFactory('GraviolaCollection')
    const GraviolaGenerator =
        await hardhat.ethers.getContractFactory('GraviolaGenerator')

    // Deployments
    const gt = await GraviolaToken.deploy(owner)
    await gt.waitForDeployment()
    console.log('GraviolaToken deployed!')

    const gsa = await GraviolaSeasonsArchive.deploy(tm)
    await gsa.waitForDeployment()
    console.log('GraviolaSeasonsArchive deployed!')

    const gsg = await GraviolaSeasonsGovernor.deploy(gsa, gt)
    await gsg.waitForDeployment()
    console.log('GraviolaSeasonsGovernor deployed!')

    const collection = await GraviolaCollection.deploy(tm, gsa)
    await collection.waitForDeployment()
    console.log('GraviolaCollection deployed!')

    const generator = await GraviolaGenerator.deploy(
        gt,
        gsa,
        collection,
        OAO_PROXY_ADDRESS,
        VRF_WRAPPER_ADDRESS,
    )
    await generator.waitForDeployment()
    console.log('GraviolaGenerator deployed!')

    console.log('All contracts deployed!')

    await (
        await tm.addDeployedContractAddress(
            DeployedContractEnum.COLLECTION,
            collection,
        )
    ).wait()
    await (
        await tm.addDeployedContractAddress(
            DeployedContractEnum.GENERATOR,
            generator,
        )
    ).wait()
    await (
        await tm.addDeployedContractAddress(
            DeployedContractEnum.SEASONS_ARCHIVE,
            gsa,
        )
    ).wait()

    const setupTx = await tm.setup()
    await setupTx.wait()

    console.log('Contracts configured!')

    const [
        tokenAddress,
        collectionAddress,
        gsaAddress,
        gsgAddress,
        generatorAddress,
    ] = await Promise.all([
        gt.getAddress(),
        collection.getAddress(),
        gsa.getAddress(),
        gsg.getAddress(),
        generator.getAddress(),
    ])

    const output = {
        VRF_ADDRESS: VRF_WRAPPER_ADDRESS,
        OAO_ADDRESS: OAO_PROXY_ADDRESS,
        TOKEN_ADDRESS: tokenAddress,
        COLLECTION_ADDRESS: collectionAddress,
        SEASONS_ARCHIVE_ADDRESS: gsaAddress,
        SEASONS_GOVERNOR_ADDRESS: gsgAddress,
        GENERATOR_ADDRESS: generatorAddress,
    }

    return output
}
