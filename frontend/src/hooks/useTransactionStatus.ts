import { useState } from "react"
import { TransactionStatus } from "../types/TransactionStatus"
import { TransactionStatusEnum } from "../utils/statusMessages"

export default function useTransactionStatus(): [
    TransactionStatus,
    (newTxStatus: TransactionStatus) => void,
] {
    const [txStatus, _setTxStatus] = useState<TransactionStatus>("NONE")

    function setTxStatus(newTxStatus: TransactionStatus) {
        _setTxStatus((prev) => {
            if (
                TransactionStatusEnum[newTxStatus] > TransactionStatusEnum[prev]
            ) {
                return newTxStatus
            }
            return prev
        })
    }

    return [txStatus, setTxStatus]
}
