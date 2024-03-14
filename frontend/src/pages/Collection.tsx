import FullscreenContainer from "../components/ui/FullscreenContainer";
import ContentContainer from "../components/ui/ContentContainer";
import Navbar from "../components/Navbar";
import { useContext } from "react";
import { createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { GraviolaContext } from "../contexts/GraviolaContext";
import { NFT } from "../types/NFT";
import SectionTitle from "../components/ui/SectionTitle";

const Collection = () => {

    const { isConnected } = useWeb3ModalAccount()
    const graviolaContext = useContext(GraviolaContext)
    const nftSources = graviolaContext.collection as NFT[]

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <h1 className='font-bold text-2xl'>Collection</h1>
                </div>

                {(!isConnected) ?
                    <p>You need to connect your wallet to see your drops</p>
                    :
                    <>
                        <SectionTitle
                            mainText={{
                                content: "Dropped NFTs"
                            }}
                        />
                        {}
                        
                    </>
                }


            </ContentContainer>

        </FullscreenContainer>
    )
}

export default Collection