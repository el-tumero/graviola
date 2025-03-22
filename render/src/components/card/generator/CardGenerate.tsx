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

const CardGenerate: React.FC<Props> = ({ card, keywords, phase }) => {
    return (
        <div
            className={cl(
                "card",
                phase > GenerationPhase.NONE ? "card-loading" : "card-init",
                "border border-light-border dark:border-dark-border",
                "bg-stone-950",
                // "dark:bg-dark-bgPrimary bg-light-bgPrimary", TODO: fix this
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
