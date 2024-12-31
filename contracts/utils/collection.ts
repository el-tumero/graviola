import { toUtf8Bytes } from 'ethers'
import hardhat from 'hardhat'

export async function transfer(
    tokenIndex: number,
    addresses: Record<string, string>,
) {
    const signers = await hardhat.ethers.getSigners()
    const collection = await hardhat.ethers.getContractAt(
        'GraviolaCollection',
        addresses['COLLECTION_ADDRESS'],
    )

    const tokenId = await collection.tokenByIndex(tokenIndex)

    await (
        await collection.transferFrom(signers[0], signers[1], tokenId)
    ).wait()
}
