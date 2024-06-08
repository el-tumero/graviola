import { createContext } from "react"
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola"
import { NFT } from "../types/NFT"
import { RaritiesData } from "../types/RarityGroup"

interface GraviolaContextInterface {
    contract: Graviola | null
    collection: NFT[] | null
    rarities: RaritiesData | null
}

export const GraviolaContext = createContext<GraviolaContextInterface>({
    contract: null,
    collection: null,
    rarities: null,
})
