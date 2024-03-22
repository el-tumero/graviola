import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import FullscreenContainer from "../components/ui/FullscreenContainer";
import { routerPaths } from "../router";

const Error = () => {
    const navigate = useNavigate()

    return (
        <FullscreenContainer additionalClasses="justify-center font-bold text-2xl">
            <div className="flex justify-center items-center flex-col gap-2 font-bold">
                <p>Oops!</p>
                <p>Something went wrong.</p>
                <Button onClick={() => navigate(routerPaths.root)} text="Go home" />
            </div>
        </FullscreenContainer>
    )
}

export default Error