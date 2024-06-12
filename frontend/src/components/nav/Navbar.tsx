import { useState, useContext } from "react"
import Logo from "../../assets/logo.webp"
import NavItemText from "./NavItemText"
import NavElement from "./NavElement"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../../router"
import { clsx as cl } from "clsx"
import NavListDesktop from "./NavList"
import icons from "../../icons"
import { AppContext } from "../../contexts/AppContext"

const Navbar = () => {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useContext(AppContext)
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)

    const navItems: React.ReactNode[] = [
        <NavElement onClick={() => navigate(routerPaths.generate)}>
            <NavItemText text="Generate" />
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.collection)}>
            <NavItemText text="Collection" />
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.tradeup)}>
            <NavItemText text="Trade Up" />
        </NavElement>,

        <NavElement>
            <div
                className={cl(
                    "flex w-min hover:cursor-pointer",
                    "opacity-75 hover:opacity-100",
                    "max-lg:w-full justify-center items-center",
                )}
                onClick={() =>
                    window.open(
                        "https://github.com/el-tumero/graviola",
                        "_blank",
                        "noopener,noreferrer",
                    )
                }
            >
                {icons.github}
            </div>
        </NavElement>,

        <NavElement>
            <div
                className={cl(
                    "flex w-auto h-6 hover:cursor-pointer",
                    "opacity-75 hover:opacity-100",
                    "max-lg:w-full justify-center items-center",
                )}
                onClick={() =>
                    window.open(
                        "https://github.com/el-tumero/graviola",
                        "_blank",
                        "noopener,noreferrer",
                    )
                }
            >
                {icons.discordLogo}
            </div>
        </NavElement>,

        <NavElement>
            <div
                className={cl(
                    "flex justify-center items-center",
                    "w-full h-6 cursor-pointer",
                    "opacity-75 hover:opacity-100",
                    "text-light-text dark:text-dark-text",
                )}
                onClick={() => toggleTheme()}
            >
                {theme === "dark" ? icons.darkTheme : icons.lightTheme}
            </div>
        </NavElement>,
    ]

    return (
        <div className="sticky top-0 z-30">
            <div
                className={cl(
                    "flex flex-col",
                    "bg-light-bgPrimary/60 dark:bg-dark-bgPrimary/60",
                    "w-screen backdrop-blur-lg",
                    "bg-transparent",
                    mobileListVisible &&
                    "border-b border-light-border dark:border-dark-border",
                )}
            >
                <div
                    className={cl(
                        "flex justify-between items-center",
                        "py-3 px-[2.5%]",
                        "select-none font-content",
                        !mobileListVisible &&
                        "border-b border-light-border dark:border-dark-border",
                    )}
                >
                    <div
                        className={cl(
                            "flex items-center gap-0.5 cursor-pointer",
                            "px-3 py-1 rounded-xl",
                            "hover:bg-accent/25",
                            "transition-colors duration-300"
                        )}
                        onClick={() => navigate(routerPaths.home)}
                    >
                        <div
                            className={cl(
                                "flex justify-center items-center",
                                "w-8 h-8 p-1 rounded-xl",
                            )}
                        >
                            <img className="w-full h-auto mb-1" src={Logo} />
                        </div>
                        <NavItemText
                            text={"GraviolaNFT"}
                            additionalClasses={
                                "font-bold font-mono text-accent opacity-100"
                            }
                        />
                    </div>

                    <div className="max-lg:hidden lg:visible">
                        <NavListDesktop
                            navItems={navItems}
                            mobileStyles={false}
                        />
                    </div>

                    {/* Mobile navbar icon */}
                    <div
                        className={cl(
                            "max-lg:visible lg:hidden",
                            "flex items-center w-12 h-max px-2",
                            "text-light-text dark:text-dark-text hover:cursor-pointer",
                        )}
                        onClick={() => setMobileListVisible(!mobileListVisible)}
                    >
                        {mobileListVisible ? icons.close : icons.list}
                    </div>
                </div>

                {mobileListVisible && (
                    <div
                        className={cl(
                            "flex flex-col w-full h-fit",
                            "bg-transparent",
                        )}
                    >
                        <NavListDesktop
                            navItems={navItems}
                            mobileStyles={true}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
