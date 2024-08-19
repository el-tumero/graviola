import Navbar from "../components/nav/Navbar"
import { clsx as cl } from "clsx"
import {
    compareById,
    compareAlphabetically,
    compareByScore,
} from "../utils/sort"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import PageTitle from "../components/ui/layout/PageTitle"
import SectionContainer from "../components/ui/layout/SectionContainer"
import candJson from "../../../contracts/candidates.json"
import {
    ChangeEvent,
    ReactNode,
    Fragment,
    useContext,
    useState,
    useEffect,
} from "react"
import { getKeyword } from "../utils/getKeyword"
import { RaritiesData } from "../types/RarityGroup"
import icons from "../data/icons"
import Button from "../components/ui/Button"

type ActivePage = "Voting" | "Archive"

export interface CandidateInfo {
    id: number
    badge?: null // Cache server
    author: string
    keyword: string
    iteration: number
    score: number
}

enum SortingType {
    BY_ID = 1,
    BY_SCORE_ASC,
    BY_SCORE_DESC,
    BY_KEYWORD_ASC,
    BY_KEYWORD_DESC,
    // BY_KWORD_ITER_ASC, // Future default?
    // BY_KWORD_ITER_DESC,
    // BY_BADGE           // Cache
    // BY_TRENDING
}

const PopupContainer = (props: { children: ReactNode }) => {
    return (
        <div
            className={cl(
                "flex w-2/3 h-fit top-1/2 left-1/2 -translate-x-1/2 translate-y-[90%]",
                "absolute",
                "p-3 rounded-lg border border-light-border dark:border-dark-border",
                "bg-light-bgPrimary/75 dark:bg-dark-bgPrimary/75 backdrop-blur-3xl",
                "shadow-md z-[99]",
            )}
        >
            {props.children}
        </div>
    )
}

const AddKeywordForm = (props: { onClickClose: () => void }) => {
    const KEYWORD_MIN_LENGTH = 3
    const [keyword, setKeyword] = useState<string>("")
    const [valid, setValid] = useState<boolean>(false)
    const displayErrMsg = keyword.length > KEYWORD_MIN_LENGTH && !valid

    // TODO: Need better regex for keywords later
    const isValid = (str: string) => /^[a-z]{3,32}$/.test(str)

    useEffect(() => {
        if (keyword.length < KEYWORD_MIN_LENGTH) {
            setValid(false)
            return
        }
        setValid(isValid(keyword))
    }, [keyword, valid])

    const handleSubmitKeyword = async () => {
        // Call contract
    }

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
                        onClick={() => handleSubmitKeyword()}
                    />
                </div>
            </div>
        </Fragment>
    )
}

const Voting = () => {
    const [activePage, setActivePage] = useState<ActivePage>("Voting")
    // Info tooltip - "What is this?"
    const [infoVisible, setInfoVisible] = useState<boolean>(false)
    // Add your keyword form
    const [addKeywordVisible, setAddKeywordVisible] = useState<boolean>(false)

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col gap-4 h-full">
                <PageTitle title="Voting Panel" additionalClasses="mb-3" />

                {/* Add keyword form */}
                <div className="relative">
                    {addKeywordVisible && (
                        <PopupContainer>
                            <AddKeywordForm
                                onClickClose={() => setAddKeywordVisible(false)}
                            />
                        </PopupContainer>
                    )}
                </div>

                {/* What is this: Floating Popup */}
                <div className="relative">
                    {infoVisible && (
                        <PopupContainer>
                            <Fragment>
                                <div
                                    onClick={() => setInfoVisible(false)}
                                    className={cl(
                                        "flex w-6 h-6 justify-center items-center cursor-pointer place-self-start",
                                    )}
                                >
                                    {icons.close}
                                </div>
                                <div
                                    className={cl(
                                        "flex flex-col w-full px-3 leading-6",
                                    )}
                                >
                                    <div className="mb-1.5">
                                        <p>
                                            {
                                                "Each graviolaNFT season lasts exactly "
                                            }
                                            <span className="font-semibold underline underline-offset-2">
                                                3 months
                                            </span>
                                            {"."}
                                        </p>
                                    </div>
                                    <div className="text-light-textSecondary dark:text-dark-textSecondary">
                                        <p>
                                            During each season, holders can add
                                            new keyword candidates for the
                                            upcoming season.
                                        </p>
                                        <p>
                                            The community can then judge and
                                            pick which of these keywords they'd
                                            like to see in use.
                                        </p>
                                        <p>
                                            This panel allows to vote, track and
                                            browse all current keyword
                                            candidates.
                                        </p>
                                        <p>
                                            Go ahead and add your own keyword to
                                            the list {":)"}
                                        </p>
                                    </div>
                                </div>
                            </Fragment>
                        </PopupContainer>
                    )}
                </div>

                <SectionContainer additionalClasses="gap-0 p-1 w-2/3 self-center">
                    <div
                        onClick={() => setActivePage("Voting")}
                        className={cl(
                            "flex justify-center items-center w-1/2 h-fit",
                            "p-2 rounded-l-lg",
                            activePage === "Voting"
                                ? [
                                      "border border-light-text/25 dark:border-dark-text/25",
                                      "bg-light-border/30 dark:bg-dark-border/30",
                                  ]
                                : [
                                      "cursor-pointer",
                                      "border-light-border dark:border-dark-border",
                                  ],
                        )}
                    >
                        <p className="select-none">Voting</p>
                    </div>

                    <div
                        onClick={() => setActivePage("Archive")}
                        className={cl(
                            "flex justify-center items-center w-1/2 h-fit",
                            "p-2 rounded-r-lg",
                            activePage === "Archive"
                                ? [
                                      "border border-light-text/25 dark:border-dark-text/25",
                                      "bg-light-border/30 dark:bg-dark-border/30",
                                  ]
                                : [
                                      "cursor-pointer",
                                      "border-light-border dark:border-dark-border",
                                  ],
                        )}
                    >
                        <p className="select-none">Archive</p>
                    </div>
                </SectionContainer>

                {activePage === "Voting" ? (
                    <KeywordVotingPage
                        onClickInfo={() => setInfoVisible(true)}
                        onClickAddKeyword={() => setAddKeywordVisible(true)}
                    />
                ) : (
                    <ArchivePage />
                )}
            </ContentContainer>
        </FullscreenContainer>
    )
}

