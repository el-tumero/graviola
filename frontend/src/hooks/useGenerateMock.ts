import { useContext, useState, useEffect } from "react";
import { GraviolaContext } from "../contexts/GraviolaContext";
import { NFTExt } from "../pages/Generate";
import { RaritiesData } from "../types/RarityGroup";
import { TransactionStatus } from "../types/TransactionStatus";
import { getRarityFromPerc } from "../utils/getRarityData";
import { TxStatusMessagesMap } from "../utils/statusMessages";
import { fallbackNFT } from "../data/fallbacks";
import { formatBpToPercentage } from "../utils/format";

/**
 * Mock hook for offline UX testing and error handling by the web
 * Step 0 = Accept tx
 * Step 1 = Preparing to mint
 * Step 2 = onMint callback mock
 * Step 3 = "Almost ready"
 * Step 4 = Result display, state
 * 
 * Calling with Step 1 on 'false' and Step 2 on 'true' will
 * always terminate the mock job on Step 1 and return the Error
 */

type MockStepsBehavior = Array<boolean>
interface MockBehaviorSettings {
    performSteps: MockStepsBehavior
    doNotResetOnError?: boolean
}

export default function useGenerateMock(txMessages: TxStatusMessagesMap, behavior: MockBehaviorSettings) {

    const MOCK_STEP_TIMEOUT_MS = 7000 // Time between steps
    const RESET_ON_ERR_TIMEOUT_MS = 15000

    const {
        rarities: rGroups,
    } = useContext(GraviolaContext) as {
        rarities: RaritiesData
    }

    const [txStatus, setTxStatus] = useState<TransactionStatus>("NONE")
    const [txMsg, setTxMsg] = useState<string>(txMessages["NONE"])
    const [progress, setProgress] = useState<number>(0)
    const [rolledNFT, setRolledNFT] = useState<NFTExt | undefined>()

    // Automatically update Tx status messages based on status
    useEffect(() => {
        setTxMsg(txMessages[txStatus])
    }, [txStatus])

    // Tx function
    const txFunc = () => {

        console.log("[useGenerate MOCK] tx init.")
        let run = true

        run = requireStep(0, "REJECTED")

        setTimeout(() => {
            if (!run) return
            console.log("[useGenerate MOCK] tx receipt OK")
            setTxStatus("BEFORE_MINT")
            setProgress(20)
            run = requireStep(1, "ERROR")
        }, MOCK_STEP_TIMEOUT_MS)

        setTimeout(() => {
            if (!run) return
            console.log("[useGenerate MOCK] onMint tick")
            setTxStatus("MINTED")
            setProgress(50)
            run = requireStep(2, "ERROR")
        }, MOCK_STEP_TIMEOUT_MS * 2);

        setTimeout(() => {
            if (!run) return
            console.log("[useGenerate MOCK] onFinishing")
            setTxStatus("FINISHING")
            setProgress(75)
            run = requireStep(3, "ERROR")
        }, MOCK_STEP_TIMEOUT_MS * 3);

        setTimeout(() => {
            if (!run) return
            console.log("[useGenerate MOCK] nft Res")
            setTxStatus("DONE")
            setProgress(100)
            const perc = formatBpToPercentage(fallbackNFT.attributes[0].value)
            const [rLevel, rData] = getRarityFromPerc(perc, rGroups)
            const mockNFTRes: NFTExt = {
                ...fallbackNFT,
                rarityLevel: rLevel,
                rarityData: rData,
            }
            setRolledNFT(mockNFTRes)
        }, MOCK_STEP_TIMEOUT_MS * 4)
    }

    const requireStep = (i: number, errStatus: TransactionStatus): boolean => {
        if (!behavior.performSteps[i]) {
            console.error(`[useGenerate MOCK] Err (behavior[${i}] is 'false')`)
            setTxStatus(errStatus)
            if (behavior.doNotResetOnError) return false
            cleanup()
            return false
        }
        return true
    }

    const cleanup = () => {
        setTimeout(() => {
            setTxStatus("NONE")
        }, RESET_ON_ERR_TIMEOUT_MS)
    }

    const requestGen = async () => {
        if (behavior.performSteps.length === 0 || behavior.performSteps.length < 4) {
            console.error('[useGenerate MOCK] invalid behavior arg')
            return
        }
        console.log("[useGenerate MOCK] requestGen")
        setTxStatus("AWAIT_CONFIRM")
        txFunc()
    }

    return {
        txStatus,
        txMsg,
        progress,
        rolledNFT,
        requestGen,
    }
}