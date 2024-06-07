import BlockNFT, { BlockNFTProps } from "./BlockNFT"
import { clsx as cl } from "clsx"

interface NFTDetailsProps {
    nftProps: BlockNFTProps
    upperBubbleChildren: React.ReactNode
    lowerBubbleChildren?: React.ReactNode
}

const NFTDetails = ({
    nftProps,
    upperBubbleChildren,
    lowerBubbleChildren,
}: NFTDetailsProps) => {
    return (
        <div
            className={cl(
                "max-sm:flex-col",
                "w-full h-fit my-2 px-4 py-16 rounded-xl bg-light-bgDark/50 dark:bg-dark-bgDark/50 mb-36",
            )}
        >
            <div
                className={cl(
                    "max-sm:flex max-sm:flex-col max-sm:gap-8 max-sm:jusitfy-center",
                    "relative h-full items-center",
                )}
            >
                <BlockNFT
                    {...nftProps}
                    disableMargin={true}
                    additionalClasses={cl(
                        "sm:w-64 sm:h-64 sm:mx-8",
                        "max-sm:w-1/2 max-sm:h-1/2 max-sm:mx-2",
                    )}
                />

                <div
                    className={cl(
                        "max-sm:relative",
                        "sm:absolute sm:top-[1.5em] sm:left-[16em]",
                        "shadow-lg backdrop-blur-lg bg-light-bgPrimary/45 dark:bg-dark-bgPrimary/45 w-fit h-fit p-4 rounded-lg border-2 border-light-border dark:border-dark-border",
                    )}
                >
                    {upperBubbleChildren}
                </div>

                {lowerBubbleChildren && (
                    <div
                        className={cl(
                            "max-sm:relative",
                            "sm:absolute sm:-bottom-[2.5em] sm:left-[12em]",
                            "backdrop-blur-lg bg-light-bgPrimary/45 dark:bg-dark-bgPrimary/45 p-4 rounded-lg border-2 border-light-border dark:border-dark-border",
                        )}
                    >
                        {lowerBubbleChildren}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NFTDetails
