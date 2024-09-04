import { clsx as cl } from "clsx"

const LimitedKeywordsScale = () => {
    return (
        <div
            className={cl(
                "flex w-full flex-col gap-3 h-fit p-3 mb-6",
                "justify-center items-center",
            )}
        >
            <div className={cl("flex gap-0 w-full h-5 rounded-xl")}>
                <div className="w-[60%] h-full bg-gradient-to-r from-gray-600 via-gray-400 via-95% to-green-500 rounded-l-xl">
                    <div className="w-px h-16 -translate-y-2 bg-light-text/50 dark:bg-dark-text/50"></div>
                </div>
                <div className="w-[20%] h-full bg-green-500"></div>
                <div className="w-[10%] h-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className="w-px h-16 -translate-y-2 bg-light-text/50 dark:bg-dark-text/50"></div>
                </div>
                <div className="w-[5%] h-full bg-purple-500"></div>
                <div className="w-[5%] h-full bg-gradient-to-r from-purple-500 to-red-500 to-50% rounded-r-xl"></div>
                <div>
                    <div className="w-px h-16 -translate-y-2 bg-light-text/50 dark:bg-dark-text/50 max-sm:hidden"></div>
                </div>
            </div>
            <div className="select-none flex relative w-full h-fit bg-green-500">
                <p className="absolute max-sm:text-xs max-sm:left-[7.5%] left-[34%]">
                    Basic keywords
                </p>
                <p className="absolute max-sm:text-xs left-[83.5%]">
                    Seasonal keywords
                </p>
            </div>
        </div>
    )
}

export default LimitedKeywordsScale
