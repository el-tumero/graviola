

interface ButtonProps {
    text: string
    onClick: () => void
    additionalClasses?: string
}

const Button = ({ text, onClick, additionalClasses }: ButtonProps) => {
    return (
        <button onClick={() => onClick()} className={`w-fit min-w-[12em] h-auto py-3 my-1 px-2 text-md font-semibold rounded-xl active:opacity-60 hover:opacity-80 bg-light-bgLight dark:bg-dark-bgLight border-2 border-light-border dark:border-dark-border ${additionalClasses}`}>
            <span className="select-none">{text}</span>
        </button>
    )
}

export default Button