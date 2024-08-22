import GenerateContainer from "../components/ui/layout/GenerateContainer"
import Navbar from "../components/nav/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { clsx as cl } from "clsx"
import Popup from "../components/Popup"
import {
    generateTxStatusMessages,
    TransactionStatusEnum,
} from "../utils/statusMessages"
import { routerPaths } from "../router"
import { useNavigate } from "react-router-dom"
import PageTitle from "../components/ui/layout/PageTitle"
import useGenerateNFT from "../hooks/useGenerateNFT"
import useWallet from "../hooks/useWallet"
import { getRarityFromScore } from "../utils/getRarityFromScore"
import useArchive from "../hooks/useArchive"
import { getRarityColorFromScore } from "../utils/getRarityColorFromScore"

const Generate = () => {
    const navigate = useNavigate()

    const { isConnected } = useWallet()

    const { weights } = useArchive()

    // Gen data
    const { txStatus, txMsg, txPopup, rolledNFT, requestGen, closePopup } =
        useGenerateNFT(generateTxStatusMessages)

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
                                            color: getRarityColorFromScore(
                                                weights,
                                                rolledNFT.attributes[1].value,
                                            ),
                                            borderBottomWidth: 1,
                                            borderBottomColor:
                                                getRarityColorFromScore(
                                                    weights,
                                                    rolledNFT.attributes[1]
                                                        .value,
                                                ),
                                        }}
                                        className="font-bold"
                                    >
                                        {getRarityFromScore(
                                            weights,
                                            rolledNFT.attributes[1].value,
                                        )}
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
                                text={
                                    TransactionStatusEnum[txStatus] < 4
                                        ? "Prepare!"
                                        : "Generate!"
                                }
                                disabled={
                                    !isConnected ||
                                    !(
                                        txStatus == "NONE" ||
                                        txStatus == "PREP_READY"
                                    )
                                }
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
