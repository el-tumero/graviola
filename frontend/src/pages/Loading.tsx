import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import Logo from "../assets/logo.webp"

const Loading = () => {
    return (
        <FullscreenContainer additionalClasses="justify-center font-bold text-2xl gap-4">
            <picture>
                <img className="w-16 animate-pulse" src={Logo} />
            </picture>
            <p className="font-bold text-xl">Loading...</p>
        </FullscreenContainer>
    )
}

export default Loading
