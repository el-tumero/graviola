export interface BlockNFTProps {
    src: string
    id?: string
    disableMargin?: boolean
    additionalClasses?: string
}
const BlockNFT = ({ src, id, disableMargin, additionalClasses }: BlockNFTProps) => {
    return (
        <div id={id} className={`flex w-36 h-36 ${disableMargin ? "m-0" : "mx-4"} p-2 rounded-xl bg-light-bgPrimary dark:bg-dark-bgPrimary border-2 border-light-border dark:border-dark-border select-none ${additionalClasses}`}>
            <img draggable={false} className="w-full h-full rounded-lg" src={src} />
        </div>
    )
}

export default BlockNFT
