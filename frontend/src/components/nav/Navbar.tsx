import { useEffect, useState } from "react"
import Logo from "../../assets/logo.webp"
import NavElement from "./NavElement"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../../router"
import { clsx as cl } from "clsx"
import { openURL } from "../../utils/openURL"
import NavListDesktop from "./NavList"
import icons from "../../data/icons"
import { links } from "../../links"
import { isDevMode } from "../../utils/mode"
import { userStatsSlice } from "../../redux/reducers/stats"
import useTheme from "../../hooks/useTheme"
import useWallet from "../../hooks/useWallet"
import { useAppDispatch } from "../../redux/hooks"

const Navbar = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)
    const [userStatsFetched, setUserStatsFetched] = useState<boolean>(false)
    const { theme, toggleTheme } = useTheme(true)
    const {
        address,
        connectDevWallet,
        isConnected,
        tokenContract,
        collectionContract,
    } = useWallet()

    // fetch user stats
    useEffect(() => {
        if (!address || !isConnected || userStatsFetched) return
        ;(async () => {
            try {
                const ownedNfts = await collectionContract.balanceOf(address)
                const tokenBalance = await tokenContract.balanceOf(address)
                const collectionAddress = await collectionContract.getAddress()
                const filter = collectionContract.filters.Transfer(
                    collectionAddress,
                    address,
                )
                const events = await collectionContract.queryFilter(filter)
                const droppedNfts = events.length
                dispatch(
                    userStatsSlice.actions.setUserStats({
                        tokenBalance: Number(tokenBalance),
                        nftsOwned: Number(ownedNfts),
                        nftsDropped: droppedNfts,
                    }),
                )
                setUserStatsFetched(true)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [address, isConnected])

    /* eslint-disable */
    const navItems = [
        <NavElement onClick={() => navigate(routerPaths.generate)}>
            <p data-testid="generate-nav-btn">Generate</p>
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
            <p>Voting</p>
        </NavElement>,

        <NavElement onClick={() => openURL(links.repo)}>
            <div
                className={cl(
                    "flex w-min hover:cursor-pointer",
                    "max-lg:w-full justify-center items-center",
                )}
            >
                {icons.github}
            </div>
        </NavElement>,

        <NavElement onClick={() => openURL(links.discord)}>
            <div
                className={cl(
                    "flex w-auto h-6 hover:cursor-pointer",
                    "max-lg:w-full justify-center items-center",
                )}
            >
                {icons.discordLogo}
            </div>
        </NavElement>,

        <NavElement onClick={() => toggleTheme()}>
            <div
                className={cl(
                    "flex justify-center items-center",
                    "w-full h-6 cursor-pointer",
                    "text-light-text dark:text-dark-text",
                )}
            >
                {theme === "dark" ? icons.darkTheme : icons.lightTheme}
            </div>
        </NavElement>,

        isDevMode ? (
            <NavElement onClick={() => connectDevWallet()}>
                <div
                    data-testid="dev-btn"
                    className={cl(
                        "flex w-auto h-6 hover:cursor-pointer",
                        "max-lg:w-full justify-center items-center",
                        isConnected ? "text-green-600" : "",
                    )}
                >
                    DEV
                </div>
            </NavElement>
        ) : (
            <></>
        ),
    ]
    /* eslint-enable */

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
                        "py-2 px-[2.5%]",
                        "select-none font-content",
                        !mobileListVisible &&
                            "border-b border-light-border dark:border-dark-border",
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
                        <div
                            className={cl(
                                "flex justify-center items-center",
                                "h-auto w-fit rounded-xl",
                            )}
                        >
                            <img
                                className="w-5 h-auto aspect-auto mb-1 p-0.5"
                                src={Logo}
                            />
                        </div>
                        <p className="font-semibold font-mono text-accentDark dark:text-accent opacity-100">
                            graviolaNFT
                        </p>
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
                    <div
                        className={cl(
                            "flex flex-col w-full h-fit",
                            "bg-transparent",
                            "transition-all duration-300",
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
