import hardhat from 'hardhat'
import { select } from '@inquirer/prompts'
import addresses from '../addresses-testnet.json'
import fs from 'fs'
import path from 'path'
import { DeployedContractAddressEnum } from './deployed-contract'

const addressesPath = path.resolve('addresses-testnet.json')

async function main() {
    await hardhat.run('compile')

    const answer = await select({
        message: 'Select contract to redeploy',
        choices: [
            { name: 'SeasonsGovernor', value: redeploySeasonsGovernor },
            { name: 'Generator', value: redeployGenerator },
        ],
    })

    answer()
}

function editAddress(
    contract: keyof typeof DeployedContractAddressEnum,
    address: string,
) {
    addresses[contract] = address
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 4))
}

async function redeployGenerator() {
    const Generator =
        await hardhat.ethers.getContractFactory('GraviolaGenerator')

    const generator = await Generator.deploy(
        addresses.TOKEN_ADDRESS,
        addresses.SEASONS_ARCHIVE_ADDRESS,
        addresses.COLLECTION_ADDRESS,
        addresses.OAO_ADDRESS,
        addresses.VRF_ADDRESS,
    )
    await generator.waitForDeployment()
    console.log('Generator redeployed!')
    const generatorAddress = await generator.getAddress()

    const collection = await hardhat.ethers.getContractAt(
        'GraviolaCollection',
        addresses.COLLECTION_ADDRESS,
    )

    const tx = await collection.setGenerator(generatorAddress)
    await tx.wait()
    console.log(`Generator address (${generatorAddress}) set in Collection!`)

    editAddress('GENERATOR_ADDRESS', generatorAddress)
    console.log(`Generator address (${generatorAddress}) saved!`)
}

async function redeploySeasonsGovernor() {
    const SeasonsGovernor = await hardhat.ethers.getContractFactory(
        'GraviolaSeasonsGovernor',
    )
    const seasonsGovernor = await SeasonsGovernor.deploy(
        addresses.SEASONS_ARCHIVE_ADDRESS,
        addresses.TOKEN_ADDRESS,
    )
    console.log('Seasons Governor redeployed!')

    const seasonsGovernorAddress = await seasonsGovernor.getAddress()

    const archive = await hardhat.ethers.getContractAt(
        'GraviolaSeasonsArchive',
        addresses.SEASONS_ARCHIVE_ADDRESS,
    )

    const tx = await archive.setSeasonsGovernor(seasonsGovernorAddress)
    await tx.wait()
    console.log(`Generator address (${seasonsGovernorAddress}) set in Archive!`)

    editAddress('SEASONS_GOVERNOR_ADDRESS', seasonsGovernorAddress)
    console.log(`SeasonsGovernor address (${seasonsGovernorAddress}) saved!`)
}
main()
