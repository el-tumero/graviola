import { cn } from "../../utils/cn"

const HorizontalLine = (props: { additionalClasses?: string }) => {
    return (
        <div
            className={cn(
                "w-full h-px mt-1 mb-4 bg-light-border dark:bg-dark-border",
                props.additionalClasses,
            )}
        />
    )
}

export default HorizontalLine
