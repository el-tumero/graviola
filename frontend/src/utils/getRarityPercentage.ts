import { RarityLevel } from "../types/rarity";
import { rarities, rarityScale } from "../rarityData";

export function getRarityPercentageString(rarityLevel: RarityLevel) {
    const index = rarityScale.findIndex(level => level === rarityLevel)
    if (index === 0) {
      return `${(100 - rarities[rarityLevel as RarityLevel].threshold).toString()}%`
    } else if (index === rarityScale.length - 1) {
        const beforeLast = rarityScale[rarityScale.length - 2]
      return `<${rarities[beforeLast].threshold.toString()}%`
    } else {
      return `${rarities[rarityScale[index]].threshold}%`
    }
}