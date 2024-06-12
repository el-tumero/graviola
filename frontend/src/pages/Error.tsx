import { useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import { clsx as cl } from "clsx"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import { routerPaths } from "../router"

const Error = () => {
    const navigate = useNavigate()

    return (
        <FullscreenContainer additionalClasses="justify-center">
            <div className={cl(
                "flex flex-col justify-center items-center",
                "p-3 gap-3 rounded-xl",
                "border border-light-border dark:border-dark-border"
            )}>
                <div>
                    <p>Oops!</p>
                    <p>Something went wrong.</p>
                </div>
                <div className="w-full h-px bg-light-border dark:bg-dark-border"></div>
                <Button
                    onClick={() => navigate(routerPaths.home)}
                    text="Go home"
                />
            </div>
        </FullscreenContainer>
    )
}

export default Error
