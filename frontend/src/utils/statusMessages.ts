import { TransactionStatus } from "../types/TransactionStatus"

export const tradeUpTxStatusMessages: Record<
    TransactionStatus,
    string
> = {
    WALLET_NOT_CONNECTED: "Connect your wallet first!",
    NONE: "Are you ready for some upgrade?",
    CONFIRM_TX: "Waiting for transaction confirmation...",
    TX_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Trade up process started...",
    MINTED: "Old NFTs are being converted into new fresh token...",
    WAIT_IMAGE: "Your image is almost ready!",
    DONE: "",
}

export const generateTxStatusMessages: Record<TransactionStatus, string> = {
    WALLET_NOT_CONNECTED: "Connect your wallet fist!",
    NONE: "Ready to mint your new NFT?",
    CONFIRM_TX: "Waiting for transaction confirmation...",
    TX_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Gearing up for the minting process. Hang tight!",
    MINTED: "Minting successful. Adding the finishing touches to your NFT...",
    WAIT_IMAGE: "Your image is almost ready!",
    DONE: "",
}
