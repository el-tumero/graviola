import React from "react"
import CardGenerateKeyword from "./CardGenerateKeyword"

interface Props {
    keywords: string[]
}

const CardGenerateDetails: React.FC<Props> = ({ keywords }) => {
    return (
        <div className="mt-8">
            <CardGenerateKeyword keyword={keywords[0]} />
            <CardGenerateKeyword keyword={keywords[1]} />
            <CardGenerateKeyword keyword={keywords[2]} />
        </div>
    )
}

export default CardGenerateDetails
