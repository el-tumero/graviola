import 'dotenv/config'
import hardhat from 'hardhat'
import { DeployedContractEnum, DeployedContractAddressData } from './contracts'
import { GraviolaMigrator } from '../typechain-types'

// Values for Arbitrum Sepolia
const VRF_WRAPPER_ADDRESS = '0x29576aB8152A09b9DC634804e4aDE73dA1f3a3CC'
const OAO_PROXY_ADDRESS = '0x0A0f4321214BB6C7811dD8a71cF587bdaF03f0A0'

async function addAddressToMigrator(
    migrator: GraviolaMigrator,
    contract: number,
    address: string,
) {
    return await migrator.addDeployedContractAddress(contract, address)
}

export default async function deployContracts(
    variant: 'localhost' | 'testnet',
) {
    console.log('Deployment start...')
    const gm = await hardhat.ethers.deployContract('GraviolaMigrator')
    await gm.waitForDeployment()
    const migratorAddress = await gm.getAddress()
    console.log('Migration deployed!')
    console.log('Migrator address:', migratorAddress)

    const [owner] = await hardhat.ethers.getSigners()

    const AIOracleMock = await hardhat.ethers.getContractFactory('AIOracleMock')
    const VRFV2PlusWrapperMock = await hardhat.ethers.getContractFactory(
        'VRFV2PlusWrapperMock',
    )
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
    const GraviolaCollectionReadProxy = await hardhat.ethers.getContractFactory(
        'GraviolaCollectionReadProxy',
    )
    const GraviolaGenerator =
        await hardhat.ethers.getContractFactory('GraviolaGenerator')

    // Deployments

    const oao =
        variant === 'localhost'
            ? await (
                  await (await AIOracleMock.deploy()).waitForDeployment()
              ).getAddress()
            : OAO_PROXY_ADDRESS
    const vrf =
        variant === 'localhost'
            ? await (
                  await (
                      await VRFV2PlusWrapperMock.deploy()
                  ).waitForDeployment()
              ).getAddress()
            : VRF_WRAPPER_ADDRESS

    const gt = await GraviolaToken.deploy(owner)
    await gt.waitForDeployment()
    console.log('GraviolaToken deployed!')

    const gsa = await GraviolaSeasonsArchive.deploy(gm)
    await gsa.waitForDeployment()
    console.log('GraviolaSeasonsArchive deployed!')

    const gsg = await GraviolaSeasonsGovernor.deploy(gsa, gt)
    await gsg.waitForDeployment()
    console.log('GraviolaSeasonsGovernor deployed!')

    const collection = await GraviolaCollection.deploy(gm)
    await collection.waitForDeployment()
    console.log('GraviolaCollection deployed!')

    const collectionReadProxy = await GraviolaCollectionReadProxy.deploy(
        collection.getAddress(),
    )
    await collectionReadProxy.waitForDeployment()
    console.log('GraviolaCollectionReadProxy deployed!')

    const generator = await GraviolaGenerator.deploy(
        gt,
        gsa,
        collection,
        oao,
        vrf,
    )
    await generator.waitForDeployment()
    console.log('GraviolaGenerator deployed!')

    const [
        tokenAddress,
        collectionAddress,
        collectionReadProxyAddress,
        gsaAddress,
        gsgAddress,
        generatorAddress,
    ] = await Promise.all([
        gt.getAddress(),
        collection.getAddress(),
        collectionReadProxy.getAddress(),
        gsa.getAddress(),
        gsg.getAddress(),
        generator.getAddress(),
    ])

    console.log('All contracts deployed!')

    await addAddressToMigrator(
        gm,
        DeployedContractEnum.SEASONS_ARCHIVE,
        gsaAddress,
    )
    await addAddressToMigrator(
        gm,
        DeployedContractEnum.SEASONS_GOVERNOR,
        gsgAddress,
    )
    await addAddressToMigrator(
        gm,
        DeployedContractEnum.GENERATOR,
        generatorAddress,
    )
    await addAddressToMigrator(
        gm,
        DeployedContractEnum.COLLECTION,
        collectionAddress,
    )
    await addAddressToMigrator(
        gm,
        DeployedContractEnum.COLLECTION_READ_PROXY,
        collectionReadProxyAddress,
    )

    const setup = await gm.setup()
    await setup.wait()

    console.log('Migrator setup done!')

    const output: DeployedContractAddressData = {
        VRF_ADDRESS: vrf,
        OAO_ADDRESS: oao,
        TOKEN_ADDRESS: tokenAddress,
        COLLECTION_ADDRESS: collectionAddress,
        SEASONS_ARCHIVE_ADDRESS: gsaAddress,
        SEASONS_GOVERNOR_ADDRESS: gsgAddress,
        GENERATOR_ADDRESS: generatorAddress,
        COLLECTION_READ_PROXY_ADDRESS: collectionReadProxyAddress,
        MIGRATOR_ADDRESS: migratorAddress,
    }

    return output
}
