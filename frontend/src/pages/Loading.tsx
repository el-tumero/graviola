import Link from "../components/Link";
import FullscreenContainer from "../components/ui/FullscreenContainer";
import useWeb3 from "../hooks/useWeb3";
import metamaskLogo from "../assets/metamask.webp";

const Loading = () => {
    const [web3] = useWeb3()
    return (
        <FullscreenContainer additionalClasses="justify-center font-bold text-2xl">
            {web3 ?
                <span>Loading...</span>
                :
                <div className="flex justify-center items-center">
                    <img className="w-32 h-32" src={metamaskLogo} />
                    <span>
                        Please install {" "}<Link text="Metamask" href="https://metamask.io/download/" openInNewTab={true} additionalClasses="text-orange-500" />{" "} To view this website.
                    </span>
                </div>
            }
        </FullscreenContainer>
    )
}

export default Loading