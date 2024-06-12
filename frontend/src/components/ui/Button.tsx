import icons from "../../icons"
import { cn } from "../../utils/cn"

interface ButtonProps {
    text: string
    onClick: () => void
    additionalClasses?: string
    disabled?: boolean
    arrowIcon?: boolean
}

const Button = ({
    text,
    onClick,
    disabled = false,
    arrowIcon = false,
    additionalClasses,
}: ButtonProps) => {
    return (
        <div
            onClick={() => onClick()}
            className={cn(
                "flex w-fit p-3 select-none",
                "rounded-xl transition-all duration-300",
                "border border-transparent",
                "cursor-pointer hover:cursor-pointer",
                "hover:border-light-border hover:dark:border-dark-border",
                disabled && "opacity-50 pointer-events-none",
                additionalClasses
            )}
        >
            <button disabled={disabled} >
                <p className="font-content">{text}</p>
            </button>
            {arrowIcon &&
                icons.arrowRight
            }
        </div>
    )
}

export default Button
