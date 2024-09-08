import { CandidateInfo } from "../types/CandidateInfo"
import { clsx as cl } from "clsx"
import icons from "../data/icons"

const KeywordCandidate = (props: { data: CandidateInfo }) => (
    <div
        className={cl(
            "flex w-full h-fit p-3 justify-between items-center overflow-x-hidden",
            "max-md:gap-2 max-md:justify-start max-md:items-start",
            "even:bg-light-border/30 even:dark:bg-dark-border/30",
            "odd:bg-light-bgDark/30 odd:dark:bg-dark-bgLight/30",
            "first:rounded-t-md last:rounded-b-md",
        )}
    >
        {/* Pre-left part: global item index */}
        <div className="mr-2 self-center w-6">
            <span className="font-mono text-light-text/75 dark:text-dark-text/75">
                {props.data.id}.
            </span>
        </div>
        {/* Left part: Id, Badge, Keyword, Iteration info */}
        <div
            className={cl(
                "flex flex-nowrap gap-3 justify-center items-center w-1/2 h-full",
                "max-md:w-full",
            )}
        >
            <div
                className={cl(
                    "w-8 h-8 flex justify-center items-center",
                    !props.data.badge && [
                        "border-2 border-light-border dark:border-dark-border",
                        "border-dashed rounded-md",
                    ],
                )}
            >
                {props.data.badge && <img src={props.data.badge} />}
            </div>
            <div className="flex w-full flex-1 gap-0.5 justify-start items-center">
                <p className="mr-1 font-mono text-light-text/75 dark:text-dark-text/75 text-[10px] mb-1.5">
                    ({props.data.iteration})
                </p>
                <p>{props.data.keyword}</p>
            </div>
        </div>
        {/* Right part: Score, Upvote, Downvote */}
        <div
            className={cl(
                "w-1/2 flex justify-end items-center h-full gap-3",
                "max-md:w-full",
            )}
        >
            <div className={cl("flex w-24 justify-end items-center")}>
                <span className="font-semibold font-mono">
                    {props.data.score}
                </span>
            </div>
            <div className="flex gap-1.5 flex-nowrap">
                <div
                    className={cl(
                        "rounded-lg w-8 h-8 p-1 flex justify-center items-center cursor-pointer -rotate-90",
                        "border border-light-border dark:border-dark-border",
                        "bg-light-bgDark/50 dark:bg-dark-bgLight/20",
                        "hover:bg-accentDark/50 hover:dark:bg-accent/50 duration-300 transition-colors",
                        "hover:border-accentDark hover:dark:border-accent",
                        "text-accentDark dark:text-accent",
                    )}
                >
                    {icons.arrow}
                </div>
                <div
                    className={cl(
                        "rounded-lg w-8 h-8 p-1 flex justify-center items-center cursor-pointer rotate-90",
                        "border border-light-border dark:border-dark-border",
                        "bg-light-bgDark/50 dark:bg-dark-bgLight/20",
                        "hover:bg-red-500/50 hover:dark:bg-red-500/50 duration-300 transition-colors",
                        "hover:border-red-500 hover:dark:border-red-500",
                        "text-red-500 dark:text-red-500",
                    )}
                >
                    {icons.arrow}
                </div>
            </div>
        </div>
    </div>
)

export default KeywordCandidate
