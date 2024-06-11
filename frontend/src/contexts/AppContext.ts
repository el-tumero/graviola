import { createContext } from "react"
import { Theme } from "../types/Theme"

interface AppContextInterface {
    theme: Theme | null
    toggleTheme: () => void
}

export const AppContext = createContext<AppContextInterface>({
    theme: null,
    toggleTheme: () => {},
})
