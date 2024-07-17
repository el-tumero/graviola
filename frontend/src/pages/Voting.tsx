import Navbar from "../components/nav/Navbar"
import { clsx as cl } from "clsx"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import PageTitle from "../components/ui/layout/PageTitle"
import SectionContainer from "../components/ui/layout/SectionContainer"
import candidateMockList from "../../../contracts/candidates.json"
import { useContext, useState } from "react"
import { getKeyword } from "../utils/getKeyword"
import { GraviolaContext } from "../contexts/GraviolaContext"
import { RaritiesData } from "../types/RarityGroup"

type ActivePage = "Voting" | "Archive"

interface CandidateInfo {
    id: number
    badge?: null // Later
    author: string
    keyword: string
    iteration: number
    score: number
}

const Voting = () => {

    const [activePage, setActivePage] = useState<ActivePage>("Voting")

    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col gap-4 h-full">

                <PageTitle title="Voting Panel" additionalClasses="mb-3" />

                <SectionContainer additionalClasses="gap-0 p-1 w-2/3 self-center">
                    <div onClick={() => setActivePage("Voting")} className={cl(
                        "flex justify-center items-center w-1/2 h-fit",
                        "p-2 rounded-l-lg",
                        activePage === "Voting" ? [
                            "border border-light-text/25 dark:border-dark-text/25",
                            "bg-light-border/30 dark:bg-dark-border/30",
                        ] : [
                            "cursor-pointer",
                            "border-light-border dark:border-dark-border"
                        ]
                    )}>
                        <p className="select-none">
                            Voting
                        </p>
                    </div>

                    <div onClick={() => setActivePage("Archive")} className={cl(
                        "flex justify-center items-center w-1/2 h-fit",
                        "p-2 rounded-r-lg",
                        activePage === "Archive" ? [
                            "border border-light-text/25 dark:border-dark-text/25",
                            "bg-light-border/30 dark:bg-dark-border/30",
                        ] : [
                            "cursor-pointer",
                            "border-light-border dark:border-dark-border"
                        ]
                    )}>
                        <p className="select-none">
                            Archive
                        </p>
                    </div>
                </SectionContainer>

                {activePage === "Voting"
                    ? <KeywordVotingPage /> : <ArchivePage />
                }

            </ContentContainer>

        </FullscreenContainer>
    )
}

const ArchivePage = () => <p className="self-center">Soon</p>

const KeywordVotingPage = () => {

    const { rarities } = useContext(GraviolaContext) as {
        rarities: RaritiesData
    }

    // TODO: Popup with info (sketch)
    const [infoVisible, setInfoVisible] = useState<boolean>(false)

    const mockCandidates = candidateMockList.map((data, i) => {
        const candidateData: CandidateInfo = {
            id: i,
            author: data[2],
            keyword: getKeyword(+data[0] - 1, rarities)[0], // -1 to avoid out of bounds absIdx
            iteration: 0,
            score: +data[1],
        }
        return candidateData
    })

    return (
        <div className={cl(
            "flex w-1/2 h-fit flex-col justify-start items-start self-center",
            "max-md:w-full"
        )}>

            {/* Control Panel for Voting */}
            <div className={cl("flex flex-wrap w-full h-fit justify-between items-center", "gap-3 mb-3")}>
                {/* Show Legend / Tooltip / Tutorial or whatever you wanna call it btn */}
                <div className="flex gap-3">
                    <div onClick={() => setInfoVisible(true)} className={cl(
                        "flex justify-center items-center rounded-lg",
                        "border border-light-border dark:border-dark-border",
                        "bg-light-bgDark/50 dark:bg-dark-bgLight/50 cursor-pointer"
                    )}>
                        <span className="font-mono p-2">info</span>
                    </div>
                </div>

                {/* Sorting */}
                <div className="flex gap-3">
                    <div className="flex gap-1 justify-center items-center">
                        <p>Sort by:</p>
                        <select defaultValue={"id"} name="votingSortBy"
                            className={cl(
                                "p-1 rounded-lg border border-light-border dark:border-dark-border",
                                "bg-light-bgDark/50 dark:bg-dark-bgLight/50"
                            )}
                        >
                            <option value="id">{"Id (Default)"}</option>
                            <option value="scoreAsc">{"Score (Low -> High)"}</option>
                            <option value="scoreDesc">{"Score (High -> Low)"}</option>
                            <option value="alphabetAsc">{"Alphabetically (A -> Z)"}</option>
                            <option value="alphabetDesc">{"Alphabetically (Z -> A)"}</option>
                        </select>
                    </div>
                </div>

            </div>

            <div className={cl(
                "flex w-full h-fit",
                "border border-light-border dark:border-dark-border rounded-lg p-1",
            )}>

                <ul role="list" className="w-full divide-y divide-light-border dark:divide-dark-border">
                    {mockCandidates.map((candInfo, idx) => (
                        <KeywordCandidate {...candInfo} key={idx} />
                    ))}
                </ul>
            </div>

        </div>

    )
}

