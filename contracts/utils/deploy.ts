import deployLocal from './deploy-local'
import { writeFileSync } from 'fs'
import hardhat from 'hardhat'
import sendRpcCall from './rpcCall'
import deployTestnet from './deploy-testnet'
import { generateN } from './generate'

const config = {
    // Local dev (hardhat)
    localhost: {
        output: 'addresses-local.json',
        script: deployLocal,
    },

    testnet: {
        output: 'addresses-testnet.json',
        script: deployTestnet,
    },
}

type Variant = keyof typeof config

function isVariant(variant: string): variant is Variant {
    if (Object.keys(config).includes(variant)) return true
    return false
}

async function main() {
    try {
        const variant = process.env.HARDHAT_NETWORK

        if (!variant) {
            throw Error(
                `Variant not provided! Available variants: ${Object.keys(config).toString()}`,
            )
        }

        if (!isVariant(variant)) {
            throw Error(
                `Invalid deploy variant! Available variants: ${Object.keys(config).toString()}`,
            )
        }

        await hardhat.run('compile')

        const { output, script } = config[variant]

        const addresses = await script()

        writeFileSync(output, JSON.stringify(addresses, null, 4))
        console.log(`Addresses saved to '${output}'`)

        await hardhat.run('typechain')
        console.log('Types generated!')

        if (variant === 'localhost') {
            await generateN(addresses, 5)
            console.log('Generated 5 collection tokens!')
            console.log('Auto-mine turned on!')
            await sendRpcCall('evm_setIntervalMining', [3000])
        }
    } catch (err) {
        console.log(err)
    }
}

main()
