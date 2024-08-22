import { TransactionStatus } from "../types/TransactionStatus"

export type TxStatusMessagesMap = Record<TransactionStatus, string>

export const tradeUpTxStatusMessages: TxStatusMessagesMap = {
    NONE: "Select TradeUp components and click 'Trade'",
    PREP_AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    PREP_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    PREP_WAIT: "Transaction confirmed. Preparing the TradeUp...",
    PREP_READY: "TradeUp complete! Adding metadata...",
    GEN_AWAIT_CONFIRM: "",
    GEN_REJECTED: "",
    GEN_WAIT: "Hang tight! It's almost ready.",
    DONE: "",
    ERROR: "An error occurred. Please check the popup for more info.",
}

export const generateTxStatusMessages: TxStatusMessagesMap = {
    NONE: "Ready to roll your new NFT?",
    PREP_AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    PREP_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    PREP_WAIT: "Transaction confirmed. Waiting for the seed...",
    PREP_READY: "Seed is ready! It's time to generate!",
    GEN_AWAIT_CONFIRM: "Waiting for transaction confirmation...",
    GEN_REJECTED:
        "Either something went wrong or the transaction was rejected. Care to try again?",
    GEN_WAIT: "Hang tight! It's almost ready.",
    DONE: "",
    ERROR: "An error occurred. Please check the popup for more info.",
}

export const TransactionStatusEnum = {
    NONE: 0,
    PREP_AWAIT_CONFIRM: 1,
    PREP_REJECTED: 2,
    PREP_WAIT: 3,
    PREP_READY: 4,
    GEN_AWAIT_CONFIRM: 5,
    GEN_REJECTED: 6,
    GEN_WAIT: 7,
    DONE: 8,
    ERROR: 9,
} as const
