import FullscreenContainer from "../components/ui/FullscreenContainer";
import ContentContainer from "../components/ui/ContentContainer";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { GraviolaContext } from "../contexts/GraviolaContext";
import { convertToIfpsURL } from "../utils/convertToIpfsURL";
import { NFT } from "../types/NFT";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import BlockNFT from "../components/ui/BlockNFT";
import { getRarityColor } from "../utils/getRarityBorder";
import { formatBpToPercentage, getRarityFromThreshold } from "../utils/getRarityDataFromThreshold";
import { ethers } from "ethers";

type CollectionMode = "Everyone" | "My Drops"

const Collection = () => {

    const { isConnected, address } = useWeb3ModalAccount()
    const graviolaContext = useContext(GraviolaContext)
    const contractNFTs = graviolaContext.collection as NFT[]
    const [collectionMode, setCollectionMode] = useState<CollectionMode>("My Drops")
    const [ownedTokensIds, setOwnedTokensIds] = useState<Array<number>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

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
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <h1 className='font-bold text-2xl'>Collection</h1>
                </div>

                {(isLoading) ?
                    <p>Fetching data...</p>
                    :
                    (!isConnected) ?
                        <p>You need to connect your wallet to see your drops</p>
                        :
                        <>
                            <SectionTitle
                                mainText={{
                                    content: `Dropped NFTs`
                                }}
                            />

                            <div className="flex justify-between items-center mb-4">
                                <p className="text-xl">Showing: <span className="font-bold">{collectionMode.toLowerCase()}</span></p>
                                <Button
                                    text={`Change to ${(collectionMode === "My Drops") ? "all drops" : "my drops only"}`}
                                    onClick={() => {
                                        const invertedCollectionMode = (collectionMode === "My Drops") ? "Everyone" : "My Drops"
                                        setCollectionMode(invertedCollectionMode)
                                    }}
                                />
                            </div>

                            <div className="sm:grid md:grid-cols-4 max-sm:flex-col max-md:grid-cols-2 max-sm:flex gap-4 w-full font-bold">
                                <CollectionList contractNFTs={contractNFTs} collectionMode={collectionMode} ownedTokenIds={ownedTokensIds} />
                            </div>
                        </>
                }


            </ContentContainer>

        </FullscreenContainer>
    )
}

const CollectionList = (props: { contractNFTs: Array<NFT>, collectionMode: CollectionMode, ownedTokenIds: Array<number> }) => {
    return (
        <>
            {props.contractNFTs.map((nft: NFT, i) => {
                const percRarity = formatBpToPercentage(nft.attributes[0].value)
                const [rarityLevel, rarityData] = getRarityFromThreshold(percRarity)
                const rarityColor = getRarityColor(rarityLevel)
                if ((props.collectionMode === "My Drops") && !(props.ownedTokenIds.includes(i))) {
                    return null
                } else {
                    return (
                        <div
                            key={i}
                            className={`
                            flex flex-col justify-center items-center
                            gap-2 bg-light-bgLight/50 dark:bg-dark-bgLight/50
                            border-2 border-light-border dark:border-dark-border
                            p-4 rounded-xl
                            `}
                            >
                                <div className="p-px" style={{ borderRadius: 16, borderWidth: 2, borderColor: getRarityColor(rarityLevel)}}>
                                    <BlockNFT src={convertToIfpsURL(nft.image)} glow={false} disableMargin={true} additionalClasses={`w-fit h-fit max-w-[14em]`} />
                                </div>
                            <p className="font-normal">
                                Rarity: {" "}
                                <span style={{ color: rarityColor }} className="font-bold">{rarityData.name}</span>
                            </p>
                            <p style={{ color: rarityColor }} className="text-xs opacity-75">({percRarity}%)</p>
                            <p>Keywords: SOON</p>
                        </div>
                    )
                }
            })}
        </>
    );
};
export default Collection