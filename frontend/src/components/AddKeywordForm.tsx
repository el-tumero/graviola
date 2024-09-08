import { Fragment, useState, useEffect, ChangeEvent } from "react"
import icons from "../data/icons"
import Button from "./ui/Button"
import { clsx as cl } from "clsx"

const AddKeywordForm = (props: {
    onClickClose: () => void
    onSubmit: (keyword: string) => Promise<void>
}) => {
    const KEYWORD_MIN_LENGTH = 3
    const [keyword, setKeyword] = useState<string>("")
    const [valid, setValid] = useState<boolean>(false)
    const displayErrMsg = keyword.length > KEYWORD_MIN_LENGTH && !valid

    // TODO: Need better regex for keywords later
    const isValid = (str: string) => /^[a-z]{3,32}$/.test(str)

    const handleSubmit = () => {
        if (!isValid(keyword)) return
        props.onSubmit(keyword)
    }

    useEffect(() => {
        if (keyword.length < KEYWORD_MIN_LENGTH) {
            setValid(false)
            return
        }
        setValid(isValid(keyword))
    }, [keyword, valid])

    return (
        <Fragment>
            <div
                onClick={props.onClickClose}
                className={cl(
                    "flex w-6 h-6 justify-center items-center cursor-pointer place-self-start",
                )}
            >
                {icons.close}
            </div>
            <div className={cl("flex flex-col gap-3 px-3 grow")}>
                <div className={cl("flex flex-col grow gap-1.5")}>
                    <p className="font-mono font-semibold mb-1.5">
                        Add your keyword
                    </p>
                    <input
                        placeholder="Your keyword"
                        type="text"
                        value={keyword}
                        className={cl(
                            "self-center w-full h-fit rounded-lg p-3",
                            "bg-light-bgDark/20 dark:bg-dark-bgLight/20",
                            "border border-light-border dark:border-dark-border",
                        )}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setKeyword(e.target.value)
                        }
                    />
                </div>

                {/* Err msg */}
                <div
                    className={cl(
                        "flex flex-col gap-1 relative w-full h-fit rounded-lg border p-3",
                        "border-amber-600 dark:border-amber-600",
                        "bg-amber-500/50 dark:bg-amber-500/50",
                        "backdrop-blur-md font-mono",
                        displayErrMsg ? "opacity-100" : "invisible",
                    )}
                >
                    <p className="font-semibold">
                        Your keyword candidate must be:
                    </p>
                    <p>— Between 3 and 32 characters long</p>
                    <p>— Contain only lowercase a-z characters</p>
                </div>

                <div>
                    <Button
                        text="Add"
                        disabled={!valid}
                        onClick={() => handleSubmit()}
                    />
                </div>
            </div>
        </Fragment>
    )
}

export default AddKeywordForm
