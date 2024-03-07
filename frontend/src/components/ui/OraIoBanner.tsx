
interface OraIoBannerProps {
    children: React.ReactNode
}

const OraIoBanner = ({ children }: OraIoBannerProps) => {
    return (
        <div className="flex flex-col w-full h-fit my-2 p-4 gap-2 rounded-xl bg-light-bgDark/50 dark:bg-dark-bgDark/50 mb-36">
            <div className="flex gap-2">
                <h1 className="text-3xl font-bold">Powered by</h1>
                <div className="flex justify-center items-center">
                    <svg className="w-fit h-8" width="206" height="66" viewBox="0 0 206 66" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <rect width="206" height="66" fill="url(#pattern0)"/>
                    <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_316_107" transform="scale(0.00485437 0.0151515)"/>
                    </pattern>
                    <image id="image0_316_107" width="206" height="66" xlinkHref="data:image/png;base64,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"/>
                    </defs>
                    </svg>
                </div>
            </div>
            {children}
        </div>
    )

}

export default OraIoBanner