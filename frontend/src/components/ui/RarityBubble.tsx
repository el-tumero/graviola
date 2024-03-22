import { RarityGroupData } from "../../types/Rarity"

interface RarityBubbleProps {
    rarityGroup: RarityGroupData
    additionalClasses?: string
}

const RarityBubble = ({ rarityGroup, additionalClasses }: RarityBubbleProps) => {
    return (
        <div style={{ backgroundColor: rarityGroup.color }} className={`flex w-4 h-4 rounded-xl ${additionalClasses}`}></div>
    )
}

export default RarityBubble