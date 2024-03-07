import HorizontalLine from "./HorizontalLine"

interface SectionTitleProps {
    title: string
    horizontalLineAfter?: boolean
    secondaryText?: string
    additionalText?: string
}

const SectionTitle = ({ title, horizontalLineAfter = true, secondaryText, additionalText }: SectionTitleProps) => {
    return (
        <div className="flex flex-col gap-1">
            <h1 className='font-bold text-2xl'>{title}</h1>
            {secondaryText && <h2 className='font-bold text-xl opacity-85'>{secondaryText}</h2>}
            {additionalText && <h3 className='font-bold text-xl opacity-85'>{additionalText}</h3>}
            {horizontalLineAfter && <HorizontalLine />}
        </div>
    )
}

export default SectionTitle