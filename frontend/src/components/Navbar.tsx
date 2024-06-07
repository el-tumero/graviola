import { useState, Fragment } from "react"
import Link from "./Link"
import Logo from "../assets/logo.webp"
import useTheme from "../hooks/useTheme"
import { LightThemeIcon, DarkThemeIcon } from "./ui/ThemeIcons"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../router"
import { clsx as cl } from "clsx"

interface NavElementProps {
    children: React.ReactNode
    onClick?: () => void
}

const NavElement = ({ children, onClick }: NavElementProps) => {
    return (
        <div
            className={cl(
                "p-2 rounded-xl",
                "max-lg:flex max-lg:justify-center max-lg:w-full",
                "max-lg:bg-light-border max-lg:dark:bg-dark-border/40",
            )}
            onClick={onClick ? () => onClick() : () => {}}
        >
            {children}
        </div>
    )
}

const NavLink = (props: { text: string }) => (
    <span className="cursor-pointer hover:underline">{props.text}</span>
)

const NavRightList = (props: { navData: NavElementProps[] }) => {
    const mobileStyles = `flex-col max-lg:absolute max-lg:right-6 max-lg:top-16 max-lg:p-4 max-lg:rounded-xl max-lg:border-2 max-lg:border-light-border max-lg:dark:border-dark-border max-lg:shadow-xl`
    return (
        <div
            className={`flex justify-center items-center gap-4 bg-light-bgDark dark:bg-dark-bgDark max-lg:${mobileStyles}`}
        >
            {/* Classic Navigation Links/Pages */}
            {props.navData.map((navElem: NavElementProps, i) => {
                return <Fragment key={i}>{navElem.children}</Fragment>
            })}

            {/* Wallet */}
            <w3m-button />
        </div>
    )
}

const Navbar = () => {
    const navigate = useNavigate()
    const [theme, toggleTheme] = useTheme(true)
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)

    const navData: NavElementProps[] = [
        {
            children: (
                <NavElement onClick={() => navigate(routerPaths.generate)}>
                    <NavLink text="Generator" />
                </NavElement>
            ),
        },
        {
            children: (
                <NavElement onClick={() => navigate(routerPaths.collection)}>
                    <NavLink text="Collection" />
                </NavElement>
            ),
        },
        {
            children: (
                <NavElement onClick={() => navigate(routerPaths.tradeup)}>
                    <NavLink text="Trade Up" />
                </NavElement>
            ),
        },
        {
            children: (
                <NavElement onClick={() => navigate(routerPaths.accouncement)}>
                    <NavLink text="🎉 Announcement 🎉" />
                </NavElement>
            ),
        },
        {
            children: (
                <NavElement onClick={() => {}}>
                    <Link
                        text="GitHub"
                        href="https://github.com/el-tumero/graviola"
                        openInNewTab={true}
                        additionalClasses="w-min"
                    />
                </NavElement>
            ),
        },
        {
            children: (
                <NavElement>
                    <div
                        className="flex justify-center items-center w-6 h-6 cursor-pointer"
                        onClick={() => toggleTheme()}
                    >
                        {theme === "dark" ? (
                            <LightThemeIcon />
                        ) : (
                            <DarkThemeIcon />
                        )}
                    </div>
                </NavElement>
            ),
        },
    ]

    return (
        <div className="sticky z-[1000] bg-light-bgDark dark:bg-dark-bgDark border-b-2 border-light-border dark:border-dark-border top-0 bg-b w-screen py-4 flex justify-between items-center px-[5%] select-none font-content">
            <div
                className="flex justify-center items-center gap-2 cursor-pointer"
                onClick={() => navigate(routerPaths.root)}
            >
                <picture>
                    <img className="w-8" src={Logo} />
                </picture>
                <p className="text-large font-bold hover:underline">
                    GraviolaNFT
                </p>
            </div>

            <div className="max-lg:hidden lg:visible">
                <NavRightList navData={navData} />
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
                        <NavRightList navData={navData} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
