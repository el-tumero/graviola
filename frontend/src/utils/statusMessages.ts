import { TransactionStatus } from "../types/TransactionStatus"

export const tradeUpTxStatusMessages: Record<TransactionStatus, string> = {
    NONE: "Select TradeUp components and click 'Trade'",
    AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    REJECTED: "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Transaction confirmed. Preparing the TradeUp...",
    MINTED: "TradeUp complete! Adding metadata...",
    FINISHING: "Hang tight! It's almost ready.",
    DONE: "",
}

export const generateTxStatusMessages: Record<TransactionStatus, string> = {
    NONE: "Ready to roll your new NFT?",
    AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    REJECTED: "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Transaction confirmed. Preparing to mint...",
    MINTED: "Minting successful. Adding metadata...",
    FINISHING: "Hang tight! It's almost ready.",
    DONE: "",
}
