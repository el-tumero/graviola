import React, { useEffect, useState } from "react"
import cl from "clsx"
import { rarityBoxShadow } from "../../../utils/rarity"
import { RarityName } from "../../../types/Rarity"
import type { CardImageSize } from "../card"
import goblin from "../../../assets/unknowngoblin.jpg"

interface Props {
    size?: CardImageSize
}

const CardImage: React.FC<Props> = ({ size = "small" }) => {
    const [boxShadow, setBoxShadow] = useState<string>("shadow-rarity-common")

    useEffect(() => {
        const id = window.setInterval(() => {
            const randomRarity = RarityName[Math.floor(Math.random() * 5)]
            setBoxShadow(rarityBoxShadow[randomRarity])
        }, 1500)
        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <div
            style={{
                transition: "box-shadow 0.75s ease-in-out",
            }}
            className={cl(
                "flex",
                size === "small" && "w-36 h-36",
                size === "medium" && "w-52 h-52",
                size === "large" && "w-64 h-64",
                "p-1 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border",
                "border-light-border dark:border-dark-border select-none",
                "shadow-card",
                boxShadow,
            )}
        >
            <img src={goblin.src} className="w-full h-full rounded-lg" alt="" />
        </div>
    )
}

export default CardImage
