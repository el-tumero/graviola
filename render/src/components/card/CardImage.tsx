import React from "react"
import type { Card } from "../../types/Card"
import cl from "clsx"
import { convertCidToUrl } from "../../utils/convertCidToUrl"
import { rarityBoxShadow, rarityToColor } from "../../utils/rarity"
import type { CardImageSize } from "./card"

interface Props {
    card: Card
    breathingEffect: boolean
    size?: CardImageSize
}

const CardImage: React.FC<Props> = ({
    card,
    breathingEffect,
    size = "small",
}) => {
    const { image, rarity } = card

    const style = {
        "--rarity-color": rarityToColor(rarity),
    } as React.CSSProperties

    return (
        <div
            style={style}
            className={cl(
                "flex",
                size === "medium" && "w-36 h-36",
                size === "medium" && "w-52 h-52",
                size === "large" && "w-64 h-64",
                "p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border",
                "border-light-border dark:border-dark-border select-none",
                "shadow-card",
                rarityBoxShadow[rarity],
                breathingEffect && "breathing-effect",
            )}
        >
            <img
                className={"w-full h-full rounded-lg"}
                crossOrigin="anonymous"
                src={convertCidToUrl(image)}
                alt="Card image"
            />
        </div>
    )
}

export default CardImage
