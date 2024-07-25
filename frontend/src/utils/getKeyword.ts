import { RarityGroupData, RarityLevel } from "../types/Rarity"
import { RaritiesData } from "../types/RarityGroup"

// Get sorted keyword data from absolute index (e.g. 80 => 3rd Uncommon keyword)
export const getKeyword = (
    absIdx: number,
    rarities: RaritiesData,
): [string, RarityGroupData] => {
    if (absIdx < 0 || absIdx > 99) {
        console.error(
            "Absolute index out of bounds - can't get keyword. Defaulting to 99. Input: ",
            absIdx,
        )
        absIdx = 99
    }
    for (const rarityLevel of Object.keys(rarities).sort(
        (a, b) =>
            rarities[b as RarityLevel].startRange -
            rarities[a as RarityLevel].endRange,
    ) as RarityLevel[]) {
        if (absIdx >= rarities[rarityLevel].startRange) {
            const group = rarities[rarityLevel]
            const relIdx = absIdx - group.startRange
            return [group.keywords[relIdx], group]
        }
    }
    throw Error(
        "Index does not match any keyword in collection. Input possibly out of bounds.",
    )
}
