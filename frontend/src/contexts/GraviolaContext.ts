import { createContext } from "react";
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola";

// TEMP
interface NFTAttributes {
    trait_type: string
    value: number
}

export interface NFT {
    image: string
    description: string
    attributes: Array<NFTAttributes>
}

interface GraviolaContextInterface {
    contract: Graviola | null
    collection: NFT[] | null
}

export const GraviolaContext = createContext<GraviolaContextInterface>({
    contract: null,
    collection: null
})