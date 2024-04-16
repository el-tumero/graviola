import Button from "../components/ui/Button";
import FullscreenContainer from "../components/ui/FullscreenContainer";
import ContentContainer from "../components/ui/ContentContainer";
import Navbar from "../components/Navbar";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useContext, useEffect, useState } from "react";
import { GraviolaContext } from "../contexts/GraviolaContext";
import { NFT } from "../types/NFT";
import { RaritiesData } from "../types/RarityGroup";
import { ethers, toBigInt } from "ethers";
import { formatBpToPercentage, getRarityFromPerc } from "../utils/getRarityDataFromThreshold";
import BlockNFT from "../components/ui/BlockNFT";
import { convertToIfpsURL } from "../utils/convertToIpfsURL";
import ResultText from "../components/ui/ResultText";
import { RarityLevel } from "../types/Rarity";
import GenerateContainer from "../components/GenerateContainer";
import { NFTCreationStatus, nftCreationStatusMessages } from "../types/NFTCreationStatus";
import { NFTExt } from "./Generate";
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola";
import { parseEther } from "ethers";
// import { fallbackNFT } from "../utils/fallbackNFT";

const TradeUp = () => {

    const graviolaContext = useContext(GraviolaContext)
    const { isConnected, address } = useWeb3ModalAccount()
    const rGroups = graviolaContext.rarities as RaritiesData
    const contractNFTs = graviolaContext.collection as NFT[]

    // const contractNFTs: NFT[] = Array(16).fill(fallbackNFT) // DEBUG

    const [ownedTokenIds, setOwnedTokensIds] = useState<Array<number>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [progressState, setProgressState] = useState<NFTCreationStatus>("NONE")
    const [progressMessage, setProgressMessage] = useState<string>(nftCreationStatusMessages["NONE"])
    const [progressBarVal, setProgressBarVal] = useState<number>(0)
    const [rolledNFT, setRolledNFT] = useState<NFTExt>()
    const isPreGenerationState = ["NONE", "CONFIRM_TX", "TX_REJECTED"].includes(progressState)

    // TradeUp logic
    const [selectedIds, setSelectedIds] = useState<Array<number>>([])
    const [selectedGroup, setSelectedGroup] = useState<RarityLevel | null>(null)

    // Generation state listener
    const progressListener = () => {
        if (!isConnected) return
        const graviola = graviolaContext.contract as Graviola

        const onMint = (addr: string, tokenId: bigint) => {
            console.log(`[info] onMint: addr ${addr}, tokenId ${tokenId}`)
            setProgressState("MINTED")
            setProgressBarVal(50)
        }

        const onTokenReady = async (addr: string, tokenId: bigint) => {

            console.log(`[info] onTokenReady: addr ${addr}, tokenId ${tokenId}`)

            // TODO: CHECK ADDRESS OF ROLLER
            const uri = await graviola.tokenURI(tokenId)
            const response = await fetch(uri)
            const nft: NFT = await response.json()
            const [rarityLevel, rarityData] = getRarityFromPerc(formatBpToPercentage(nft.attributes[0].value), rGroups)

            setProgressState("DONE")
            setProgressBarVal(100)

            const nftRes: NFTExt = {
                ...nft,
                rarityLevel: rarityLevel,
                rarityData: rarityData,
            }

            setRolledNFT(nftRes)
        }

        graviola.on(graviola.filters.Mint, onMint)
        graviola.on(graviola.filters.TokenReady, onTokenReady)

        return () => {
            graviola.off(graviola.filters.Mint, onMint)
            graviola.off(graviola.filters.TokenReady, onTokenReady)
        }

    }

    // Fetch contract collections on mount, wallet connect, address change etc
    useEffect(() => {
        (async () => {
            let userOwnedTokens
            if (address) {
                userOwnedTokens = await graviolaContext.contract?.ownedTokens(ethers.getAddress(address))
            }
            userOwnedTokens && userOwnedTokens.forEach(token => {
                setOwnedTokensIds(prev => [...prev, Number(token)])
            })
            // console.log(ownedTokensIds)
            setIsLoading(false)
        })()
    }, [isConnected, address])

    // Init listeners for the contract
    useEffect(() => {
        progressListener()
    }, [])

    // Progress state text updater
    useEffect(() => {
        setProgressMessage(nftCreationStatusMessages[progressState])
    }, [progressState])

    return (
        <FullscreenContainer additionalClasses="text-2xl">
            <Navbar />

            <ContentContainer additionalClasses="flex-col h-auto grow overflow-y-hidden">

                {(isLoading)
                    ? <p className="self-center my-2">Loading...</p>
                    : (!isConnected)
                        ? <p className="self-center my-2">You need to connect your wallet to perform a Trade Up</p>
                        :
                        <>
                            <div className="flex flex-col gap-4 w-full h-fit justify-center items-center mt-28 mb-14">
                                <h1 className='font-bold text-2xl'>Trade Up</h1>
                            </div>

                            <div className="flex flex-col gap-2 h-[65%]">
                                <div className="flex w-full h-full gap-4">

                                    {/* LEFT PANEL (ALL OWNED NFTS) */}
                                    <div className="flex w-2/3 bg-light-bgPrimary dark:bg-dark-bgDark rounded-xl overflow-y-hidden p-4">

                                        <div className="flex w-full h-full overflow-y-auto rounded-xl">
                                            <div className="grid grid-cols-3 auto-rows-min gap-4">
                                                {contractNFTs.map((nft: NFT, i) => {
                                                    const percRarity = formatBpToPercentage(nft.attributes[0].value)
                                                    const keywordsArray: string[] = (nft.description.split(":").pop()!.trim()).split(",")
                                                    const keywords: string[] = keywordsArray.map(keyword => keyword.trim())
                                                    const [rarityLevel, rarityData] = getRarityFromPerc(percRarity, rGroups)

                                                    if (selectedGroup !== null && selectedGroup !== rarityLevel) {
                                                        return null
                                                    } else if (!ownedTokenIds.includes(i)) {
                                                        return null
                                                    } else {
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`
                                                                    relative flex w-fit h-fit flex-col justify-center items-center
                                                                    gap-2 bg-light-bgLight/50 dark:bg-dark-bgLight/50
                                                                    border-2 border-light-border dark:border-dark-border
                                                                    p-4 rounded-xl
                                                                `}
                                                            >
                                                                <p className={`
                                                                    absolute top-0 left-0 p-2 z-10
                                                                    rounded-xl bg-light-bgPrimary dark:bg-dark-bgPrimary
                                                                    border border-light-border dark:border-dark-border
                                                                `}>
                                                                    id: {i}
                                                                </p>
                                                                <div
                                                                    className={`
                                                                        p-px hover:cursor-pointer
                                                                        ${selectedIds.includes(i)
                                                                            ? "brightness-50 hover:brightness-50"
                                                                            : "hover:brightness-110"}
                                                                        `}
                                                                    style={{ borderRadius: 16, borderWidth: 2, borderColor: rarityData.color }}
                                                                    onClick={() => {
                                                                        const indexOf = selectedIds.indexOf(i)
                                                                        if (indexOf !== -1) {
                                                                            if (selectedIds.length === 1) setSelectedGroup(null)
                                                                            setSelectedIds(prev => prev.filter((_id) => i !== _id))
                                                                            return
                                                                        }
                                                                        if (selectedIds.length === 0) {
                                                                            setSelectedGroup(rarityLevel)
                                                                        }
                                                                        if (selectedIds.length >= 3) return
                                                                        setSelectedIds(prev => [...prev, i])
                                                                    }}
                                                                >
                                                                    <BlockNFT
                                                                        src={convertToIfpsURL(nft.image)}
                                                                        glow={false}
                                                                        disableMargin={true}
                                                                        additionalClasses={`w-fit h-fit max-w-[14em]`}
                                                                    />

                                                                </div>
                                                                <div className="flex flex-col gap-2 justify-center items-center">
                                                                    {/* Keywords */}
                                                                    <div className="flex flex-wrap gap-1 justify-center items-center">
                                                                        {keywords.map((keyword: string) => {
                                                                            return (
                                                                                <div
                                                                                    className={`
                                                                            rounded-lg py-1 px-2 border
                                                                            bg-light-bgPrimary dark:bg-dark-bgPrimary
                                                                            border-light-border dark:border-dark-border
                                                                        `}>
                                                                                    <p>{keyword}</p>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })}

                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT PANEL (SELECTED NFTS / RESULT) */}
                                    <div className={`
                                        flex w-1/3 h-full flex-col gap-4 p-4
                                        justify-center items-center
                                        bg-light-bgDark dark:bg-dark-bgDark
                                        rounded-xl
                                    `}>
                                        {
                                            (rolledNFT) ?
                                                <GenerateContainer
                                                    rolledNFT={rolledNFT}
                                                    isPulsating={!isConnected}
                                                    isGenerating={!isPreGenerationState}
                                                    rGroups={rGroups}
                                                />
                                                :
                                                (selectedIds.length === 0)
                                                    ? <p className="mx-4 text-center">Select the Graviola NFTs you want to trade</p>
                                                    : selectedIds.map((id, i) => {
                                                        const percRarity = formatBpToPercentage(contractNFTs[id].attributes[0].value)
                                                        const [, rarityData] = getRarityFromPerc(percRarity, rGroups)
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`
                                                                    relative flex justify-center items-center
                                                                    flex-[1_1_auto] max-w-full max-h-[12em]
                                                                    h-auto grow
                                                                    bg-light-bgLight/50 dark:bg-dark-bgLight/50
                                                                    border-2 border-light-border dark:border-dark-border
                                                                    rounded-xl aspect-square`
                                                                }
                                                                onClick={() => {
                                                                    const indexOf = selectedIds.indexOf(id)
                                                                    console.log(indexOf)
                                                                    if (indexOf !== -1) {
                                                                        if (selectedIds.length === 1) setSelectedGroup(null)
                                                                        setSelectedIds(prev => prev.filter((_id) => id !== _id))
                                                                        return
                                                                    }
                                                                }}
                                                            >
                                                                <p className={`
                                                                    absolute top-0 left-0 m-2 p-2
                                                                    rounded-xl bg-light-bgPrimary dark:bg-dark-bgPrimary
                                                                    border border-light-border dark:border-dark-border
                                                                `}>
                                                                    id: {id}
                                                                </p>
                                                                <BlockNFT
                                                                    src={convertToIfpsURL(contractNFTs[id].image)}
                                                                    glow={true}
                                                                    disableMargin={true}
                                                                    rarityGroup={rarityData}
                                                                    additionalClasses="m-2 p-2 w-min h-min flex-1"
                                                                />
                                                            </div>
                                                        )
                                                    })
                                        }
                                    </div>

                                </div>

                                {/* BOTTOM PANEL - INFO, STATUS ETC */}

                                {/* Trade button */}
                                {(progressState === "NONE" && (selectedIds.length == 3)) &&
                                    <Button
                                        text={"Trade"}
                                        enabled={isConnected && (progressState === "NONE")}
                                        additionalClasses="self-center"
                                        onClick={async () => {
                                            setProgressState("CONFIRM_TX")
                                            setProgressBarVal(10)
                                            const estFee = await graviolaContext.contract?.estimateFee() as bigint
                                            try {
                                                const args: bigint[] = selectedIds.map((id) => toBigInt(id))
                                                const tx = await graviolaContext.contract?.tradeUp(
                                                    [args[0], args[1], args[2]],
                                                    {
                                                        value: estFee + parseEther("0.008")
                                                    }
                                                )
                                                const receipt = await tx?.wait()
                                                if (receipt) {
                                                    console.log("OK")
                                                    setProgressState("BEFORE_MINT")
                                                    setProgressBarVal(25)
                                                }
                                            } catch (err) {
                                                setProgressState("TX_REJECTED")
                                                setTimeout(() => {
                                                    setProgressState("NONE")
                                                    setProgressBarVal(0)
                                                }, 3000)
                                                return
                                            }
                                        }}
                                    />}


                                {(progressBarVal !== 0) &&
                                    <div className="flex flex-col gap-2 justify-center items-center">

                                        {/* Progress bar */}
                                        <div className={`w-1/2 h-5 rounded-xl border-2 border-light-border dark:border-dark-border shadow-inner`}>
                                            <div style={{ width: `${progressBarVal}%` }} className="flex h-full bg-accent rounded-xl transition-all duration-150"></div>
                                        </div>

                                        {/* State/Progress text */}
                                        {(progressState === "DONE")
                                            ? <ResultText rGroup={rolledNFT!.rarityData} />
                                            : <p>{progressMessage}</p>
                                        }
                                    </div>
                                }


                            </div>
                        </>

                }

            </ContentContainer>

        </FullscreenContainer>
    )
}

export default TradeUp