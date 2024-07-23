import { clsx as cl } from "clsx"

interface PageTitleProps {
    title: string
    additionalClasses?: string
}

const PageTitle = ({ title, additionalClasses }: PageTitleProps) => {
    return (
        <div
            className={cl(
                "flex w-full h-fit mt-3",
                "justify-center items-center",
                "select-none",
                additionalClasses,
            )}
        >
            <h1 className="font-semibold font-title text-lg">{title}</h1>
        </div>
    )
}

export default PageTitle
