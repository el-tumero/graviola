interface GenericContainerProps {
    children: any
    additionalClasses?: string
}

const ContentContainer = ({children, additionalClasses,}: GenericContainerProps) => {
    return (
        <div className={`flex w-full max-w-5xl sm:px-6 sm:py-2 lg:px-8 lg:py-4 ${additionalClasses}`}>
            {children}
        </div>
    )
}

export default ContentContainer