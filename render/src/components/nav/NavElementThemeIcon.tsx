import { useState } from "react"
import { cn } from "../../utils/cn"
import { Moon, Sun } from "flowbite-react-icons/outline"
import useTheme from "./useTheme"

const NavElementThemeIcon = () => {
    const [theme, toogleTheme] = useTheme()

    return (
        <div
            className={cn(
                "p-2 rounded-xl",
                "dark:text-dark-textSecondary dark:hover:text-dark-text",
                "max-lg:flex max-lg:w-full max-lg:justify-center",
                "max-lg:bg-light-border max-lg:dark:bg-dark-border",
                "hover:bg-light-text/10 dark:hover:bg-dark-text/10",
                "transition-colors duration-300",
            )}
            onClick={toogleTheme}
        >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </div>
    )
}

export default NavElementThemeIcon
