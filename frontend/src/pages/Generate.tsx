import { useEffect, useContext } from "react"
import GenerateContainer from "../components/ui/layout/GenerateContainer"
import Navbar from "../components/nav/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { NFT } from "../types/NFT"
import { clsx as cl } from "clsx"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { generateTxStatusMessages } from "../utils/statusMessages"
import SectionTitle from "../components/ui/layout/SectionTitle"
import { Graviola } from "../../../contracts/typechain-types/Graviola"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { RaritiesData } from "../types/RarityGroup"
import { routerPaths } from "../router"
import { useNavigate } from "react-router-dom"
import PageTitle from "../components/ui/layout/PageTitle"
import useGenerateNFT from "../hooks/useGenerateNFT"

// Extended NFT interface to avoid computing the same properties multiple times
export interface NFTExt extends NFT {
    rarityLevel: RarityLevel
    rarityData: RarityGroupData
}

const Generate = () => {
    const navigate = useNavigate()
    const {
        contract,
        rarities: rGroups,
        collection,
    } = useContext(GraviolaContext) as {
        contract: Graviola
        rarities: RaritiesData
        collection: NFT[]
    }
    const { isConnected } = useWeb3ModalAccount()

    // Gen data
    const {
        txStatus,
        txMsg,
        progress,
        rolledNFT,
        requestGen,
        initCallbacks,
        disableCallbacks,
    } = useGenerateNFT(generateTxStatusMessages)

    // Handle generate callbacks
    useEffect(() => {
        initCallbacks()
        return () => disableCallbacks()
    }, [])

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center">
                    <PageTitle title="NFT Generator" />

                    <GenerateContainer rolledNFT={rolledNFT} runBorderAnim={!rolledNFT} rGroups={rGroups} />

                    {/* Status text */}
                    <div className={cl("flex w-fit h-fit p-3 rounded-xl text-lg", "border border-light-border dark:border-dark-border")}>
                        {rolledNFT ? (
                            <p>
                                Congratulations! You rolled a&nbsp;
                                <span
                                    style={{
                                        color: rolledNFT.rarityData.color,
                                        borderBottomWidth: 1,
                                        borderBottomColor: rolledNFT.rarityData.color,
                                    }}
                                    className="font-bold"
                                >
                                    {rolledNFT.rarityLevel}
                                </span>
                                &nbsp;NFT!!!
                            </p>
                        ) : isConnected ? (
                            <p>{txMsg}</p>
                        ) : (
                            <p>Connect your wallet first</p>
                        )}
                    </div>

                    {/* Progress bar */}
                    {(progress !== 0) && (
                        <div className={`w-1/2 h-3 rounded-xl border border-light-border dark:border-dark-border`}>
                            <div
                                style={{ width: `${progress}%` }}
                                className={cl(
                                    "flex h-full rounded-xl",
                                    "bg-gradient-to-r from-accentDark via-accent to-accentDark",
                                    "transition-all duration-300",
                                )}
                            />
                        </div>
                    )}

                    {isConnected && txStatus === "NONE" && (
                        <Button
                            text={"Generate!"}
                            disabled={!isConnected || txStatus !== "NONE"}
                            onClick={() => requestGen()}
                        />
                    )}
                </div>

                <SectionTitle additionalClasses="max-sm:justify-center max-sm:items-center" title={"Keywords"} />

                <div className="sm:inline-grid md:grid-cols-5 max-sm:flex-col max-md:grid-cols-2 max-sm:flex gap-4 w-auto font-bold mx-auto">
                    {Object.entries(rGroups).map(([, rGroup], i) => (
                        <div key={i} className="flex flex-col gap-3 w-full h-full items-center">
                            <div className="flex flex-col w-fit h-fit gap-3">
                                <p
                                    className="text-lg w-fit font-thin font-content"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: rGroup.color,
                                    }}
                                >
                                    {rGroup.name}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {rGroup.keywords.slice(0, 6).map((keyword, idx, arr) => {
                                        const isLastItem = idx === arr.length - 1
                                        return (
                                            <span
                                                key={idx}
                                                className={cl(
                                                    "flex justify-center items-center w-fit p-2",
                                                    "font-thin font-content",
                                                    "rounded-xl bg-light-bgPrimary/25 dark:bg-dark-bgPrimary/25",
                                                )}
                                                style={{
                                                    borderWidth: 1,
                                                    borderRadius: 6,
                                                    borderColor: rGroup.color,
                                                }}
                                            >
                                                {isLastItem ? "..." : keyword.name}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={cl(
                        "flex w-full h-fit justify-end items-center p-3 mt-3",
                        "rounded-xl border border-light-border dark:border-dark-border",
                    )}
                >
                    <Button text="See all Keywords" onClick={() => navigate(routerPaths.home)} />
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Generate
