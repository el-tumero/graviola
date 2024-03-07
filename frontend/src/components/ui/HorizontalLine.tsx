const HorizontalLine = (props: { additionalClasses?: string }) => {
    return <div className={`w-full h-0.5 mt-1 mb-4 bg-light-border dark:bg-dark-border ${props.additionalClasses}`} />
}

export default HorizontalLine