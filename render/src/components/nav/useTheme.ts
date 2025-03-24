import { useState } from "react"

type Theme = "light" | "dark"

const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>(
        localStorage.getItem("theme") as Theme,
    )

    const toogleTheme = () => {
        if (theme === "dark") {
            localStorage.setItem("theme", "light")
            setTheme("light")
        } else {
            localStorage.setItem("theme", "dark")
            setTheme("dark")
        }
        document.documentElement.classList.toggle(
            "dark",
            localStorage.theme === "dark",
        )
    }

    return [theme, toogleTheme]
}

export default useTheme
