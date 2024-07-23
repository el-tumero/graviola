import { TransactionStatus } from "../types/TransactionStatus"

export type TxStatusMessagesMap = Record<TransactionStatus, string>

export const tradeUpTxStatusMessages: TxStatusMessagesMap = {
    NONE: "Select TradeUp components and click 'Trade'",
    AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Transaction confirmed. Preparing the TradeUp...",
    MINTED: "TradeUp complete! Adding metadata...",
    FINISHING: "Hang tight! It's almost ready.",
    DONE: "",
    ERROR: "An error occurred. Please check the popup for more info.",
}

export const generateTxStatusMessages: TxStatusMessagesMap = {
    NONE: "Ready to roll your new NFT?",
    AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    BEFORE_MINT: "Transaction confirmed. Preparing to mint...",
    MINTED: "Minting successful. Adding metadata...",
    FINISHING: "Hang tight! It's almost ready.",
    DONE: "",
    ERROR: "An error occurred. Please check the popup for more info.",
}
