import { useState, useContext } from "react"
import Logo from "../../assets/logo.webp"
import NavElement from "./NavElement"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../../router"
import { clsx as cl } from "clsx"
import { openURL } from "../../utils/openURL"
import NavListDesktop from "./NavList"
import icons from "../../data/icons"
import { AppContext } from "../../contexts/AppContext"
import { links } from "../../links"
import { isDevMode } from "../../app/mode"
import { useAppDispatch } from "../../app/hooks"
import useWallet from "../../hooks/useWallet"

const Navbar = () => {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useContext(AppContext)
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)
    const { connectDevWallet } = useWallet()

    const navItems: React.ReactNode[] = [
        <NavElement onClick={() => navigate(routerPaths.generate)}>
            <p>Generate</p>
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.drops)}>
            <p>Drops</p>
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.tradeup)}>
            <p>Trade Up</p>
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.keywords)}>
            <p>Keywords</p>
        </NavElement>,

        <NavElement onClick={() => navigate(routerPaths.voting)}>
            <p className="font-bold">Vote!</p>
        </NavElement>,

        <NavElement onClick={() => openURL(links.repo)}>
            <div className={cl("flex w-min hover:cursor-pointer", "max-lg:w-full justify-center items-center")}>{icons.github}</div>
        </NavElement>,

        <NavElement onClick={() => openURL(links.discord)}>
            <div className={cl("flex w-auto h-6 hover:cursor-pointer", "max-lg:w-full justify-center items-center")}>
                {icons.discordLogo}
            </div>
        </NavElement>,

        <NavElement onClick={() => toggleTheme()}>
            <div className={cl("flex justify-center items-center", "w-full h-6 cursor-pointer", "text-light-text dark:text-dark-text")}>
                {theme === "dark" ? icons.darkTheme : icons.lightTheme}
            </div>
        </NavElement>,

        isDevMode ?
            <NavElement onClick={() => connectDevWallet()}>
                <div className={cl("flex w-auto h-6 hover:cursor-pointer", "max-lg:w-full justify-center items-center")}>
                    DEV
                </div>
            </NavElement> : <></>
    ]

    return (
        <div className="sticky top-0 z-30">
            <div
                className={cl(
                    "flex flex-col",
                    "bg-light-bgPrimary/60 dark:bg-dark-bgPrimary/60",
                    "w-screen backdrop-blur-lg",
                    "bg-transparent",
                    mobileListVisible && "border-b border-light-border dark:border-dark-border",
                )}
            >
                <div
                    className={cl(
                        "flex justify-between items-center",
                        "py-2 px-[2.5%]",
                        "select-none font-content",
                        !mobileListVisible && "border-b border-light-border dark:border-dark-border",
                    )}
                >
                    <div
                        className={cl(
                            "flex items-center gap-0.5 cursor-pointer",
                            "py-1 px-1.5 rounded-xl",
                            "hover:bg-accent/25",
                            "transition-colors duration-300",
                        )}
                        onClick={() => navigate(routerPaths.home)}
                    >
                        <div className={cl("flex justify-center items-center", "h-auto w-fit rounded-xl")}>
                            <img className="w-5 h-auto aspect-auto mb-1 p-0.5" src={Logo} />
                        </div>
                        <p className="font-semibold font-mono text-accentDark dark:text-accent opacity-100">graviolaNFT</p>
                    </div>

                    <div className="max-lg:hidden lg:visible">
                        <NavListDesktop navItems={navItems} mobileStyles={false} />
                    </div>

                    {/* Mobile navbar icon */}
                    <div
                        className={cl(
                            "max-lg:visible lg:hidden",
                            "flex items-center w-10 h-10 rounded-xl p-1",
                            "text-light-text dark:text-dark-text hover:cursor-pointer",
                            "hover:bg-light-text/10 dark:hover:bg-dark-text/10",
                            "transition-colors duration-300",
                        )}
                        onClick={() => setMobileListVisible(!mobileListVisible)}
                    >
                        {mobileListVisible ? icons.close : icons.list}
                    </div>
                </div>

                {mobileListVisible && (
                    <div className={cl("flex flex-col w-full h-fit", "bg-transparent", "transition-all duration-300")}>
                        <NavListDesktop navItems={navItems} mobileStyles={true} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
