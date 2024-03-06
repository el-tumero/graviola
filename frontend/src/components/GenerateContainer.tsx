
interface GenerateContainerProps {
    isPulsating: boolean
    isGenerating: boolean
}

const GenerateContainer = ({ isPulsating, isGenerating }: GenerateContainerProps) => {
    return (
        <div className={`flex w-64 h-64 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2 border-light-border dark:border-dark-border ${isPulsating ? "animate-pulse" : ""}`}>
        </div>
    )
}

export default GenerateContainer