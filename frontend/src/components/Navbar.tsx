import Link from "./Link"
import Logo from "../assets/logo.webp"
import useTheme from "../hooks/useTheme"
import { useNavigate } from "react-router-dom"
import { routerPaths } from "../router"

const Navbar = () => {

    const navigate = useNavigate()
    const [,toggleTheme] = useTheme()

    return (
        <div className="sticky z-[1000] bg-light-bgDark dark:bg-dark-bgDark border-b-2 border-light-border dark:border-dark-border top-0 bg-b w-screen py-4 flex justify-between items-center px-[10%] select-none font-content">

            <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => navigate(routerPaths.root)}>
                <picture>
                    <img className="w-8" src={Logo} />
                </picture>
                <p className="text-large font-bold hover:underline">GraviolaNFT</p>
            </div>

            <div className="flex justify-center items-center gap-4">
                <Link text="GitHub" href="https://github.com/el-tumero/graviola" openInNewTab={true} />
                <button className="hover:underline" onClick={() => toggleTheme()}>Theme</button>
                <w3m-button />
            </div>

        </div>
    )
}


export default Navbar