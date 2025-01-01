import React from "react"
import CardGenerateKeyword from "./CardGenerateKeyword"
import type { Keyword } from "@graviola/core"

interface Props {
    keywords: Keyword[]
}

const blankKeyword: Keyword = {
    name: "",
    rarity: "common",
}

const CardGenerateDetails: React.FC<Props> = ({ keywords }) => {
    return (
        <div className="mt-8">
            <CardGenerateKeyword keyword={keywords[0] ?? blankKeyword} />
            <CardGenerateKeyword keyword={keywords[1] ?? blankKeyword} />
            <CardGenerateKeyword keyword={keywords[2] ?? blankKeyword} />
        </div>
    )
}

export default CardGenerateDetails
