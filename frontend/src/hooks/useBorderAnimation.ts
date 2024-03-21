import { useState, useEffect } from "react"
import { getRandomRarity } from "../utils/getRarityBorder"
import { RaritiesData } from "../types/RarityGroup"

const useRandomRarityBorder = (run: boolean, ms: number, rGroups: RaritiesData): React.CSSProperties => {
    const [rarityBorder, setRarityBorder] = useState<React.CSSProperties>({})

    useEffect(() => {
        if (!run) {
            return
        }

        const interval = setInterval(() => {
            const randomRarity = getRandomRarity()
            const newBorder = {
                boxShadow: `0px 0px 32px 8px ${rGroups[randomRarity].color}`,
                WebkitBoxShadow: `0px 0px 32px 8px ${rGroups[randomRarity].color}`,
                MozBoxShadow: `0px 0px 32px 8px ${rGroups[randomRarity].color}`,
                transition: 'box-shadow 0.75s ease-in-out', // Dont change 0.6
            }
            setRarityBorder(newBorder)
        }, ms)

        return () => clearInterval(interval)
    }, [run])

    return rarityBorder
}

export default useRandomRarityBorder
