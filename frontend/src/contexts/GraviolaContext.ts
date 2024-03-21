import { createContext } from "react";
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola";
import { NFT } from "../types/NFT";
import { RarityLevel, RarityGroupData } from "../types/Rarity";

interface GraviolaContextInterface {
    contract: Graviola | null
    collection: NFT[] | null
    rarities: Record<RarityLevel, RarityGroupData> | null
}

export const GraviolaContext = createContext<GraviolaContextInterface>({
    contract: null,
    collection: null,
    rarities: null,
})