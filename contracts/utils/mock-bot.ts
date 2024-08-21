import hardhat from 'hardhat'
import addresses from '../addresses-local.json'
import { ethers } from 'ethers'

const IMG_CID = 'QmTjUY4rQLrgv8tjedXoXDmXRtahL1bcFVK64jnTkiVGEn'

async function main() {
    const generator = await hardhat.ethers.getContractAt(
        'GraviolaGenerator',
        addresses.GENERATOR_ADDRESS,
    )
    const vrf = await hardhat.ethers.getContractAt(
        'VRFV2PlusWrapperMock',
        addresses.VRF_ADDRESS,
    )
    const oao = await hardhat.ethers.getContractAt(
        'AIOracleMock',
        addresses.OAO_ADDRESS,
    )

    console.log('Listening to events...')

    generator.on(
        generator.filters.RequestVRFSent,
        async (initiator: ethers.AddressLike, requestId: bigint) => {
            const tx = await vrf.fulfillRandomWords(requestId)
            const recp = await tx.wait()
            if (recp?.status === 1) {
                console.log(`Request id: ${requestId} - VRF fulfilled`)
            } else {
                console.log(`Request id: ${requestId} - VRF failed`)
            }
        },
    )

    generator.on(
        generator.filters.RequestOAOSent,
        async (initiator: ethers.AddressLike, requestId: bigint) => {
            const tx = await oao.invokeNextCallback(IMG_CID)
            const recp = await tx.wait()
            if (recp?.status === 1) {
                console.log(`Request id: ${requestId} - OAO fulfilled`)
            } else {
                console.log(`Request id: ${requestId} - OAO failed`)
            }
        },
    )
}

main()
