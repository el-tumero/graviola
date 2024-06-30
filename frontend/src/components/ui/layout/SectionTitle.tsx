import { cn } from "../../../utils/cn"
import { clsx as cl } from "clsx"

interface SectionTitleProps {
    title: string
    secondaryContent?: string | React.ReactNode
    additionalClasses?: string
}

const SectionTitle = ({ title, secondaryContent, additionalClasses }: SectionTitleProps) => {
    return (
        <div className={cn("flex w-full flex-col gap-1 justify-start items-start", additionalClasses)}>
            <p className={cl("text-xl font-title font-semibold mb-1")}>{title}</p>
            {secondaryContent && typeof secondaryContent === "string" ? (
                <p className="text-base">{secondaryContent}</p>
            ) : (
                <div className="text-base">{secondaryContent}</div>
            )}
        </div>
    )
}

export default SectionTitle
