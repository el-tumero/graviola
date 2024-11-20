import cl from "clsx"

interface Props {
    keyword: string
}

const CardGenerateKeyword: React.FC<Props> = ({ keyword }) => {
    return (
        <div
            className={cl(
                "py-1 px-2 rounded-md w-48 h-7 mx-auto my-4",
                "text-center",
                "bg-light-bgLight/75 dark:bg-dark-bgLight/75",
                "text-ellipsis",
                "overflow-hidden",
            )}
        >
            {keyword && <span className="animate-fadeIn">{keyword}</span>}
        </div>
    )
}

export default CardGenerateKeyword
