import { clsx as cl } from "clsx"
import icons from "../../data/icons"
import { hasKey } from "../../utils/hasKey"

interface FeatureCardProps {
    icon: string
    title: string
    content: string
    accentColor?: string
}

const FeatureCard = ({
    icon,
    title,
    content,
    accentColor,
}: FeatureCardProps) => {
    const resolvedIcon = hasKey(icons, icon) ? icons[icon] : icons.close // Use cross icon "close" for unknown icons
    const color = accentColor + "80" || "#1c202680" // Use 80 (128/256) opacity val
    return (
        <div
            className={cl(
                "z-10 relative flex w-full h-fit flex-col justify-start items-start p-6 pb-16",
                "rounded-xl",
            )}
            style={{ backgroundColor: color }}
        >
            <div
                className={cl(
                    "flex w-full justify-start items-center text-xl font-bold mb-3",
                )}
            >
                <p>{title}</p>
            </div>
            <div className={cl("z-10 text-lg leading-6 w-5/6")}>
                <p>{content}</p>
            </div>
            <div
                className={cl(
                    "z-1 opacity-50 absolute right-6 bottom-6 w-36 h-36 rounded-lg",
                    "flex justify-center items-center",
                )}
                style={{ fill: color, opacity: 0.1 }}
            >
                {resolvedIcon}
            </div>
        </div>
    )
}

export default FeatureCard
