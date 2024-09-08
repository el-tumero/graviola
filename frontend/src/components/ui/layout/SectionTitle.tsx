import React from "react"
import { cn } from "../../../utils/cn"
import { clsx as cl } from "clsx"

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
                "flex w-full flex-col gap-1 justify-start items-start", additionalClasses,
            )}
        >
            <p className={cl("text-xl font-content font-bold mb-1")}>
                {title}
            </p>
            {secondaryContent ? (
                typeof secondaryContent === "string" ?
                    <p className="text-lg leading-6 opacity-85">
                        {secondaryContent}
                    </p>
                    : secondaryContent)
                : <React.Fragment />}
        </div>
    )
}

export default SectionTitle
