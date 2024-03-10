import { createContext } from "react";
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola";
import { NFT } from "../types/NFT";
import { Keyword } from "../types/Keyword";

interface GraviolaContextInterface {
    contract: Graviola | null
    collection: NFT[] | null
    keywords: Keyword[] | null
}

export const GraviolaContext = createContext<GraviolaContextInterface>({
    contract: null,
    collection: null,
    keywords: null
})