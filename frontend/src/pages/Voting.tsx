import Navbar from "../components/nav/Navbar"
import { clsx as cl } from "clsx"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import PageTitle from "../components/ui/layout/PageTitle"
import SectionContainer from "../components/ui/layout/SectionContainer"
import { useState } from "react"

type ActivePage = "Voting" | "Archive"

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
                    ? <KeywordVotingPage /> : <></>
                }

            </ContentContainer>

        </FullscreenContainer>
    )
}

const KeywordVotingPage = () => {
    return (
        <div className={cl(
            "flex flex-col justify-start items-start w-3/4 h-fit self-center",
            "border border-light-border dark:border-dark-border rounded-lg p-1",
        )}>

            <ul role="list" className="w-full divide-y divide-light-border dark:divide-dark-border">
                <KeywordCandidate />
                <KeywordCandidate />
                <KeywordCandidate />
                <KeywordCandidate />
                <KeywordCandidate />
                <KeywordCandidate />
            </ul>


        </div>
    )
}

const KeywordCandidate = () => (
    <div className={cl(
        "flex w-full h-fit px-1.5 py-3 justify-between items-center overflow-x-hidden",
        "max-lg:flex-col max-lg:justify-start max-lg:items-start",
        "even:bg-light-bgDark/20 even:dark:bg-dark-bgLight/20",
        "odd:bg-light-bgDark/40 odd:dark:bg-dark-bgLight/40",
        "first:rounded-t-md last:rounded-b-md"
    )}>
        {/* Left part - badge + keyword container (with iteration info) */}
        <div className={cl("flex flex-nowrap gap-1 justify-center items-center w-2/3 h-full")}>
            <div className="w-8 h-8 flex justify-center items-center bg-gray-400/50">
                🔥
            </div>
            <div className="flex w-full flex-1 gap-0.5 justify-start items-center">
                <p>WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW</p>
                <p className="font-mono text-[10px] mb-1.5">(3)</p>
            </div>
        </div>
        {/* Right part - Score + upvote, downvote */}
        <div className={cl(
            "w-1/3 flex justify-between items-center h-full gap-3"
        )}>
            <div className={cl("flex flex-1 justify-end items-center")}>
                <p className="text-gray-600">Score: 240</p>
            </div>
            <div className={cl("w-8 h-8 flex justify-center items-center bg-gray-400/50")}>{'\u2191'}</div>
            <div className={cl("w-8 h-8 flex justify-center items-center bg-gray-400/50")}>{'\u2193'}</div>
        </div>
    </div>
)

export default Voting
