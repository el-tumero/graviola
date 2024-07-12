import FullscreenContainer from "../components/ui/layout/FullscreenContainer";
import { clsx as cl } from "clsx"
import ContentContainer from "../components/ui/layout/ContentContainer";
import Navbar from "../components/nav/Navbar";
import PageTitle from "../components/ui/layout/PageTitle";
import { useContext, useState, useEffect } from "react";
import { GraviolaContext } from "../contexts/GraviolaContext";
import { RaritiesData } from "../types/RarityGroup";
import { RarityGroupData } from "../types/Rarity";

// Interface in case this grows
interface RarityGroupBlock {
    unfolded: boolean
}

const KeywordGroupBlock = (props: { gData: RarityGroupData, blockState: RarityGroupBlock, blockStateSetter: () => void }) => {
    return (
        <div style={{
            borderWidth: 1,
            borderColor: props.gData.color
        }} className={
            cl(
                "flex flex-col",
                "p-4 rounded-xl",
                "h-fit",
            )
        } >

            {/* Title & Fold Button*/}
            < div className={
                cl(
                    "flex justify-between items-center",
                    "w-full h-fit gap-9"
                )
            } >
                <p className="font-medium">{props.gData.name} ({props.gData.keywords.length})</p>
                <button onClick={() => props.blockStateSetter()}>(F)</button>
            </div >

            {/* Keyword list (unfolded) */}
            < div className={
                cl(
                    "",
                    props.blockState.unfolded ? "visible mt-3" : "invisible h-0 overflow-hidden"
                )
            } >
                <ul className={cl(
                    "flex flex-col divide-y",
                    "divide-light-text/15 dark:divide-dark-text/15",
                    "px-3 rounded-xl",
                    "bg-light-bgLight/50 dark:bg-dark-bgLight/50",
                )}>
                    {props.gData.keywords.map((keyword: string, idx: number) => (
                        <li key={idx} className={cl("py-2")}>{keyword}</li>
                    ))}
                </ul>
            </div >
        </div >
    )
}

const Keywords = () => {

    const { rarities } = useContext(GraviolaContext) as {
        rarities: RaritiesData
    }

    const [groupBlocks, setGroupBlocks] = useState<Record<string, RarityGroupBlock>>(() => {
        const res: Record<string, RarityGroupBlock> = {}
        Object.values(rarities).forEach((rData: RarityGroupData) => { res[rData.name] = { unfolded: false } })
        return res
    })

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col">

                <PageTitle title="Keywords" additionalClasses="mb-10" />

                <div className={cl(
                    "flex gap-3 justify-between items-start",
                    "w-full h-fit p-4",
                )}>

                    {Object.values(rarities).map((rarityGroupData: RarityGroupData, idx: number) => (
                        <div key={idx}>
                            <KeywordGroupBlock
                                gData={rarityGroupData}
                                blockState={groupBlocks[rarityGroupData.name]}
                                blockStateSetter={() => {
                                    const prev = groupBlocks[rarityGroupData.name]
                                    setGroupBlocks({
                                        ...groupBlocks,
                                        [rarityGroupData.name]: { unfolded: !prev.unfolded }
                                    })
                                }}
                            />
                        </div>
                    ))}
                </div>


            </ContentContainer>

        </FullscreenContainer>
    )

}

export default Keywords