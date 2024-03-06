import BlockNFT, { BlockNFTProps } from "./BlockNFT"

interface NFTDetailsProps {
    nftProps: BlockNFTProps
    upperBubbleChildren: React.ReactNode
    lowerBubbleChildren?: React.ReactNode
}

const NFTDetails = ({ nftProps, upperBubbleChildren, lowerBubbleChildren }: NFTDetailsProps) => {
    return (

        <div className="flex w-full h-fit my-2">
            <div className="relative">
                <BlockNFT {...nftProps} additionalClasses="w-64 h-64" />

                <div className="absolute top-[2.5em] -right-[5.5em] flex bg-light-bgPrimary dark:bg-dark-bgPrimary w-fit h-fit p-4 rounded-lg border-2 border-light-border dark:border-dark-border">
                    {upperBubbleChildren}
                </div>

                {lowerBubbleChildren &&
                    <div className="absolute -bottom-[4em] -right-[16em] bg-light-bgPrimary dark:bg-dark-bgPrimary w-fit max-w-[24em] h-fit break-words p-4 rounded-lg border-2 border-light-border dark:border-dark-border">
                        {lowerBubbleChildren}
                    </div>
                }
            </div>
        </div>
    )
}

export default NFTDetails