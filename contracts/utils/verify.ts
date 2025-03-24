import hardhat from 'hardhat'
import { checkbox, input } from '@inquirer/prompts'
import addresses from '../addresses-testnet.json'

type VerifyConfigEntry = {
    address: string
    constructorArguments: string[]
}

type VerifyConfig = Record<string, VerifyConfigEntry>

async function main() {
    const answer = await checkbox({
        message: 'Select contracts to verify',
        choices: Object.entries(config()).map(([contractName, entry]) => ({
            name: contractName,
            value: () => verify(contractName, entry),
        })),
    })

    console.log('Verification process start...')
    for (let i = 0; i < answer.length; i++) {
        await answer[i]()
    }
}

const config = (): VerifyConfig => ({
    Collection: {
        address: addresses.COLLECTION_ADDRESS,
        constructorArguments: [
            addresses.MIGRATOR_ADDRESS,
            addresses.OAO_ADDRESS,
        ],
    },
    KeywordsVault: {
        address: addresses.KEYWORDS_VAULT_ADDRESS,
        constructorArguments: [],
    },
    Generator: {
        address: addresses.GENERATOR_ADDRESS,
        constructorArguments: [
            addresses.KEYWORDS_VAULT_ADDRESS,
            addresses.COLLECTION_ADDRESS,
            addresses.OAO_ADDRESS,
            addresses.VRF_ADDRESS,
        ],
    },
    CollectionReadProxy: {
        address: addresses.COLLECTION_READ_PROXY_ADDRESS,
        constructorArguments: [
            addresses.COLLECTION_ADDRESS,
            addresses.SCHEMA_ADDRESS,
        ],
    },
    Migrator: {
        address: addresses.MIGRATOR_ADDRESS,
        constructorArguments: [],
    },
    Schema: {
        address: addresses.SCHEMA_ADDRESS,
        constructorArguments: [],
    },
})

const verify = async (contractName: string, entry: VerifyConfigEntry) => {
    console.log(`Verifying ${contractName}...`)
    await hardhat.run('verify:verify', {
        address: entry.address,
        constructorArguments: entry.constructorArguments,
    })
}

main()
