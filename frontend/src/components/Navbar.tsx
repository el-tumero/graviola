import { useState } from "react"
import Link from "./Link"
import Logo from "../assets/logo.webp"
import useTheme from "../hooks/useTheme"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../router"

const LightThemeIcon = () => {
    return (
        <svg className="w-min h-fit stroke-4 text-light-text dark:text-dark-text dark:hover:text-accent" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

const DarkThemeIcon = () => {
    return (
        <svg className="w-min h-fit stroke-4 text-light-text dark:text-dark-text hover:text-accent" width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

const NavRightList = (props: { theme: string, themeOnClick: () => void }) => {
    const mobileStyles = `flex-col max-md:absolute max-md:right-6 max-md:top-16 max-md:p-4 max-md:rounded-xl max-md:border-2 max-md:border-light-border max-md:dark:border-dark-border max-md:shadow-lg`
    const mobileItemCtn = `p-2 rounded-xl max-md:w-full max-md:bg-light-border/40 max-md:dark:bg-dark-border/40`
    return (
        <div className={`flex justify-center items-center gap-4 bg-light-bgDark dark:bg-dark-bgDark max-md:${mobileStyles}`}>
            <div className={mobileItemCtn}>
                <Link text="GitHub" href="https://github.com/el-tumero/graviola" openInNewTab={true} additionalClasses="w-min" />
            </div>

            <div className={mobileItemCtn}>
                <div className="flex justify-center items-center w-6 h-6 cursor-pointer" onClick={() => props.themeOnClick()}>
                    {props.theme === "dark" ? <LightThemeIcon /> : <DarkThemeIcon /> }
                </div>

            </div>
            <w3m-button />
        </div>
    )
}

const Navbar = () => {

    const navigate = useNavigate()
    const [theme, toggleTheme] = useTheme()
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)

    return (
        <div className="sticky z-[1000] bg-light-bgDark dark:bg-dark-bgDark border-b-2 border-light-border dark:border-dark-border top-0 bg-b w-screen py-4 flex justify-between items-center px-[5%] select-none font-content">

            <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => navigate(routerPaths.root)}>
                <picture>
                    <img className="w-8" src={Logo} />
                </picture>
                <p className="text-large font-bold hover:underline">GraviolaNFT</p>
            </div>

            <div className="max-md:hidden md:visible">
                <NavRightList theme={theme} themeOnClick={toggleTheme} />
            </div>

            {/* Mobile navbar right panel */}
            <div className="max-md:visible md:hidden flex items-center w-12 h-max px-2" onClick={() => setMobileListVisible(!mobileListVisible)}>

                <svg className="h-fit stroke-4 text-light-text dark:text-dark-text hover:cursor-pointer" fill="none" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g id="Menu / Hamburger_MD">
                        <path id="Vector" d="M5 17H19M5 12H19M5 7H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>

                {mobileListVisible &&
                    // <div className={`flex flex-col gap-4 transition-opacity duration-200`}>
                    <div className={`flex flex-col gap-4 transition-opacity duration-200 ${mobileListVisible ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                        <NavRightList theme={theme} themeOnClick={toggleTheme} />
                    </div>
                }

            </div>

        </div>
    )
}


export default Navbar