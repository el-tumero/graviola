
interface GenericContainerProps {
    children: React.ReactNode
    additionalClasses?: string
}

const FullscreenContainer = ({ children, additionalClasses }: GenericContainerProps) => {
    return (
        <div
            className={`w-screen h-screen min-w-screen min-h-screen overflow-x-hidden flex flex-col items-center text-light-text dark:text-dark-text bg-light-bgPrimary dark:bg-dark-bgPrimary text-base tracking-wide ${additionalClasses}`}
        >
            {children}
        </div>
    )
}

export default FullscreenContainer