import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { clsx as cl } from "clsx"
import ContentContainer from "../components/ui/layout/ContentContainer"
import Navbar from "../components/nav/Navbar"
import PageTitle from "../components/ui/layout/PageTitle"
import { useState } from "react"
import icons from "../data/icons"
import { rarities, rarityColors, RarityLevel } from "../data/rarities"
import useArchive from "../hooks/useArchive"

interface RarityGroupData {
    rarity: RarityLevel
    minWeight: number
    maxWeight: number
    keywordWeight: number
    keywords: string[]
    unfolded: boolean
}

const KeywordGroupBlock = (props: {
    data: RarityGroupData
    blockStateSetter: () => void
}) => {
    return (
        <div
            style={{
                borderWidth: 1,
                borderColor: rarityColors[props.data.rarity],
            }}
            className={cl(
                "flex flex-col gap-1.5",
                "p-4 rounded-xl",
                "h-fit w-fit min-w-32",
            )}
        >
            <div className={cl("flex flex-col gap-3")}>
                {/* Title & Fold Button*/}
                <div className={cl("flex justify-between items-center gap-6")}>
                    <p className="font-medium">
                        {props.data.rarity} ({props.data.keywords.length})
                    </p>
                    <div
                        className={cl(
                            "w-6 h-6 cursor-pointer",
                            props.data.unfolded && "rotate-90",
                        )}
                        onClick={() => props.blockStateSetter()}
                    >
                        {icons.arrow}
                    </div>
                </div>

                {/* Weight, Min NFT Weight sum */}
                <div className={cl("flex justify-between items-center w-full select-none")}>
                    <div className="flex justify-center items-center">
                        <div className="w-6 h-6">{icons.weight}</div>
                        <span>{props.data.keywordWeight}</span>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="flex justify-center items-center gap-1 font-mono">
                            min: <div className="w-6 h-6">{icons.weight}</div>
                        </div>
                        <span>{props.data.minWeight}</span>
                    </div>
                </div>
            </div>

            {/* Keyword list (unfolded) */}
            <div
                className={cl(
                    props.data.unfolded
                        ? "visible mt-3"
                        : "invisible h-0 overflow-hidden",
                )}
            >
                <ul
                    className={cl(
                        "flex flex-col divide-y",
                        "divide-light-text/15 dark:divide-dark-text/15",
                        "px-1 rounded-lg",
                        "bg-light-bgLight/50 dark:bg-dark-bgLight/50",
                    )}
                >
                    {props.data.keywords.map(
                        (keyword: string, idx: number) => (
                            <li key={idx} className={cl("px-3 py-1.5")}>
                                {keyword}
                            </li>
                        ),
                    )}
                </ul>
            </div>
        </div>
    )
}

const Keywords = () => {

    const { weights, groupSizes, keywords } = useArchive()
    const [groupBlocks, setGroupBlocks] = useState<Record<string, RarityGroupData>>(() => {
        const res: Record<string, RarityGroupData> = {}
        let startIndex = 0
    
        rarities.forEach((rarity: RarityLevel, idx: number) => {
            const endIndex = startIndex + groupSizes[idx]
            res[rarity] = {
                rarity,
                minWeight: 0,
                maxWeight: 0,
                keywords: keywords.slice(startIndex, endIndex),
                keywordWeight: weights[idx],
                unfolded: false,
            }
            startIndex = endIndex
        })
        return res
    })

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col">
                <PageTitle title="Keywords" additionalClasses="mb-10" />

                <div
                    className={cl(
                        "flex w-full h-fit justify-end items-center p-3 mt-3",
                        "rounded-xl",
                    )}
                >
                    <div className="flex w-full gap-1.5 justify-start items-center">
                        <div className="p-2 bg-light-border dark:bg-dark-border rounded-lg">
                            <div className="w-6 h-6">{icons.weight}</div>
                        </div>
                        <p>
                            Weight — this value represents how heavy a keyword
                            is. Each groups&apos; keywords have their weights.
                            For an NFT to be of certain Rarity, it needs to have
                            at least the &quot;min&quot; weight sum value.
                        </p>
                    </div>
                </div>

                <div
                    className={cl(
                        "flex gap-3 justify-between items-start",
                        "w-full h-fit p-4",
                        "max-lg:grid max-lg:grid-cols-3",
                        "max-md:grid-cols-2",
                        "max-sm:flex max-sm:flex-col",
                    )}
                >
                    {Object.values(groupBlocks).map(
                        (rarityGroupData: RarityGroupData, idx: number) => (
                            <div key={idx}>
                                <KeywordGroupBlock
                                    data={rarityGroupData}
                                    blockStateSetter={() => {
                                        setGroupBlocks(prevGroupBlocks => ({
                                            ...prevGroupBlocks,
                                            [rarityGroupData.rarity]: {
                                                ...prevGroupBlocks[rarityGroupData.rarity],
                                                unfolded: !prevGroupBlocks[rarityGroupData.rarity].unfolded
                                            }
                                        }))
                                    }}
                                />
                            </div>
                        ),
                    )}
                </div>
            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Keywords
