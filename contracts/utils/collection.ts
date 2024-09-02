import { toUtf8Bytes } from 'ethers'
import hardhat from 'hardhat'

export async function transfer(
    tokenId: number,
    addresses: Record<string, string>,
) {
    const signers = await hardhat.ethers.getSigners()
    const collection = await hardhat.ethers.getContractAt(
        'GraviolaCollection',
        addresses['COLLECTION_ADDRESS'],
    )

    await (
        await collection.transferFrom(signers[0], signers[1], tokenId)
    ).wait()
}
