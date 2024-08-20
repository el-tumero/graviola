import { TransactionStatus } from "../types/TransactionStatus"

export type TxStatusMessagesMap = Record<TransactionStatus, string>

export const tradeUpTxStatusMessages: TxStatusMessagesMap = {
    NONE: "Select TradeUp components and click 'Trade'",
    PRE_AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    PRE_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    PRE_WAIT: "Transaction confirmed. Preparing the TradeUp...",
    PRE_READY: "TradeUp complete! Adding metadata...",
    GEN_AWAIT_CONFIRM: "",
    GEN_REJECTED: "",
    GEN_WAIT: "Hang tight! It's almost ready.",
    DONE: "",
    ERROR: "An error occurred. Please check the popup for more info.",
}

export const generateTxStatusMessages: TxStatusMessagesMap = {
    NONE: "Ready to roll your new NFT?",
    PRE_AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    PRE_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    PRE_WAIT: "Transaction confirmed. Waiting for the seed...",
    PRE_READY: "Seed is ready! It's time to generate!",
    GEN_AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    GEN_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    GEN_WAIT: "Hang tight! It's almost ready.",
    DONE: "",
    ERROR: "An error occurred. Please check the popup for more info.",
}
