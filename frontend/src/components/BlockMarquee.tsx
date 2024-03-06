import BlockNFT from "./ui/BlockNFT"

interface BlockMarqueeProps {
    nftSources: Array<string>
}

const BlockMarquee = ({ nftSources }: BlockMarqueeProps) => {
    return (
        <div className="relative flex overflow-x-hidden">
                <div className="flex py-4 animate-marquee">
                    {nftSources.map((source, i) => (
                        <BlockNFT key={i} src={source} />
                    ))}
                </div>

                <div className="flex absolute top-0 py-4 animate-marquee2">
                    {nftSources.map((source, i) => (
                        <BlockNFT key={i} src={source} />
                    ))}
                </div>
        </div>
    )
}



export default BlockMarquee