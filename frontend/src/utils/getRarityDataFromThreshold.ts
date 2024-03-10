import { RarityData, RarityLevel } from "../types/Rarity";
import { rarityScale, rarities } from "../rarityData";


export function getRarityFromThreshold(threshold: number): [RarityLevel, RarityData] {
    if (threshold > 100) threshold = 100
    if (threshold < 0) threshold = 0
    for (let rarityLevel of rarityScale) {
      const rarityData = rarities[rarityLevel]
      if (threshold >= rarityData.threshold) {
        return [rarityLevel, rarityData]
      }
    }
    return [RarityLevel.Legendary, rarities[RarityLevel.Legendary]] // This is here just for the return type
  }