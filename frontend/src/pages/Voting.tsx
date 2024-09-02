import Navbar from "../components/nav/Navbar"
import AddKeywordForm from "../components/AddKeywordForm"
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
import { ReactNode, Fragment, useState, useEffect } from "react"
import icons from "../data/icons"
import Button from "../components/ui/Button"
import { CandidateInfo } from "../types/CandidateInfo"
import { SortingType } from "../types/VotingSort"
import useWallet from "../hooks/useWallet"
import KeywordCandidate from "../components/KeywordCandidate"
import { encodeKeyword } from "../utils/keywordEncoding"

type ActivePage = "Voting" | "Archive"

// TODO: MAINNET: much better popup and dedicated component
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

const Voting = () => {

    const [activePage, setActivePage] = useState<ActivePage>("Voting")
    // Info tooltip - "What is this?"
    const [infoVisible, setInfoVisible] = useState<boolean>(false)
    // Add your keyword form
    const [addKeywordVisible, setAddKeywordVisible] = useState<boolean>(false)

    const [candidatesReady, setCandidatesReady] = useState<boolean>(false)
    const [candidates, setCandidates] = useState<CandidateInfo[]>([])
    const { seasonsGovernorContract } = useWallet()

    // Submitting new candidate through the form
    const handleSubmitKeyword = async (keyword: string) => {
        const encodedCandidateId = encodeKeyword(keyword)
        console.log('encoded ', encodedCandidateId)
        const res = await seasonsGovernorContract.addCandidate(encodedCandidateId)
        const recp = await res.wait()
        console.log(res)
        console.log(recp)
        console.log(recp?.logs)
    }

    const handleCandidateUpvoted = async (word: bigint) => { 

    }
    const handleCandidateDownvoted = async (word: bigint) => {

    }
    const handleCandidateCancelVote = async (word: bigint) => {

    }
    const handleCandidatePromoted = async (word: bigint) => { 

    }

    const handleCandidateAdded = async (word: bigint) => {
        console.log('awdawd ' ,word)
    }

    useEffect(() => {
        seasonsGovernorContract.on(seasonsGovernorContract.filters.CandidateAdded, handleCandidateAdded)
        seasonsGovernorContract.on(seasonsGovernorContract.filters.CandidateUpvoted, handleCandidateUpvoted)
        seasonsGovernorContract.on(seasonsGovernorContract.filters.CandidateDownvoted, handleCandidateDownvoted)
        seasonsGovernorContract.on(seasonsGovernorContract.filters.CandidateCancelVote, handleCandidateCancelVote)
        seasonsGovernorContract.on(seasonsGovernorContract.filters.CandidatePromoted, handleCandidatePromoted)

        return () => {
            seasonsGovernorContract.off(seasonsGovernorContract.filters.CandidateAdded, handleCandidateAdded)
            seasonsGovernorContract.off(seasonsGovernorContract.filters.CandidateUpvoted, handleCandidateUpvoted)
            seasonsGovernorContract.off(seasonsGovernorContract.filters.CandidateDownvoted, handleCandidateDownvoted)
            seasonsGovernorContract.off(seasonsGovernorContract.filters.CandidateCancelVote, handleCandidateCancelVote)
            seasonsGovernorContract.off(seasonsGovernorContract.filters.CandidatePromoted, handleCandidatePromoted)
        }
    }, [])

    useEffect(() => {
        if (candidatesReady) return

        (async () => {
            const candList = await seasonsGovernorContract.getTopCandidatesInfo(100n)
            setCandidates(candList.map((cand, idx) => {
                const c: CandidateInfo = {
                    id: idx,
                    keyword: cand[1],
                    score: Number(cand[2].toString().substring(0, cand[2].toString().length - 19)),
                    author: cand[3],
                    iteration: 1
                }
                return c
            }))
            setCandidatesReady(true)
        })()

    }, [candidates, candidatesReady])

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
                                onSubmit={handleSubmitKeyword}
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
                                            pick which of these keywords
                                            they&apos;d like to see in use.
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
                        candidates={candidates}
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
    candidates: CandidateInfo[]
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
        5: compareAlphabetically("Descending"), // BY_K2EYWORD_ASC
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
                {props.candidates.length > 0 &&
                    <ul
                        role="list"
                        className="w-full divide-y divide-light-border dark:divide-dark-border"
                    >
                        {props.candidates
                            .sort(sortCompareFns[sorting])
                            .map((candData, idx) => (
                                <KeywordCandidate data={candData} key={idx} />
                            ))}
                    </ul>
                }
            </div>
        </div>
    )
}


export default Voting
