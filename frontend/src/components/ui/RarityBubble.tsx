import { RarityLevel } from "../../types/Rarity"
import { getRarityColor } from "../../utils/getRarityBorder"

interface RarityBubbleProps {
    rarity: RarityLevel
    additionalClasses?: string
}

const RarityBubble = ({ rarity, additionalClasses }: RarityBubbleProps) => {
    const rarityColor = getRarityColor(rarity)
    return (
        <div style={{ backgroundColor: rarityColor }} className={`flex w-4 h-4 rounded-xl ${additionalClasses}`}></div>
    )
}

export default RarityBubble