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
import icons from "../../icons"

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
        <div className="sticky top-0 z-30">
            <div className={cl(
                "flex flex-col",
                "w-screen backdrop-blur-xl",
                "bg-transparent",
                mobileListVisible && "border-b border-light-border dark:border-dark-border"
            )}>
                <div className={cl(
                    "flex justify-between items-center",
                    "py-3 px-[2.5%]",
                    "select-none font-content",
                    !mobileListVisible && "border-b border-light-border dark:border-dark-border"
                )}>
                    <div
                        className={cl(
                            "flex items-center gap-0.5 cursor-pointer",
                        )}
                        onClick={() => navigate(routerPaths.root)}
                    >
                        <div className={cl(
                            "flex justify-center items-center",
                            "w-8 h-8 p-1 rounded-lg",
                        )}>
                            <img className="w-full h-auto mb-1" src={Logo} />
                        </div>
                        <NavItemText
                            text={"GraviolaNFT"}
                            additionalClasses={"font-bold text-accent opacity-100"}
                        />
                    </div>

                    <div className="max-lg:hidden lg:visible">
                        <NavListDesktop navItems={navItems} mobileStyles={false} />
                    </div>

                    {/* Mobile navbar icon */}
                    <div
                        className={cl(
                            "max-lg:visible lg:hidden",
                            "flex items-center w-12 h-max px-2",
                            "text-light-text dark:text-dark-text hover:cursor-pointer"
                        )}
                        onClick={() => setMobileListVisible(!mobileListVisible)}
                    >
                        {mobileListVisible ? icons.close : icons.list}
                    </div>
                </div>

                {mobileListVisible && (
                    <div className={cl(
                        "flex flex-col w-full h-fit",
                        "bg-transparent"
                    )}>
                        <NavListDesktop navItems={navItems} mobileStyles={true} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
