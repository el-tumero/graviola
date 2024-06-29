import { clsx as cl } from "clsx"
import icons from "../data/icons"

type PopupType = "err" | "warn" | "neutral"

interface PopupProps {
    type: PopupType
    onClickClose: () => void
    message?: string
}

const Popup = ({ type, onClickClose, message }: PopupProps) => {

    const getTypeBorderStyles = () => {
        return (type === "neutral") ? "border-light-border dark:border-dark-border"
            : (type === "err") ? "border-red-500/75 dark:border-red-500/75" :
                "border-yellow-400/75 dark:border-yellow-400/75"
    }

    if (!message) return <></>
    else return (
        <div className={cl(
            "max-w-sm absolute top-20 right-3 flex flex-col w-auto z-[9999]",
            "rounded-lg border backdrop-blur-md",
            "bg-light-bgDark/50 dark:bg-dark-bgLight/25",
            getTypeBorderStyles()
        )}>
            <div className="flex w-full h-fit justify-between items-center font-bold font-mono p-3">
                <p>{type === "err" ? "Error" : (type === "warn") ? "Warning" : "Info"}</p>
                <div onClick={onClickClose} className={cl(
                    "h-6 w-6 cursor-pointer rounded-md",
                    "text-light-text/75 dark:text-dark-text/75 stroke-[0.3em]",
                    "border-2 border-light-text/75 dark:border-dark-text/75",
                    "hover:opacity-90 active:opacity-60"
                )}>
                    {icons.close}
                </div>
            </div>
            <div className={cl(
                "p-3 font-mono text-sm rounded-b-md m-1",
                "bg-light-bgPrimary dark:bg-dark-bgLight/50",
                "break-words"
            )}>
                {message}
            </div>
        </div>

    )
}

export default Popup