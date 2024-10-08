import { cn } from "../../../utils/cn"

interface GenericContainerProps {
    children: any
    additionalClasses?: string
}

const ContentContainer = ({
    children,
    additionalClasses,
}: GenericContainerProps) => {
    return (
        <div
            className={cn(
                "flex w-full max-w-7xl",
                "max-lg:px-6 max-lg:py-2",
                "lg:px-8 lg:py-4",
                additionalClasses,
            )}
        >
            {children}
        </div>
    )
}

export default ContentContainer
