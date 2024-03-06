
interface GenericContainerProps {
    children: any
    additionalClasses?: string
}

const FullscreenContainer = ({ children, additionalClasses }: GenericContainerProps) => {
    return (
        <div
            className={`
                w-screen overflow-x-hidden h-screen
                flex flex-col items-center
                text-light-text dark:text-dark-text
                bg-light-bgPrimary dark:bg-dark-bgPrimary
                font-normal font-content
                ${additionalClasses}
            `}
        >
            {children}
        </div>
    )
}

export default FullscreenContainer