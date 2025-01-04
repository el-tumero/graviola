import { select } from '@inquirer/prompts'
import { ethers } from 'hardhat'
import { GeneratorEventTester } from '../typechain-types'

const testAddress = '0xB483B289C0b7E44cA59ed6E9Cd77E3FB3d7A4278'

async function main() {
    const GeneratorEventTester = await ethers.getContractFactory(
        'GeneratorEventTester',
    )
    const generatorEventTester = await GeneratorEventTester.deploy()

    console.log('Deployed to:', await generatorEventTester.getAddress())

    await generatorEventTester.waitForDeployment()

    while (true) {
        const answer = await select({
            message: 'Select event to trigger',
            choices: [
                { name: 'RequestVRFSent', value: 'RequestVRFSent' },
                { name: 'RequestVRFFulfilled', value: 'RequestVRFFulfilled' },
                {
                    name: 'RequestOAOSent',
                    value: 'RequestOAOSent',
                },
                {
                    name: 'RequestOAOFulfilled',
                    value: 'RequestOAOFulfilled',
                },
            ],
        })

        await triggerEvent(answer, generatorEventTester)
    }
}

async function triggerEvent(eventName: string, contract: GeneratorEventTester) {
    switch (eventName) {
        case 'RequestVRFSent':
            return await contract.triggerRequestVRFSent(testAddress, 0)
        case 'RequestVRFFulfilled':
            return await contract.triggerRequestVRFFulfilled(testAddress, 0)
        case 'RequestOAOSent':
            return await contract.triggerRequestOAOSent(testAddress, 0)
        case 'RequestOAOFulfilled':
            return await contract.triggerRequestOAOFulfilled(testAddress, 0)
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
