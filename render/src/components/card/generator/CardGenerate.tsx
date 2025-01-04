import CardGenerateDetails from "./CardGenerateDetails"
import CardGenerateImage from "./CardGenerateImage"
import cl from "clsx"
import type { Card, Keyword } from "@graviola/core"
import CardImage from "../CardImage"

interface Props {
    card: Card | undefined
    keywords: Keyword[]
}

const CardGenerate: React.FC<Props> = ({ card, keywords }) => {
    return (
        <div
            className={cl(
                "p-8 rounded-xl",
                "border border-light-border dark:border-dark-border",
            )}
        >
            {!card ? (
                <CardGenerateImage size="medium" />
            ) : (
                <div className="animate-fadeIn">
                    <CardImage
                        card={card}
                        breathingEffect={true}
                        size="medium"
                    />
                </div>
            )}
            <CardGenerateDetails keywords={keywords} />
        </div>
    )
}

export default CardGenerate
