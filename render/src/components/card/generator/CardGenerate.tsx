import CardGenerateDetails from "./CardGenerateDetails"
import CardGenerateImage from "./CardGenerateImage"
import cl from "clsx"
import type { Card, Keyword } from "@graviola/core"
import CardImage from "../CardImage"
import "../card.css"
import { GenerationPhase } from "../../generator/generator"

interface Props {
    card: Card | undefined
    keywords: Keyword[]
    phase: number
}

const animationPhase = (phase: number) => {
    switch (phase) {
        case GenerationPhase.NONE:
            return "card-init"
        case GenerationPhase.PREPARE_LOAD:
        case GenerationPhase.GENERATE_LOAD:
        case GenerationPhase.PREPARE_COMPLETE:
            return "card-loading"
        case GenerationPhase.GENERATE_COMPLETE:
            return "card-init"
        default:
            return "card-init"
    }
}

const CardGenerate: React.FC<Props> = ({ card, keywords, phase }) => {
    return (
        <div
            className={cl(
                "card",
                animationPhase(phase),
                "border border-light-border dark:border-dark-border",
                "bg-light-bgDark dark:bg-stone-950",
            )}
        >
            {!card ? (
                <CardGenerateImage size="medium" />
            ) : (
                <div className="animate-fadeIn">
                    <CardImage
                        card={card}
                        breathingEffect={false}
                        size="medium"
                    />
                </div>
            )}
            <CardGenerateDetails keywords={keywords} />
        </div>
    )
}

export default CardGenerate
