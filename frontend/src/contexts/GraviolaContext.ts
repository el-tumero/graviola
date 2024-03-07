import { createContext } from "react";
import { Graviola } from "../../../contracts/typechain-types/contracts/Graviola";

interface GraviolaContextInterface {
    contract: Graviola | null
}

export const GraviolaContext = createContext<GraviolaContextInterface>({
    contract: null
})