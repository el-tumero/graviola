import { parseEther } from "ethers";
import { Graviola } from "../../../contracts/typechain-types/Graviola";
import { GraviolaContext } from "../contexts/GraviolaContext";
import { NFTExt } from "../pages/Generate";
import { TransactionStatus } from "../types/TransactionStatus";
import { TxStatusMessagesMap } from "../utils/statusMessages";
import { useState, useEffect, useContext } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { NFT } from "../types/NFT";
import { getRarityFromPerc } from "../utils/getRarityData";
import { RaritiesData } from "../types/RarityGroup";

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
    const [progress, setProgress] = useState<number>(0)
    const [rolledNFT, setRolledNFT] = useState<NFTExt | undefined>()

    // Automatically update Tx status messages based on status
    useEffect(() => {
        setTxMsg(txMessages[txStatus])
    }, [txStatus])

    // Trigger a tx popup and handle user action
    const requestGen = async () => {
        setTxStatus("AWAIT_CONFIRM")
        const estFee: bigint = await contract.estimateFee()
        try {
            const tx = await contract.mint({
                value: estFee + parseEther("0.01"),
            })
            const receipt = await tx.wait()
            if (receipt) {
                console.log("[useGenerate] tx.receipt OK")
                setTxStatus("BEFORE_MINT")
                setProgress(20)
            }
        } catch (err) {
            setTxStatus("REJECTED")
            setTimeout(() => setTxStatus("NONE"), ERR_TIMEOUT_MS)
            return
        }
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
        setProgress(50)
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
        setProgress(100)
        setRolledNFT(nftRes)
    }

    return {
        txStatus,
        txMsg,
        progress,
        rolledNFT,

        requestGen,
        initCallbacks,
        disableCallbacks,
    }
}