

interface ButtonProps {
    text: string
    onClick: () => void
    additionalClasses?: string
    enabled?: boolean
}

const Button = ({ text, onClick, enabled, additionalClasses }: ButtonProps) => {
    return (
        <button onClick={enabled ? () => onClick() : () => {}} className={`w-fit min-w-[12em] h-auto py-3 my-1 px-2 text-md font-semibold rounded-xl active:opacity-60 hover:opacity-80 bg-light-bgLight dark:bg-dark-bgLight border-2 ${enabled ? "border-accent" : "border-light-border dark:border-dark-border opacity-75"} ${additionalClasses}`} tabIndex={0}>
            <span className="select-none">{text}</span>
        </button>
    )
}

export default Button