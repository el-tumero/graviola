import { useState } from "react"
import { TransactionStatus } from "../types/TransactionStatus"
import { TransactionStatusEnum } from "../utils/statusMessages"

export default function useTransactionStatus(): [
    TransactionStatus,
    (newTxStatus: TransactionStatus) => void,
] {
    const [txStatus, _setTxStatus] = useState<TransactionStatus>("NONE")

    function setTxStatus(newTxStatus: TransactionStatus) {
        if (
            TransactionStatusEnum[newTxStatus] > TransactionStatusEnum[txStatus]
        ) {
            _setTxStatus(newTxStatus)
        }
    }

    return [txStatus, setTxStatus]
}
