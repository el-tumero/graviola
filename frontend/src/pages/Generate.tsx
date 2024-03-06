import { useState, useEffect } from "react"
import GenerateContainer from "../components/GenerateContainer"
import Navbar from "../components/Navbar"
import Button from "../components/ui/Button"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import HorizontalLine from "../components/ui/HorizontalLine"
import { routerPaths } from "../router"
import { useNavigate } from "react-router"

const Generate = () => {

    const navigate = useNavigate()

    // TODO: Fetch keywords from contract on page load
    const keywords = ['human', 'elf', 'android', 'robot', 'angry', 'green', 'monster', 'nomad', 'pink', 'glasses']

    return (
        <FullscreenContainer>
            <Navbar />


            <ContentContainer additionalClasses="flex-col gap-4">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <p className="self-start font-bold hover:underline cursor-pointer mb-8" onClick={() => navigate(routerPaths.root)}>{"< Home"}</p>
                    <h1 className='font-bold text-2xl'>NFT Generator</h1>
                    <GenerateContainer isPulsating={true} isGenerating={false} />
                    <p>Cooldown: %HH:%MM:%SS</p>
                    <Button text="Generate" onClick={() => { }} />
                </div>

                <HorizontalLine />

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center mt-28">
                    <h2 className='font-bold text-xl mb-4'>Keyword list</h2>
                    <div className="grid grid-cols-4 gap-4 w-full font-bold">
                        {keywords.map((keyword, index) => (
                            <div key={index} className="bg-light-bgLight dark:bg-dark-bgLight p-4 rounded-xl text-center">
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>



            </ContentContainer>


        </FullscreenContainer>

    )
}

export default Generate





