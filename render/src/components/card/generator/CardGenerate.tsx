import { useState } from "react"
import CardGenerateDetails from "./CardGenerateDetails"
import CardGenerateImage from "./CardGenerateImage"
import cl from "clsx"

interface Props {
    keywords: string[]
}

const CardGenerate: React.FC<Props> = ({ keywords }) => {
    return (
        <div
            className={cl(
                "p-8 rounded-xl",
                "border border-light-border dark:border-dark-border",
            )}
        >
            <CardGenerateImage size="medium" />
            <CardGenerateDetails keywords={keywords} />
        </div>
    )
}

export default CardGenerate
