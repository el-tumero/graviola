import {
    tradeUpTxStatusMessages,
    TxStatusMessagesMap,
} from "../utils/statusMessages"
import { useState, useEffect } from "react"
import { NFT } from "../types/NFT"
import { PopupBase } from "../components/Popup"
import useWallet from "./useWallet"
import { AddressLike, isError } from "ethers"
import useTransactionStatus from "./useTransactionStatus"
import useLocalStorage from "./useLocalStorage"

type TradeUpArgs = bigint[]

export default function useGenerateNFT(txMessages: TxStatusMessagesMap) {
    // const ERR_TIMEOUT_MS = 8000 // Tx gets rejected => wait x MS and reset tx status

    const { address, generatorContract, collectionContract } = useWallet()

    const [txStatus, setTxStatus] = useTransactionStatus()

    const [txMsg, setTxMsg] = useState<string>(txMessages["NONE"])
    const [txPopup, setTxPopup] = useState<PopupBase>()
    const [rolledNFT, setRolledNFT] = useState<NFT | undefined>()

    const [requestId, setRequestId, clearRequestId] =
        useLocalStorage<bigint>("requestId")

    // Automatically update Tx status messages based on status
    useEffect(() => {
        console.log("status:", txStatus)
        setTxMsg(txMessages[txStatus])
    }, [txStatus])

    useEffect(() => {
        if (!address) return
        initCallbacks()
        return () => disableCallbacks()
    }, [address])

    useEffect(() => {
        ;(async () => {
            if (requestId) {
                const requestStatus =
                    await generatorContract.getRequestStatus(requestId)
                console.log(requestStatus)

                if (requestStatus === 4n) {
                    clearRequestId()
                    setTxStatus("NONE")
                    return
                }

                if (requestStatus > 1n) {
                    setTxStatus("PREP_READY")
                }
            }
        })()
    }, [requestId])

    // Tx function
    const txFunc = async (tradeupArgs?: TradeUpArgs) => {
        console.log(
            "[useGenerate] tx init. mode: ",
            tradeupArgs ? "trade up" : "generate",
        )
        try {
            if (txStatus == "NONE") {
                await prepare()
            }

            if (txStatus == "PREP_READY") {
                if (requestId === undefined) {
                    throw Error("No requestId provided for generate call!")
                }
                if (tradeupArgs) {
                    await tradeUp(requestId, tradeupArgs)
                } else {
                    await generate(requestId)
                }
            }
        } catch (error) {
            console.error("[useGenerate] err during tx init:", error)
            if (isError(error, "UNKNOWN_ERROR")) {
                // @ts-ignore
                const revertData = error.error?.data?.data
                if (revertData === "0x" || revertData === null) {
                    setTxPopup({
                        type: "err",
                        message: `An error occurred. Message: ${error.error?.message}`,
                    })
                    return
                }

                const decodedError =
                    generatorContract.interface.parseError(revertData)
                if (decodedError) {
                    setTxPopup({
                        type: "err",
                        message: `An error occurred. ${decodedError.name}`,
                    })
                }
            }

            const errMsg =
                (error as Error).message.length > 64
                    ? (error as Error).message.substring(0, 64) + " (...)"
                    : (error as Error).message
            setTxPopup({
                type: "err",
                message: `An error occurred. Message: ${errMsg}`,
            })
        }
    }

    // This should be called by main button: "Generate" or "Trade up"
    const requestGen = async (tradeupData?: TradeUpArgs) => {
        await txFunc(tradeupData)
    }

    const prepare = async () => {
        const estimatedServiceFee = await generatorContract.estimateServiceFee()

        const tx = await generatorContract.prepare({
            value: estimatedServiceFee * 2n,
            gasLimit: 1_000_000,
        })
        setTxStatus("PREP_AWAIT_CONFIRM")

        const receipt = await tx.wait()
        if (receipt) {
            const events = receipt.logs.map((log) =>
                generatorContract.interface.parseLog(log),
            )
            const foundEvent = events.find(
                (event) => event?.name === "RequestVRFSent",
            )
            if (foundEvent) {
                setRequestId(foundEvent.args[1])
            }

            console.log("[useGenerate] prepare tx - receipt OK")
            setTxStatus("PREP_WAIT")
        }
    }

    const generate = async (requestId: bigint) => {
        const tx = await generatorContract.generate(requestId, {
            gasLimit: 2_000_000,
        })
        setTxStatus("GEN_AWAIT_CONFIRM")

        const receipt = await tx.wait()
        if (receipt) {
            console.log("[useGenerate] generate tx - receipt OK")
            setTxStatus("GEN_WAIT")
        }
    }

    const tradeUp = async (requestId: bigint, tradeupArgs: bigint[]) => {
        const tx = await generatorContract.tradeUp(requestId, tradeupArgs, {
            gasLimit: 2_200_000,
        })
        setTxStatus("GEN_AWAIT_CONFIRM")

        const receipt = await tx.wait()
        if (receipt) {
            console.log("[useGenerate] tradeup tx - receipt OK")
            setTxStatus("GEN_WAIT")
        }
    }

    const initCallbacks = () => {
        generatorContract.on(
            generatorContract.filters.RequestVRFFulfilled,
            onVRFResponse,
        )

        collectionContract.on(
            collectionContract.filters.ImageAdded,
            onImageAdded,
        )

        console.log(`[useGenerate] callbacks init OK, address ${address}`)
    }

    const disableCallbacks = () => {
        generatorContract.removeAllListeners()
        collectionContract.removeAllListeners()
        console.log("[useGenerate] callbacks disable OK")
    }

    const onVRFResponse = async (initiator: AddressLike, requestId: bigint) => {
        console.log("VRF!!!")
        if (initiator !== address) return
        setRequestId(requestId)
        setTxStatus("PREP_READY")
        console.log(`[useGenerate] onVRFResponse: requestId ${requestId}`)
    }

    const onImageAdded = async (tokenId: bigint, tokenOwner: AddressLike) => {
        if (tokenOwner !== address) return

        console.log(`[useGenerate] onImageAdded: tokenId ${Number(tokenId)}`)

        const uri = await collectionContract.tokenURI(tokenId)
        const metadata = await (await fetch(uri)).json()

        const nftBase: NFT = {
            id: tokenId,
            ...metadata,
        }

        setRolledNFT(nftBase)
        setTxStatus("DONE")
    }

    const closePopup = () => {
        setTxPopup(undefined)
    }

    return {
        txStatus,
        txMsg,
        txPopup,
        rolledNFT,
        requestId,

        requestGen,
        closePopup,
    }
}
