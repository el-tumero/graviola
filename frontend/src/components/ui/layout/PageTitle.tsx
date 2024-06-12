import { clsx as cl } from "clsx"


interface PageTitleProps {
    title: string
    additionalClasses?: string
}

const PageTitle = ({ title, additionalClasses }: PageTitleProps) => {
    return (
        <div className={cl(
            "flex w-full h-fit mt-12",
            "justify-center items-center",
            additionalClasses
        )}>
            <h1 className="font-semibold font-title text-2xl">{title}</h1>
        </div>
    )
}

export default PageTitle