import { useState } from "react"
import Link from "../Link"
import Logo from "../../assets/logo.webp"
import useTheme from "../../hooks/useTheme"
import NavItemText from "./NavItemText"
import { LightThemeIcon, DarkThemeIcon } from "../ui/ThemeIcons"
import NavElement from "./NavElement"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../../router"
import { clsx as cl } from "clsx"
import NavListDesktop from "./NavList"

const Navbar = () => {
    const navigate = useNavigate()
    const [theme, toggleTheme] = useTheme(true)
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)

    const navItems: React.ReactNode[] = [

        <NavElement onClick={() => navigate(routerPaths.generate)}>
            <NavItemText text="Generator" />
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.collection)}>
            <NavItemText text="Collection" />
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.tradeup)}>
            <NavItemText text="Trade Up" />
        </NavElement>,

        // <NavElement onClick={() => navigate(routerPaths.accouncement)}>
        //     <NavItemText text="🎉 Announcement 🎉" />
        // </NavElement>,

        <NavElement>
            <Link
                text="GitHub"
                href="https://github.com/el-tumero/graviola"
                openInNewTab={true}
                additionalClasses="opacity-75 hover:opacity-100 hover:no-underline"
            />
        </NavElement>,

        <NavElement>
            <div
                className={cl(
                    "flex justify-center items-center",
                    "w-6 h-6 cursor-pointer",
                    "opacity-75 hover:opacity-100"
                )}
                onClick={() => toggleTheme()}
            >
                {theme === "dark" ? (
                    <LightThemeIcon />
                ) : (
                    <DarkThemeIcon />
                )}
            </div>
        </NavElement>
    ]

    return (
        <div className={cl(
            "sticky z-[10]",
            "flex justify-between items-center backdrop-blur-lg",
            "border-b border-light-border dark:border-dark-border",
            "top-0 bg-b w-screen py-3 px-[5%]",
            "select-none font-content",
        )}>
            <div
                className="flex justify-center items-center gap-2 cursor-pointer"
                onClick={() => navigate(routerPaths.root)}
            >
                <div className={cl(
                    "flex justify-center items-center",
                    "w-12 h-12 p-2.5 rounded-lg",
                    "bg-light-border dark:bg-dark-border"
                )}>
                    <img className="w-full h-auto" src={Logo} />
                </div>
                <NavItemText
                    text={"GraviolaNFT"}
                    additionalClasses={"font-bold text-accent opacity-100"}
                />
            </div>

            <div className="max-lg:hidden lg:visible">
                <NavListDesktop navItems={navItems} />
            </div>

            {/* Mobile navbar right panel */}
            <div
                className="max-lg:visible lg:hidden flex items-center w-12 h-max px-2"
                onClick={() => setMobileListVisible(!mobileListVisible)}
            >
                <svg
                    className="h-fit text-light-text dark:text-dark-text hover:cursor-pointer"
                    fill="none"
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="Menu / Hamburger_MD">
                        <path
                            id="Vector"
                            d="M5 17H19M5 12H19M5 7H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </svg>

                {mobileListVisible && (
                    <div
                        className={`flex flex-col gap-4 transition-opacity duration-200 ${mobileListVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}
                    >
                        <NavListDesktop navItems={navItems} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
