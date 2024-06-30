import { parseEther, toBigInt } from "ethers";
import { Graviola } from "../../../contracts/typechain-types/Graviola";
import { GraviolaContext } from "../contexts/GraviolaContext";
import { NFTExt } from "../pages/Generate";
import { TransactionStatus } from "../types/TransactionStatus";
import { TxStatusMessagesMap } from "../utils/statusMessages";
import { useState, useEffect, useContext } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { NFT } from "../types/NFT";
import { getRarityFromPerc } from "../utils/getRarityData";
import { PopupBase } from "../components/Popup";
import { RaritiesData } from "../types/RarityGroup";
import { ContractTransactionResponse } from "ethers";

type TradeUpArgs = number[]

// TODO: Add a timer feature after the tx.receit() arrives. If we go beyond 4-5 mintues,
// Display a warning popup or provide a link to tx explorer
export default function useGenerateNFT(txMessages: TxStatusMessagesMap) {

    const ERR_TIMEOUT_MS = 8000 // Tx gets rejected => wait x MS and reset tx status

    const { contract, rarities, collection } = useContext(GraviolaContext) as {
        contract: Graviola,
        rarities: RaritiesData,
        collection: NFT[]
    }
    const { address } = useWeb3ModalAccount()
    const [callbacksInit, setCallbacksInit] = useState<boolean>(false)

    const [txStatus, setTxStatus] = useState<TransactionStatus>("NONE")
    const [txMsg, setTxMsg] = useState<string>(txMessages["NONE"])
    const [txPopup, setTxPopup] = useState<PopupBase>()
    const [rolledNFT, setRolledNFT] = useState<NFTExt | undefined>()

    // Automatically update Tx status messages based on status
    useEffect(() => {
        setTxMsg(txMessages[txStatus])
    }, [txStatus])

    // Tx function
    const txFunc = async (tradeupArgs?: TradeUpArgs) => {
        const estFee: bigint = await contract.estimateFee()
        console.log('estfee ', estFee)
        let tx: ContractTransactionResponse | null = null
        console.log("[useGenerate] tx init. mode: ", tradeupArgs ? "trade up" : "generate")
        try {
            if (tradeupArgs) {
                const args: bigint[] = tradeupArgs.map((id) => toBigInt(id))
                tx = await contract.tradeUp(
                    [args[0], args[1], args[2]],
                    { value: estFee + parseEther("0.015") }
                )
            } else {
                tx = await contract.mint({
                    value: parseEther("0.015"),
                    gasLimit: 900_000
                })
            }
            const receipt = await tx.wait()
            if (receipt) {
                console.log("[useGenerate] tx receipt OK")
                setTxStatus("BEFORE_MINT")
            }
        } catch (error) {
            const errMsg = ((error as Error).message.length > 64)
                ? (error as Error).message.substring(0, 64) + " (...)"
                : (error as Error).message
            console.error("[useGenerate] err during tx init: ", errMsg)
            setTxPopup({
                type: "err",
                message: `An error occurred. Message: ${errMsg}`
            })
            setTimeout(() => setTxStatus("NONE"), ERR_TIMEOUT_MS)
            setTxStatus("REJECTED")
        }
    }

    // This should be called by main button: "Generate" or "Trade up"
    const requestGen = async (tradeupData?: TradeUpArgs) => {
        setTxStatus("AWAIT_CONFIRM")
        await txFunc(tradeupData)
    }

    const initCallbacks = () => {
        if (callbacksInit) {
            console.warn("[useGenerate] Can't init callbacks more than once")
            return
        }
        setCallbacksInit(true)
        contract.on(contract.filters.Mint, onMint)
        contract.on(contract.filters.TokenReady, onTokenReady)
        console.log("[useGenerate] callbacks init OK")
    }

    const disableCallbacks = () => {
        if (!callbacksInit) return
        contract.off(contract.filters.Mint, onMint)
        contract.off(contract.filters.TokenReady, onTokenReady)
        console.log("[useGenerate] callbacks disable OK")
        setCallbacksInit(false)
    }

    const onMint = (addr: string, tokenId: bigint) => {
        if (addr != address) return
        console.log(`[useGenerate] onMint: tokenId ${tokenId}`)
        setTxStatus("MINTED")
    }

    const onTokenReady = async (addr: string, tokenId: bigint) => {
        if (addr != address) return // Don't eavesdrop other people's drops
        console.log(`[useGenerate] onTokenReady: tokenId ${Number(tokenId)}`)

        const uri = await contract.tokenURI(tokenId)
        const response = await fetch(uri)
        const nextIdx = collection.length
        const nftData = await response.json()
        const [rLevel, rData] = getRarityFromPerc(nftData.attributes[0].value, rarities)

        const nftBase: NFT = {
            id: nextIdx,
            ...nftData,
        }

        const nftRes: NFTExt = {
            rarityLevel: rLevel,
            rarityData: rData,
            ...nftBase,
        }
        console.log("[useGenerate] nftRes: ", JSON.stringify(nftRes, null, 4)) // DEBUG

        setTxStatus("DONE")
        setRolledNFT(nftRes)
    }

    const closePopup = () => {
        setTxPopup(undefined)
    }

    return {
        txStatus,
        txMsg,
        txPopup,
        rolledNFT,

        requestGen,
        initCallbacks,
        disableCallbacks,
        closePopup,
    }
}