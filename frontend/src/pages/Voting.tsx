import Navbar from "../components/nav/Navbar"
import ContentContainer from "../components/ui/layout/ContentContainer"
import FullscreenContainer from "../components/ui/layout/FullscreenContainer"
import PageTitle from "../components/ui/layout/PageTitle"

const Voting = () => {
    return (
        <FullscreenContainer>
            <Navbar />
            <ContentContainer additionalClasses="flex-col gap-4 h-full">


                <PageTitle title="Voting Panel" />





            </ContentContainer>

        </FullscreenContainer>
    )
}

export default Voting
