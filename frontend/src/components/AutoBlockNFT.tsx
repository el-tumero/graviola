import { useState, useEffect } from "react"
import { Status } from "../types/Status"
import { clsx as cl } from "clsx"
import { NFT } from "../types/NFT"
import BlockNFT from "./BlockNFT"
import { useAppSelector } from "../redux/hooks"

const NFT_AMOUNT = 5 // 5 is sweet spot
const AUTO_CHANGE_TIME_INTERVAL_MS = 5000 // 5s

const AutoBlockNFT = () => {
    const collection = useAppSelector(
        (state) => state.graviolaData.collection,
    ) as NFT[]

    const [status, setStatus] = useState<Status>("loading")
    const [randomNFTs, setRandomNFTs] = useState<NFT[]>([])
    const [activeNFT, setActiveNFT] = useState<number>(-1)
    const [blockAutoChange, setBlockAutoChange] = useState<boolean>(false)

    useEffect(() => {
        const clonedCollection = JSON.parse(JSON.stringify(collection))
        const shuffled = clonedCollection.sort(() => 0.5 - Math.random())
        const randNfts = shuffled.slice(0, NFT_AMOUNT)
        if (status !== "ready") {
            setRandomNFTs(randNfts)
            setActiveNFT(0)
            setStatus("ready")
        }
    }, [collection])

    useEffect(() => {
        if (status !== "ready" || blockAutoChange) return

        const autoChangeInterval = setInterval(() => {
            const nextIdx =
                activeNFT === randomNFTs.length - 1 ? 0 : activeNFT + 1
            setActiveNFT(nextIdx)
        }, AUTO_CHANGE_TIME_INTERVAL_MS)

        return () => clearInterval(autoChangeInterval)
    }, [status, activeNFT, blockAutoChange, randomNFTs.length])

    // If the contract has less than NFT_AMOUNT nfts, show the fallbacks instead.
    // const targetNFTList: NFT[] = shouldUseFallbackNFTList
    //     ? fallbackNFTsRarityList
    //     : randomNFTs
    const targetNFTList = randomNFTs

    return status !== "ready" ? (
        <div>
            <p>...</p>
        </div>
    ) : (
        <div className="flex max-sm:flex-col gap-1 h-full justify-center items-center">
            <div
                className={cl(
                    "flex flex-col max-sm:flex-row flex-grow gap-5 justify-center items-center p-4 mr-1",
                )}
            >
                {targetNFTList.map((_: NFT, idx) => {
                    return (
                        <div
                            key={idx}
                            className={cl(
                                "w-3 h-3 rounded-full cursor-pointer",
                                "transition-colors duration-300",
                                "hover:bg-light-text dark:hover:bg-dark-text",
                                idx === activeNFT
                                    ? "bg-light-text dark:bg-dark-text"
                                    : "bg-light-text/25 dark:bg-dark-text/25",
                            )}
                            onClick={() => {
                                setActiveNFT(idx)
                                setBlockAutoChange(true)
                            }}
                        />
                    )
                })}
            </div>
            <div className="w-64 h-64 relative">
                {randomNFTs.map((nft, idx) => (
                    <div
                        key={idx}
                        className={cl(
                            "absolute top-0 left-0 w-full h-full transition-opacity duration-600",
                            idx === activeNFT ? "opacity-100" : "opacity-0",
                        )}
                    >
                        <BlockNFT
                            nftData={nft}
                            glowColor="auto"
                            additionalClasses="w-full h-full"
                            disableMetadataOnHover
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AutoBlockNFT
