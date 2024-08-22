import { TxStatusMessagesMap } from "../utils/statusMessages"
import { useState, useEffect } from "react"
import { NFT } from "../types/NFT"
import { PopupBase } from "../components/Popup"
import useWallet from "./useWallet"
import { isDevMode } from "../utils/mode"
import { AddressLike } from "ethers"
import useTransactionStatus from "./useTransactionStatus"

type TradeUpArgs = number[]

// TODO: Tumer: Fix this hook (and the mock one)

// TODO: Add a timer feature after the tx.receit() arrives. If we go beyond 4-5 mintues,
// Display a warning popup or provide a link to tx explorer
export default function useGenerateNFT(txMessages: TxStatusMessagesMap) {
    // const ERR_TIMEOUT_MS = 8000 // Tx gets rejected => wait x MS and reset tx status

    const { address, generatorContract, collectionContract } = useWallet()

    // const collection = useAppSelector((state) => state.graviolaData.collection)
    const [callbacksInit, setCallbacksInit] = useState<boolean>(false)

    const [txStatus, setTxStatus] = useTransactionStatus()

    const [txMsg, setTxMsg] = useState<string>(txMessages["NONE"])
    const [txPopup, setTxPopup] = useState<PopupBase>()
    const [rolledNFT, setRolledNFT] = useState<NFT | undefined>()

    const [requestId, setRequestId] = useState<bigint | undefined>()

    // Automatically update Tx status messages based on status
    useEffect(() => {
        console.log(txStatus)
        setTxMsg(txMessages[txStatus])
    }, [txStatus])

    useEffect(() => {
        if (!address) return
        initCallbacks()
        return () => disableCallbacks()
    }, [address])

    // Fetch historical events to determine status of the generation process
    // Will be helpful if a user accidentally leaves a page
    useEffect(() => {
        if (!address) return
        ;(async () => {
            // filters
            const vrfSentEventFilter = generatorContract.filters.RequestVRFSent(
                address as string,
            )
            const vrfFulfilledEventFilter =
                generatorContract.filters.RequestVRFFulfilled(address as string)
            const oaoSentEventFilter = generatorContract.filters.RequestOAOSent(
                address as string,
            )

            const oaoFulfilledEventFilter =
                generatorContract.filters.RequestOAOFulfilled(address as string)

            // events list
            const vrfSentEvents =
                await generatorContract.queryFilter(vrfSentEventFilter)

            const vrfFulfilledEvents = await generatorContract.queryFilter(
                vrfFulfilledEventFilter,
            )

            const oaoSentEvents =
                await generatorContract.queryFilter(oaoSentEventFilter)

            const oaoFulfilledEvents = await generatorContract.queryFilter(
                oaoFulfilledEventFilter,
            )

            if (vrfSentEvents.length > vrfFulfilledEvents.length) {
                setRequestId(
                    vrfSentEvents[vrfSentEvents.length - 1].args.requestId,
                )
                setTxStatus("PREP_WAIT")
            }

            if (vrfFulfilledEvents.length > oaoSentEvents.length) {
                setRequestId(
                    vrfFulfilledEvents[vrfFulfilledEvents.length - 1].args
                        .requestId,
                )
                setTxStatus("PREP_READY")
            }

            if (oaoSentEvents.length > oaoFulfilledEvents.length) {
                setRequestId(
                    oaoSentEvents[oaoSentEvents.length - 1].args.requestId,
                )
                setTxStatus("GEN_WAIT")
            }
        })()
    }, [address])

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
                await generate(requestId)
            }
        } catch (error) {
            console.error(error)
            // if (isError(error, "UNKNOWN_ERROR")) {
            //     const errorDecoder = ErrorDecoder.create([
            //         generatorContract.interface,
            //     ])
            //     const decoded = await errorDecoder.decode(error)
            //     console.log(decoded)
            // }
            // console.log(error)
            // if(error.data )
            // const errMsg =
            //     (error as Error).message.length > 64
            //         ? (error as Error).message.substring(0, 64) + " (...)"
            //         : (error as Error).message
            // console.error("[useGenerate] err during tx init: ", error as Error)
            // setTxPopup({
            //     type: "err",
            //     message: `An error occurred. Message: ${errMsg}`,
            // })
        }
    }

    // This should be called by main button: "Generate" or "Trade up"
    const requestGen = async (tradeupData?: TradeUpArgs) => {
        await txFunc(tradeupData)
    }

    const prepare = async () => {
        const estimatedServiceFee = 101 // TODO: calculate
        const serviceFee = isDevMode ? 100000 : estimatedServiceFee

        const tx = await generatorContract.prepare({
            value: serviceFee,
            gasLimit: 200_000,
        })
        setTxStatus("PREP_AWAIT_CONFIRM")

        const receipt = await tx.wait()
        if (receipt) {
            console.log("[useGenerate] prepare tx - receipt OK")
            setTxStatus("PREP_WAIT")
        }
    }

    const generate = async (requestId: bigint) => {
        const tx = await generatorContract.generate(requestId, {
            gasLimit: 700_000,
        })
        setTxStatus("GEN_AWAIT_CONFIRM")

        const receipt = await tx.wait()
        if (receipt) {
            console.log("[useGenerate] generate tx - receipt OK")
            setTxStatus("GEN_WAIT")
        }
    }

    const initCallbacks = () => {
        if (callbacksInit) {
            console.warn("[useGenerate] Can't init callbacks more than once")
            return
        }
        setCallbacksInit(true)

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
        if (!callbacksInit) return

        generatorContract.off(
            generatorContract.filters.RequestVRFFulfilled,
            onVRFResponse,
        )
        collectionContract.off(
            collectionContract.filters.ImageAdded,
            onImageAdded,
        )
        console.log("[useGenerate] callbacks disable OK")
        setCallbacksInit(false)
    }

    const onVRFResponse = async (initiator: AddressLike, requestId: bigint) => {
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