const KeywordCandidate = (props: CandidateInfo) => (
    <div className={cl(
        "flex w-full h-fit p-3 justify-between items-center overflow-x-hidden",
        "max-md:gap-2 max-md:justify-start max-md:items-start",
        "even:bg-light-border/30 even:dark:bg-dark-border/30",
        "odd:bg-light-bgDark/30 odd:dark:bg-dark-bgLight/30",
        "first:rounded-t-md last:rounded-b-md"
    )}>
        {/* Left part: Id, Badge, Keyword, Iteration info */}
        <div className="mr-2 self-center">
            <span className="font-mono text-light-text/75 dark:text-dark-text/75">{props.id}.</span>
        </div>
        <div className={cl("flex flex-nowrap gap-3 justify-center items-center w-2/3 h-full", "max-md:w-full")}>
            <div className={cl(
                "w-8 h-8 flex justify-center items-center",
                !props.badge && ["border-2 border-light-border dark:border-dark-border", "border-dashed rounded-md"]
            )}>
                {props.badge && <img src={props.badge} />}
            </div>
            <div className="flex w-full flex-1 gap-0.5 justify-start items-center">
                <p>{props.keyword}</p>
                <p className="font-mono text-light-text/75 dark:text-dark-text/75 text-[10px] mb-1.5">
                    ({props.iteration})
                </p>
            </div>
        </div>
        {/* Right part: Score, Upvote, Downvote */}
        <div className={cl(
            "w-1/3 flex justify-between items-center h-full gap-3", "max-md:w-full"
        )}>
            <div className={cl("flex flex-1 justify-end items-center", "max-md:justify-start")}>
                <p className="text-gray-600">
                    <span className="text-xs text-light-text/75 dark:text-dark-text/75 font-mono">score: </span>
                    <span className="font-semibold">{props.score}</span>

                    {/* TODO: Clean this. Testing */}
                    {props.id === 2 &&
                        <span className="text-accent/75">{" (+4)"}</span>
                    }
                </p>
            </div>
            <div className={cl(
                "rounded-lg w-8 h-8 flex justify-center items-center cursor-pointer",
                "border border-light-border dark:border-dark-border",
                "bg-light-bgDark dark:bg-dark-bgLight",
                "hover:bg-accent/50 hover:dark:bg-accent/50 duration-300 transition-colors",
                "hover:border-accent hover:dark:border-accent"
            )}>{'\u2191'}
            </div>
            <div className={cl(
                "rounded-lg w-8 h-8 flex justify-center items-center cursor-pointer",
                "border border-light-border dark:border-dark-border",
                "bg-light-bgDark dark:bg-dark-bgLight",
                "hover:bg-red-500/50 hover:dark:bg-red-500/50 duration-300 transition-colors",
                "hover:border-red-500 hover:dark:border-red-500"
            )}>{'\u2193'}
            </div>
        </div>
    </div>
)

export default Voting
