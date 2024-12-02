import { useState } from "react"
import CardGenerateDetails from "./CardGenerateDetails"
import CardGenerateImage from "./CardGenerateImage"
import cl from "clsx"
import type { Card } from "../../../types/Card"
import CardImage from "../CardImage"

interface Props {
    card: Card | undefined
    keywords: string[]
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
                <CardImage card={card} breathingEffect={true} size="medium" />
            )}
            <CardGenerateDetails keywords={keywords} />
        </div>
    )
}

export default CardGenerate
