import { clsx as cl } from "clsx"

const SectionContainer = (props: { children: React.ReactNode, additionalClasses?: string }) => {
    return (
        <div className={cl(
            "flex justify-between items-center",
            "w-full h-fit p-6 rounded-xl",
            "max-sm:flex-col gap-6 max-sm:gap-6",
            "border border-light-border dark:border-dark-border",
            props.additionalClasses
        )}>
            {props.children}
        </div>
    )
}

export default SectionContainer