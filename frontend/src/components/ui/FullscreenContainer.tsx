import { ReactNode, forwardRef } from "react"

interface GenericContainerProps {
    children: ReactNode
    additionalClasses?: string
}

const FullscreenContainer = forwardRef<HTMLDivElement, GenericContainerProps>(({ children, additionalClasses }, ref) => {
    return (
        <div
            ref={ref}
            className={`w-screen h-screen min-w-screen min-h-screen overflow-x-hidden flex flex-col items-center text-light-text dark:text-dark-text bg-light-bgPrimary dark:bg-dark-bgPrimary text-base tracking-wide ${additionalClasses}`}
        >
            {children}
        </div>
    );
});

export default FullscreenContainer