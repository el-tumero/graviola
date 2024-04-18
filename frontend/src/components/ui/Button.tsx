import { cn } from "../../utils/cn"

interface ButtonProps {
    text: string
    onClick: () => void
    additionalClasses?: string
    enabled?: boolean
}

const Button = ({ text, onClick, enabled = true, additionalClasses }: ButtonProps) => {
    return (
        <button
            onClick={enabled ? () => onClick() : () => {}}
            className={cn(
                "w-fit min-w-[14em] h-auto py-3 my-1 px-2",
                "text-md font-semibold rounded-xl",
                "bg-light-bgLight dark:bg-dark-bgLight border border-opacity-50",
                enabled && "active:opacity-60 hover:opacity-80 border-accent cursor-pointer",
                additionalClasses
            )}
            tabIndex={0}
        >
            <span className="select-none">{text}</span>
        </button>
    )
}

export default Button