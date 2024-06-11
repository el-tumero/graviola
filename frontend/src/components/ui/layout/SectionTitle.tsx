import { cn } from "../../../utils/cn"

interface SectionTitleProps {
    title: string
    secondaryContent?: string | React.ReactNode
    additionalClasses?: string
}

const SectionTitle = ({
    title,
    secondaryContent,
    additionalClasses,
}: SectionTitleProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-col gap-1 justify-start items-start",
                additionalClasses,
            )}
        >
            <p className="text-2xl font-bold">{title}</p>
            {secondaryContent && typeof secondaryContent === "string" ? (
                <p className="text-xl">{secondaryContent}</p>
            ) : (
                <div>{secondaryContent}</div>
            )}
        </div>
    )
}

export default SectionTitle
