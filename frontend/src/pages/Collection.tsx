import FullscreenContainer from "../components/ui/FullscreenContainer";
import ContentContainer from "../components/ui/ContentContainer";
import Navbar from "../components/Navbar";

const Gallery = () => {
    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer>

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">

                    <h1 className='font-bold text-2xl'>Collection</h1>


                </div>

            </ContentContainer>

        </FullscreenContainer>
    )
}

export default Gallery