import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import FullscreenContainer from "../components/ui/FullscreenContainer";
import { routerPaths } from "../router";
import ContentContainer from "../components/ui/ContentContainer";
import Navbar from "../components/Navbar";

const TradeUp = () => {
    const navigate = useNavigate()

    return (
        <FullscreenContainer additionalClasses="justify-center font-bold text-2xl">
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">

                    <h1 className='font-bold text-2xl'>Trade Up</h1>

                </div>


            </ContentContainer>
        </FullscreenContainer>
    )
}

export default TradeUp