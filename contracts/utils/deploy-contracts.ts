import 'dotenv/config'
import hardhat from 'hardhat'
import { DeployedContractEnum, DeployedContractAddressData } from './contracts'
import { GraviolaMigrator } from '../dist'

// Values for Arbitrum Sepolia
const VRF_WRAPPER_ADDRESS = '0x29576aB8152A09b9DC634804e4aDE73dA1f3a3CC'
const OAO_PROXY_ADDRESS = '0x0A0f4321214BB6C7811dD8a71cF587bdaF03f0A0'

async function addAddressToMigrator(
    migrator: GraviolaMigrator,
    contract: number,
    address: string,
) {
    return await (
        await migrator.addDeployedContractAddress(contract, address)
    ).wait()
}

export default async function deployContracts(
    variant: 'localhost' | 'arbitrumSepolia',
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
    const GraviolaSchema =
        await hardhat.ethers.getContractFactory('GraviolaSchema')
    const GraviolaCollection =
        await hardhat.ethers.getContractFactory('GraviolaCollection')
    const GraviolaCollectionReadProxy = await hardhat.ethers.getContractFactory(
        'GraviolaCollectionReadProxy',
    )
    const GraviolaKeywordsVault = await hardhat.ethers.getContractFactory(
        'GraviolaKeywordsVaultBasic',
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

    const schema = await GraviolaSchema.deploy()
    await schema.waitForDeployment()
    console.log('GraviolaSchema deployed!')

    const collection = await GraviolaCollection.deploy(gm, oao)
    await collection.waitForDeployment()
    console.log('GraviolaCollection deployed!')

    const collectionReadProxy = await GraviolaCollectionReadProxy.deploy(
        collection.getAddress(),
        schema.getAddress(),
    )
    await collectionReadProxy.waitForDeployment()
    console.log('GraviolaCollectionReadProxy deployed!')

    const keywordsVault = await GraviolaKeywordsVault.deploy()
    await keywordsVault.waitForDeployment()
    console.log('GraviolaKeywordsVault deployed!')

    const generator = await GraviolaGenerator.deploy(
        keywordsVault,
        collection,
        oao,
        vrf,
    )
    await generator.waitForDeployment()
    console.log('GraviolaGenerator deployed!')

    const [
        schemaAddress,
        collectionAddress,
        collectionReadProxyAddress,
        keywordsVaultAddress,
        generatorAddress,
    ] = await Promise.all([
        schema.getAddress(),
        collection.getAddress(),
        collectionReadProxy.getAddress(),
        keywordsVault.getAddress(),
        generator.getAddress(),
    ])

    console.log('All contracts deployed!')

    await addAddressToMigrator(
        gm,
        DeployedContractEnum.GENERATOR,
        generatorAddress,
    )
    console.log('Generator added to migrator!')
    await addAddressToMigrator(
        gm,
        DeployedContractEnum.COLLECTION,
        collectionAddress,
    )
    console.log('Collection added to migrator!')
    await addAddressToMigrator(
        gm,
        DeployedContractEnum.COLLECTION_READ_PROXY,
        collectionReadProxyAddress,
    )
    console.log('Collection Read Proxy added to migrator!')
    await addAddressToMigrator(gm, DeployedContractEnum.SCHEMA, schemaAddress)
    console.log('Schema added to migrator!')
    console.log('Contracts added to migrator!')

    const setup = await gm.setup()
    await setup.wait()

    console.log('Migrator setup done!')

    const output: DeployedContractAddressData = {
        VRF_ADDRESS: vrf,
        OAO_ADDRESS: oao,
        COLLECTION_ADDRESS: collectionAddress,
        KEYWORDS_VAULT_ADDRESS: keywordsVaultAddress,
        GENERATOR_ADDRESS: generatorAddress,
        COLLECTION_READ_PROXY_ADDRESS: collectionReadProxyAddress,
        MIGRATOR_ADDRESS: migratorAddress,
        SCHEMA_ADDRESS: schemaAddress,
    }

    return output
}
