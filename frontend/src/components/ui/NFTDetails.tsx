import BlockNFT, { BlockNFTProps } from "./BlockNFT"

interface NFTDetailsProps {
    nftProps: BlockNFTProps
    upperBubbleChildren: React.ReactNode
    lowerBubbleChildren?: React.ReactNode
}

const NFTDetails = ({ nftProps, upperBubbleChildren, lowerBubbleChildren }: NFTDetailsProps) => {
    return (
        <div className="flex max-sm:flex-col w-full h-fit my-2 p-4 rounded-xl bg-light-bgDark/50 dark:bg-dark-bgDark/50 mb-36">
            <div className="relative max-sm:flex max-sm:flex-col max-sm:gap-4 max-sm:jusitfy-center max-sm:items-center mt-4 mb-[4em]">
                <BlockNFT {...nftProps} additionalClasses="sm:w-64 sm:h-64 max-sm:w-1/2 max-sm:h-1/2" />

                {/* <div className="flex shrink"> */}
                <div className="sm:absolute max-sm:relative shadow-lg sm:top-[1.5em] sm:-right-[8em] flex bg-light-bgPrimary dark:bg-dark-bgPrimary w-fit h-fit p-4 rounded-lg border-2 border-light-border dark:border-dark-border">
                    {upperBubbleChildren}
                </div>

                {lowerBubbleChildren &&
                    <div className="sm:absolute max-sm:relative shadow-lg sm:-bottom-[3.5em] sm:-right-[12em] bg-light-bgPrimary dark:bg-dark-bgPrimary max-md:min-w-[8em] md:min-w-[12em] w-fit md:max-w-[24em] h-fit p-4 rounded-lg border-2 border-light-border dark:border-dark-border">
                        {lowerBubbleChildren}
                    </div>
                }

            </div>
        </div>
    )
}

export default NFTDetails