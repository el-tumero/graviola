import { useEffect, useContext } from "react"
import GenerateContainer from "../components/ui/layout/GenerateContainer"
import Navbar from "../components/nav/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { NFT } from "../types/NFT"
import { clsx as cl } from "clsx"
import { GraviolaContext } from "../contexts/GraviolaContext"
import Popup from "../components/Popup"
import { generateTxStatusMessages } from "../utils/statusMessages"
import { Graviola } from "../../../contracts/typechain-types/GraviolaMain.sol"
import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { RaritiesData } from "../types/RarityGroup"
import { routerPaths } from "../router"
import { useNavigate } from "react-router-dom"
import PageTitle from "../components/ui/layout/PageTitle"
import useGenerateNFT from "../hooks/useGenerateNFT"

import useWeb3 from "../hooks/useWallet"

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

    const { isConnected } = useWeb3()

    // // MOCK
    // const mockBehavior = {
    //     performSteps: [false, true, true, true],
    //     doNotResetOnError: false
    // }
    // const {
    //     txStatus,
    //     txMsg,
    //     txErr,
    //     rolledNFT,
    //     requestGen,
    //     closeTxErr
    // } = useGenerateMock(generateTxStatusMessages, mockBehavior)

    // Gen data
    const {
        txStatus,
        txMsg,
        txPopup,
        rolledNFT,
        requestGen,
        initCallbacks,
        disableCallbacks,
        closePopup,
    } = useGenerateNFT(generateTxStatusMessages)

    // Handle generate callbacks
    useEffect(() => {
        initCallbacks()
        return () => disableCallbacks()
    }, [])

    return (
        <FullscreenContainer>
            <Navbar />

            <Popup
                type="err"
                onClickClose={closePopup}
                message={txPopup?.message}
            />

            <ContentContainer additionalClasses="flex-col gap-4">
                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center">
                    <PageTitle title="NFT Generator" />

                    <div className={cl("my-3")}>
                        <GenerateContainer
                            rolledNFT={rolledNFT}
                            runBorderAnim={!rolledNFT}
                            rGroups={rGroups}
                        />
                    </div>

                    <div
                        className={cl(
                            "flex w-full h-fit justify-between items-center p-3 mt-3",
                            "rounded-xl border border-light-border dark:border-dark-border",
                            "mb-3",
                        )}
                    >
                        <div data-testid="generate-status">
                            {rolledNFT ? (
                                <p data-testid="generate-success">
                                    Congratulations! You rolled a&nbsp;
                                    <span
                                        style={{
                                            color: rolledNFT.rarityData.color,
                                            borderBottomWidth: 1,
                                            borderBottomColor:
                                                rolledNFT.rarityData.color,
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

                        <span data-testid="generate-btn">
                            <Button
                                text={"Generate!"}
                                disabled={!isConnected || txStatus !== "NONE"}
                                onClick={() => requestGen()}
                            />
                        </span>
                    </div>
                </div>

                {/* TODO: Add marquee of randomly-selected keywords with the caption: Keywords you can enroll */}

                <div
                    className={cl(
                        "flex w-full h-fit justify-end items-center p-3 mt-3",
                        "rounded-xl",
                    )}
                >
                    <Button
                        text="See all Keywords"
                        onClick={() => navigate(routerPaths.keywords)}
                    />
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Generate
