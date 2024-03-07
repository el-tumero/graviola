import BlockNFT, { BlockNFTProps } from "./BlockNFT"

interface NFTDetailsProps {
    nftProps: BlockNFTProps
    upperBubbleChildren: React.ReactNode
    lowerBubbleChildren?: React.ReactNode
}

const NFTDetails = ({ nftProps, upperBubbleChildren, lowerBubbleChildren }: NFTDetailsProps) => {
    return (
        <div className="flex w-full h-fit my-2 p-4 rounded-xl bg-light-bgDark/50 dark:bg-dark-bgDark/50 mb-36">
            <div className="relative mt-4 mb-[4em]">
                <BlockNFT {...nftProps} additionalClasses="w-64 h-64" />

                <div className="absolute shadow-lg top-[2.5em] -right-[8.5em] flex bg-light-bgPrimary dark:bg-dark-bgPrimary w-fit h-fit p-4 rounded-lg border-2 border-light-border dark:border-dark-border">
                    {upperBubbleChildren}
                </div>

                {lowerBubbleChildren &&
                    <div className="absolute shadow-lg -bottom-[3.5em] -right-[12em] bg-light-bgPrimary dark:bg-dark-bgPrimary w-fit max-w-[24em] h-fit break-words p-4 rounded-lg border-2 border-light-border dark:border-dark-border">
                        {lowerBubbleChildren}
                    </div>
                }

            </div>
        </div>
    )
}

export default NFTDetails