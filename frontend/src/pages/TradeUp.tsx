import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import FullscreenContainer from "../components/ui/FullscreenContainer";
import ContentContainer from "../components/ui/ContentContainer";
import Navbar from "../components/Navbar";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useContext, useEffect, useState } from "react";
import { GraviolaContext } from "../contexts/GraviolaContext";
import { NFT } from "../types/NFT";
import { RaritiesData } from "../types/RarityGroup";
import { ethers } from "ethers";
import { formatBpToPercentage, getRarityFromPerc } from "../utils/getRarityDataFromThreshold";
import BlockNFT from "../components/ui/BlockNFT";
import { convertToIfpsURL } from "../utils/convertToIpfsURL";

const TradeUp = () => {

    const { isConnected, address } = useWeb3ModalAccount()
    const graviolaContext = useContext(GraviolaContext)
    const contractNFTs = graviolaContext.collection as NFT[]
    const rGroups = graviolaContext.rarities as RaritiesData
    const [ownedTokenIds, setOwnedTokensIds] = useState<Array<number>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    useEffect(() => {
        (async () => {
            let userOwnedTokens
            if (address) {
                userOwnedTokens = await graviolaContext.contract?.ownedTokens(ethers.getAddress(address))
            }
            userOwnedTokens && userOwnedTokens.forEach(token => {
                setOwnedTokensIds(prev => [...prev, Number(token)])
            })
            // console.log(ownedTokensIds)
            setIsLoading(false)
        })()
    }, [])


    return (
        <FullscreenContainer additionalClasses="font-bold text-2xl">
            <Navbar />

            <ContentContainer additionalClasses="flex-col h-full gap-4">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <h1 className='font-bold text-2xl'>Trade Up</h1>
                </div>


                {(isLoading) ?
                    <p>Loading...</p>
                    :
                    (!isConnected) ?
                        <p className="self-center">You need to connect your wallet to perform a Trade Up</p>
                        :
                        <div className="flex w-full h-2/3 gap-4">

                            <div className="flex w-2/3 bg-red-500 rounded-xl overflow-y-hidden pl-2 py-2">
                                <div className="flex w-full h-full overflow-y-scroll">
                                    <div className="sm:grid md:grid-cols-3 max-sm:flex-col max-md:grid-cols-2 max-sm:flex gap-4 w-full font-bold">
                                        {contractNFTs.map((nft: NFT, i) => {
                                            const percRarity = formatBpToPercentage(nft.attributes[0].value)
                                            const keywordsArray: string[] = (nft.description.split(":").pop()!.trim()).split(",")
                                            const keywords: string[] = keywordsArray.map(keyword => keyword.trim())

                                            const [, rarityData] = getRarityFromPerc(percRarity, rGroups)
                                            // if (!(ownedTokenIds.includes(i))) {
                                                // return null
                                            // } else {
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`
                                                        flex w-fit h-fit flex-col justify-center items-center
                                                        gap-2 bg-light-bgLight/50 dark:bg-dark-bgLight/50
                                                        border-2 border-light-border dark:border-dark-border
                                                        p-4 rounded-xl
                                                        `}
                                                    >
                                                        <div className="p-px" style={{ borderRadius: 16, borderWidth: 2, borderColor: rarityData.color }}>
                                                            <BlockNFT src={convertToIfpsURL(nft.image)} glow={false} disableMargin={true} additionalClasses={`w-fit h-fit max-w-[14em]`} />
                                                        </div>
                                                        <div className="flex flex-col gap-2 justify-center items-center">
                                                            {/* Id */}
                                                            <p className="font-bold">
                                                                Id: {i}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            // }

                                        })}

                                    </div>
                                </div>
                            </div>

                            <div className="flex w-1/3 flex-col gap-6 justify-center items-center h-full bg-green-500 rounded-xl">
                                <div className="w-48 h-48 rounded-xl bg-blue-500"></div>
                                <div className="w-48 h-48 rounded-xl bg-blue-500"></div>
                                <div className="w-48 h-48 rounded-xl bg-blue-500"></div>
                            </div>

                        </div>
                }


            </ContentContainer>
        </FullscreenContainer>
    )
}

export default TradeUp