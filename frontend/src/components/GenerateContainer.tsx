interface GenerateContainerProps {
    isPulsating: boolean
    isGenerating: boolean
}

const GenerateContainer = ({ isPulsating, isGenerating }: GenerateContainerProps) => {
    return (
        <div className={`flex justify-center items-center w-64 h-64 rounded-xl bg-light-bgDark dark:bg-dark-bgDark border-2 border-light-border dark:border-dark-border ${isPulsating ? "animate-pulse" : ""}`}>
            {isGenerating &&
                <>
                    <svg className={`${isGenerating ? "animate-spin" : ""}`} width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className={`stroke-2 stroke-light-border dark:stroke-dark-border`} d="M20.0001 12C20.0001 13.3811 19.6425 14.7386 18.9623 15.9405C18.282 17.1424 17.3022 18.1477 16.1182 18.8587C14.9341 19.5696 13.5862 19.9619 12.2056 19.9974C10.825 20.0328 9.45873 19.7103 8.23975 19.0612" stroke="#000000" stroke-width="3.55556" stroke-linecap="round"/>
                    </svg>
                </>
            }
        </div>
    )
}

export default GenerateContainer