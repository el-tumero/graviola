
export type NFTCreationStatus = "NONE" | "CONFIRM_TX" | "TX_REJECTED" | "BEFORE_MINT" | "MINTED" | "WAIT_IMAGE" | "DONE"


export const nftCreationTradeUpStatusMessages: Record<NFTCreationStatus, string> = {
    NONE: "Are you ready for some upgrade?",
    CONFIRM_TX: "Waiting for transaction confirmation...",
    TX_REJECTED: "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Trade up process started...",
    MINTED: "Old NFTs are being converted into new fresh token...",
    WAIT_IMAGE: "Your image is almost ready!",
    DONE: ""
}

export const nftCreationStatusMessages: Record<NFTCreationStatus, string> = {
    NONE: "Are you ready to try your luck?",
    CONFIRM_TX: "Waiting for transaction confirmation...",
    TX_REJECTED: "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Gearing up for the minting process. Hang tight!",
    MINTED: "Minting successful. Adding the finishing touches to your NFT...",
    WAIT_IMAGE: "Your image is almost ready!",
    DONE: ""
}