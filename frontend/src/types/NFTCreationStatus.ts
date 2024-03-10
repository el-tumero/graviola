
export type NFTCreationStatus = "NONE" | "BEFORE_MINT" | "MINTED" | "WAIT_IMAGE" | "DONE"

export const nftCreationStatusMessages: Record<NFTCreationStatus, string> = {
    NONE: "Connect your wallet and generate your NFT",
    BEFORE_MINT: "Before mint msg",
    MINTED: "Minted msg",
    WAIT_IMAGE: "We're preparing your awesome NFT...",
    DONE: ""
}