import { useWeb3ModalTheme } from "@web3modal/ethers/react"
import { useEffect } from "react"
import { Theme, setTheme } from "../redux/reducers/theme"
import { useAppSelector, useAppDispatch } from "../redux/hooks"

export default function useTheme(web3ModalLoaded: boolean): {
    theme: Theme
    toggleTheme: () => void
} {

    const dispatch = useAppDispatch()
    const { setThemeMode } = useWeb3ModalTheme()
    const { theme } = useAppSelector((state) => state.theme)

    useEffect(() => {
        detectTheme()
    }, [])

    useEffect(() => {
        if (!theme) return
        const bodyClassList = document.documentElement.classList
        theme === "dark"
            ? bodyClassList.add("dark")
            : bodyClassList.remove("dark")
        theme === "dark" ? setThemeMode("dark") : setThemeMode("light")
    }, [theme])

    const detectTheme = () => {
        if (theme) return
        const detectedTheme = window.matchMedia("(prefers-color-scheme:dark)")
            .matches
            ? "dark"
            : "light"
        web3ModalLoaded && setThemeMode(detectedTheme)
        dispatch(setTheme(detectedTheme))
    }

    const toggleTheme = () => {
        const invertedTheme = theme === "dark" ? "light" : "dark"
        dispatch(setTheme(invertedTheme))
        web3ModalLoaded && setThemeMode(invertedTheme)
        localStorage.setItem("theme", invertedTheme)
    }

    return {
        theme,
        toggleTheme,
    }
}
