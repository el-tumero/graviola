import { ReactNode, forwardRef } from "react"
import { cn } from "../../../utils/cn"

interface GenericContainerProps {
    children: ReactNode
    additionalClasses?: string
}

const FullscreenContainer = forwardRef<HTMLDivElement, GenericContainerProps>(
    ({ children, additionalClasses }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "w-screen h-screen min-w-screen min-h-screen overflow-x-hidden",
                    "flex flex-col items-center",
                    "text-base font-content font-thin",
                    "text-light-text dark:text-dark-text bg-light-bgPrimary dark:bg-dark-bgPrimary",
                    additionalClasses,
                )}
            >
                {children}
            </div>
        )
    },
)

export default FullscreenContainer
