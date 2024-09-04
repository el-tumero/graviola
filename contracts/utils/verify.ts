import hardhat from 'hardhat'
import { checkbox } from '@inquirer/prompts'
import addresses from '../addresses-testnet.json'

async function main() {
    const answer = await checkbox({
        message: 'Select contracts to verify',
        choices: [
            { name: 'Token', value: verifyToken },
            { name: 'SeasonsArchive', value: verifySeasonsArchive },
            { name: 'SeasonsGovernor', value: verifySeasonsGovernor },
            { name: 'Collection', value: verifyCollection },
            { name: 'Generator', value: verifyGenerator },
        ],
    })

    console.log('Verification process start...')
    for (let i = 0; i < answer.length; i++) {
        await answer[i]()
    }
}

const onwerAddress = '0x4EEf993E6C1E67c76512B18A13D57671E1f78c24'
const migratorAddress = '0x2967831d920243582352Fce2db750137ef076A4e'

async function verifyToken() {
    console.log('Verifing Token...')
    await hardhat.run('verify:verify', {
        address: addresses.TOKEN_ADDRESS,
        constructorArguments: [onwerAddress],
    })
}

async function verifySeasonsArchive() {
    console.log('Verifing SeasonsArchive...')
    await hardhat.run('verify:verify', {
        address: addresses.SEASONS_ARCHIVE_ADDRESS,
        constructorArguments: [migratorAddress],
    })
}

async function verifySeasonsGovernor() {
    console.log('Verifing SeasonsGovernor...')
    await hardhat.run('verify:verify', {
        address: addresses.SEASONS_GOVERNOR_ADDRESS,
        constructorArguments: [
            addresses.SEASONS_ARCHIVE_ADDRESS,
            addresses.TOKEN_ADDRESS,
        ],
    })
}

async function verifyCollection() {
    console.log('Verifing Collection...')
    await hardhat.run('verify:verify', {
        address: addresses.COLLECTION_ADDRESS,
        constructorArguments: [onwerAddress],
    })
}

async function verifyGenerator() {
    console.log('Verifing Generator...')
    await hardhat.run('verify:verify', {
        address: addresses.GENERATOR_ADDRESS,
        constructorArguments: [
            addresses.TOKEN_ADDRESS,
            addresses.SEASONS_ARCHIVE_ADDRESS,
            addresses.COLLECTION_ADDRESS,
            addresses.OAO_ADDRESS,
            addresses.VRF_ADDRESS,
        ],
    })
}

main()
