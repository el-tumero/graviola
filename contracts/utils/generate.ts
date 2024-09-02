import { toUtf8Bytes } from 'ethers'
import hardhat from 'hardhat'

export async function generate(
    requestId: number,
    addresses: Record<string, string>,
) {
    const vrfPromise = hardhat.ethers.getContractAt(
        'VRFV2PlusWrapperMock',
        addresses['VRF_ADDRESS'],
    )
    const oaoPromise = hardhat.ethers.getContractAt(
        'AIOracleMock',
        addresses['OAO_ADDRESS'],
    )
    const generatorPromise = hardhat.ethers.getContractAt(
        'GraviolaGenerator',
        addresses['GENERATOR_ADDRESS'],
    )

    const [vrf, oao, generator] = await Promise.all([
        vrfPromise,
        oaoPromise,
        generatorPromise,
    ])

    const cid = toUtf8Bytes('QmTjUY4rQLrgv8tjedXoXDmXRtahL1bcFVK64jnTkiVGEn')

    await (await generator.prepare({ value: 200000 })).wait()
    await (await vrf.fulfillRandomWords(requestId)).wait()
    await (await generator.generate(requestId)).wait()
    await (await oao.invokeNextCallback(cid)).wait()
}

export async function generateN(addresses: Record<string, string>, n: number) {
    for (let i = 0; i < n; i++) {
        await generate(i, addresses)
    }
}
