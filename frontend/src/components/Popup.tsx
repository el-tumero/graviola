import { clsx as cl } from "clsx"
import { cn } from "../utils/cn"
import icons from "../data/icons"
import { useEffect, useState } from "react"

type PopupType = "err" | "warn" | "neutral"

export interface PopupBase {
    type: PopupType
    message?: string
}

interface PopupProps extends PopupBase {
    additionalClasses?: string
    onClickClose: () => void
    disableCloseButton?: true
}

const Popup = ({ additionalClasses, type, onClickClose, message, disableCloseButton }: PopupProps) => {

    const [active, setActive] = useState<boolean>(message ? true : false)

    const getTypeBorderStyles = () => {
        return (type === "neutral") ? "border-light-border dark:border-dark-border"
            : (type === "err") ? "border-red-500/75 dark:border-red-500/75" :
                "border-yellow-400/75 dark:border-yellow-400/75"
    }

    const handleClose = () => {
        setActive(false)
        setTimeout(() => onClickClose(), 200)
    }

    useEffect(() => {
        if (!active && message) {
            setActive(true)
        }
    }, [message])

    if (!message) return <></>
    else return (
        <div className={cn(
            "sticky",
            "max-w-sm top-20 right-3 self-end flex flex-col w-auto z-30",
            "rounded-lg border backdrop-blur-md",
            "transition-all duration-200",
            "bg-light-bgDark/50 dark:bg-dark-bgLight/25",
            getTypeBorderStyles(),
            active ? "opacity-100" : "translate-x-full opacity-0",
            additionalClasses
        )}>
            <div className="flex w-full h-fit justify-between items-center font-bold font-mono px-3 py-1.5">
                <p>{type === "err" ? "Error" : (type === "warn") ? "Warning" : "Info"}</p>

                {!disableCloseButton ?
                    (<div onClick={handleClose} className={cl(
                        "h-6 w-6 cursor-pointer rounded-md",
                        "text-light-text/50 dark:text-dark-text/50 stroke-[0.25em]",
                        "border-2 border-light-text/50 dark:border-dark-text/50",
                        "hover:opacity-90 active:opacity-60"
                    )}> {icons.close}
                    </div>) : <></>
                }
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