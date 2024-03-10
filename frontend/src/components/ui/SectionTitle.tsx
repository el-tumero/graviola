import HorizontalLine from "./HorizontalLine"

interface SectionTitleHeader {
    content: string
    additionalClasses?: string
} 

interface SectionTitleProps {
    mainText: SectionTitleHeader
    secondaryText?: SectionTitleHeader
    additionalText?: SectionTitleHeader
    horizontalLineAfter?: boolean
}

const SectionTitle = ({ mainText, secondaryText, additionalText, horizontalLineAfter = true }: SectionTitleProps) => {
    return (
        <div className="flex flex-col gap-1">
            <h1 className={`font-bold text-2xl ${mainText.additionalClasses}`}>{mainText.content}</h1>
            {secondaryText && <h2 className={`font-bold text-xl opacity-85 ${secondaryText.additionalClasses}`}>{secondaryText.content}</h2>}
            {additionalText && <h3 className={`font-bold text-xl opacity-85 ${additionalText.additionalClasses}`}>{additionalText.content}</h3>}
            {horizontalLineAfter && <HorizontalLine />}
        </div>
    )
}

export default SectionTitle