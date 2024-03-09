import { useState } from "react"
import Link from "./Link"
import Logo from "../assets/logo.webp"
import useTheme from "../hooks/useTheme"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../router"

const NavRightList = (props: {themeOnClick: () => void}) => {
    // TODO: Tidy mobileStyles
    const mobileStyles = `flex-col max-md:absolute max-md:right-6 max-md:top-14 max-md:p-4 max-md:rounded-xl max-md:border-2 max-md:border-light-border max-md:border-dark-border`
    return (
        <div className={`flex justify-center items-center gap-2 bg-light-bgDark dark:bg-dark-bgDark max-md:${mobileStyles}`}>
            <Link text="GitHub" href="https://github.com/el-tumero/graviola" openInNewTab={true} />
            <button className="hover:underline" onClick={() => props.themeOnClick()}>Theme</button>
            <w3m-button />
        </div>
    )
}

const Navbar = () => {

    const navigate = useNavigate()
    const [,toggleTheme] = useTheme()
    const [mobileListVisible, setMobileListVisible] = useState<boolean>(false)

    return (
        <div className="sticky z-[1000] bg-light-bgDark dark:bg-dark-bgDark border-b-2 border-light-border dark:border-dark-border top-0 bg-b w-screen py-4 flex justify-between items-center px-[5%] select-none font-content">

            <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => navigate(routerPaths.root)}>
                <picture>
                    <img className="w-8" src={Logo} />
                </picture>
                <p className="text-large font-bold hover:underline">GraviolaNFT</p>
            </div>

            <div className="flex justify-center items-center gap-4 max-md:hidden md:visible">
                <NavRightList themeOnClick={toggleTheme} />
            </div>

            {/* Mobile navbar right panel */}
            {/* TODO: add icons */}
            <div className="max-md:visible md:hidden flex w-8 h-8 px-2 bg-blue-500" onClick={() => setMobileListVisible(!mobileListVisible)}>
                {mobileListVisible &&
                    <div className="flex flex-col gap-2">
                        <NavRightList themeOnClick={toggleTheme} />
                    </div>
                }

            </div>

        </div>
    )
}


export default Navbar