const ArchivePage = () => <p className="self-center">Soon</p>

const KeywordVotingPage = (props: {
    onClickInfo: () => void
    onClickAddKeyword: () => void
}) => {
    // Default sort is always by id (same order as we got from the contract)
    const [sorting, setSorting] = useState<SortingType>(SortingType["BY_ID"])
    // Map sorting types (enum) to compare fns
    const sortCompareFns: Record<
        number,
        (a: CandidateInfo, b: CandidateInfo) => number
    > = {
        1: compareById, // BY_ID
        2: compareByScore("Ascending"), // BY_SCORE_ASC
        3: compareByScore("Descending"), // BY_SCORE_DESC
        4: compareAlphabetically("Ascending"), // BY_KEYWORD_ASC
        5: compareAlphabetically("Descending"), // BY_KEYWORD_ASC
    }

    return (
        <div
            className={cl(
                "flex w-2/3 h-fit flex-col justify-start items-start self-center",
                "max-md:w-full",
            )}
        >
            {/* Control Panel for Voting */}
            <div
                className={cl(
                    "flex flex-wrap w-full h-fit justify-between items-center",
                    "gap-3 mb-3",
                )}
            >
                <SectionContainer additionalClasses="p-3 font-mono flex-row justify-between max-md:flex-col">
                    <p>
                        Season: <span className="font-bold">Summer 2024</span>
                    </p>
                    <p>
                        Ends on: <span className="font-bold">DD MM YYYY</span>
                    </p>
                </SectionContainer>

                {/* What is this = floating tooltip explaining the purpose of Voting */}
                <div className="flex gap-3">
                    <Button text="What is this?" onClick={props.onClickInfo} />
                    <Button
                        text="Add keyword"
                        onClick={props.onClickAddKeyword}
                    />
                </div>

                {/* Sorting */}
                <div className="flex gap-3">
                    <div className="flex gap-1 justify-center items-center">
                        <p>Sort by:</p>
                        <select
                            onChange={(e) => setSorting(+e.target.value)}
                            defaultValue={sorting}
                            name="votingSortSelect"
                            className={cl(
                                "p-1 rounded-lg border border-light-border dark:border-dark-border",
                                "bg-light-bgDark/50 dark:bg-dark-bgLight/50",
                                "focus:outline-none",
                            )}
                        >
                            <option value={SortingType["BY_ID"]}>
                                {"Id (Default)"}
                            </option>
                            <option value={SortingType["BY_SCORE_ASC"]}>
                                {"Score (Low -> High)"}
                            </option>
                            <option value={SortingType["BY_SCORE_DESC"]}>
                                {"Score (High -> Low)"}
                            </option>
                            <option value={SortingType["BY_KEYWORD_ASC"]}>
                                {"Alphabetically (A -> Z)"}
                            </option>
                            <option value={SortingType["BY_KEYWORD_DESC"]}>
                                {"Alphabetically (Z -> A)"}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div
                className={cl(
                    "flex w-3/4 self-center h-fit mb-24",
                    "border border-light-border dark:border-dark-border rounded-lg p-1",
                )}
            >
                <ul
                    role="list"
                    className="w-full divide-y divide-light-border dark:divide-dark-border"
                ></ul>
            </div>
        </div>
    )
}

const KeywordCandidate = (props: CandidateInfo) => (
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
                {props.id}.
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
                    !props.badge && [
                        "border-2 border-light-border dark:border-dark-border",
                        "border-dashed rounded-md",
                    ],
                )}
            >
                {props.badge && <img src={props.badge} />}
            </div>
            <div className="flex w-full flex-1 gap-0.5 justify-start items-center">
                <p className="mr-1 font-mono text-light-text/75 dark:text-dark-text/75 text-[10px] mb-1.5">
                    ({props.iteration})
                </p>
                <p>{props.keyword}</p>
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
                <span className="font-semibold font-mono">{props.score}</span>
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

export default Voting
