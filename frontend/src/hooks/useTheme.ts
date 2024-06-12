import { useWeb3ModalTheme } from "@web3modal/ethers/react"
import { useEffect, useState } from "react"
import { Theme } from "../types/Theme"

export default function useTheme(web3ModalLoaded: boolean): [Theme, () => void] {
    const { setThemeMode } = useWeb3ModalTheme()
    const [theme, setTheme] = useState<Theme | null>(localStorage.getItem("theme") as Theme)

    useEffect(() => {
        detectTheme()
    }, [])

    useEffect(() => {
        if (!theme) return
        const bodyClassList = document.documentElement.classList
        theme === "dark" ? bodyClassList.add("dark") : bodyClassList.remove("dark")
        theme === "dark" ? setThemeMode("dark") : setThemeMode("light")
    }, [theme])

    const detectTheme = () => {
        if (theme) return
        const detectedTheme = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"
        web3ModalLoaded && setThemeMode(detectedTheme)
        setTheme(detectedTheme)
    }

    const toggleTheme = () => {
        const invertedTheme = theme === "dark" ? "light" : "dark"
        setTheme(invertedTheme)
        web3ModalLoaded && setThemeMode(invertedTheme)
        localStorage.setItem("theme", invertedTheme)
    }

    return [theme!, toggleTheme]
}
