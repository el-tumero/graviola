import Navbar from "../components/Navbar"
import ContentContainer from "../components/ui/ContentContainer"
import FullscreenContainer from "../components/ui/FullscreenContainer"
import HorizontalLine from "../components/ui/HorizontalLine"

const Announcement = () => {

    return (
        <FullscreenContainer>
            <Navbar />

            <ContentContainer additionalClasses="flex-col gap-4 text-pretty">

                <div className="flex flex-col gap-4 w-full h-fit justify-center items-center my-28">
                    <h1 className='font-bold text-2xl'>Announcement!</h1>
                </div>

                <div className="flex flex-col gap-3 p-4">

                    <div className="flex flex-col gap-3 my-6">
                        <h2 className="text-xl font-semibold underline underline-offset-3">
                            This project was developed during the&nbsp;
                            <a href="https://autonomous-agent.devpost.com/" className="text-blue-600 underline">Autonomous Agent: AI x Web3 Hackathon</a>
                            , and we're thrilled to announce that the&nbsp;
                            <a href="https://x.com/EdgeAGI/status/1774929712436965453" className="text-blue-600 underline">results are in</a>
                            &nbsp;—&nbsp;<span className="text-accent font-semibold">Graviola</span> won the ORA Bounty 2!! 🎉
                        </h2>
                        <p>
                            We want to share some insights about the process of creating Graviola and our experience with the tools we used. We’re also excited to talk about what’s next for Graviola.
                        </p>
                    </div>

                    <HorizontalLine />

                    <div className="flex flex-col gap-3 my-6">
                        <h2 className="text-xl font-semibold underline underline-offset-3">Building Graviola</h2>
                        <p>
                            We stumbled upon ORA.io just before the hackathon started and were blown away by the capability to run <a href="https://docs.ora.io/doc/technology/opml" className="text-blue-600 underline">Stable Diffusion 2 and LLaMA 2 (7B)</a> on Ethereum.
                        </p>
                        <p>
                            We all dig <a href="https://cryptopunks.app/" className="text-blue-600 underline">CryptoPunks</a>, but there's a hitch: they're too cookie-cutter and similar. We decided to take it up a notch by creating something far more unpredictable.
                        </p>
                        <p>
                            Graviola is a dynamically generated NFT collection powered by the generative AI model (SD2). This setup, based on a dynamic collection of keywords and artificial intelligence, adds an element of surprise, as the outcome is unpredictable — even to us. This contrasts with NFTs that are pre-designed before minting.
                        </p>
                        <p>
                            The randomness of Graviola is its biggest draw — the rarity of our images is based on probability. We also allow trading three images for one completely new one, increasing the likelihood of obtaining a rarer image during this exchange.
                        </p>
                    </div>

                    <HorizontalLine />

                    <div className="flex flex-col gap-3 my-6">
                        <h2 className="text-xl font-semibold underline underline-offset-3">Future Plans</h2>
                        <p>
                            Winning the Bounty is just the beginning. We believe this project has potential and is worth developing further. We’ve set several goals for advancing our app:
                        </p>
                        <ul className="list-disc list-inside">
                            <li>Enhance our NFT generation mechanisms.</li>
                            <li>Introduce ERC20 Graviola Token and Tokenomics.</li>
                            <li>Build a community and social media presence for users.</li>
                            <li>Decentralize the protocol through a DAO — allowing users to define the direction Graviola takes (We plan to introduce seasonal, limited keywords and expanding the metadata.)</li>
                            <li>Improve UX.</li>
                            <li>Launch on the mainnet.</li>
                        </ul>
                    </div>

                    <HorizontalLine />

                    <div className="flex flex-col gap-3 my-6">
                        <h2 className="text-xl font-semibold underline underline-offset-3">Acknowledgements</h2>
                        <p>
                            We’d like to thank the team at ORA.io for providing such convenient and innovative tools, which made it possible to create Graviola. Our developer experience was exceptional. We are eager to see how ORA technology evolves and are rooting for your continued success.
                        </p>
                    </div>
                </div>

            </ContentContainer>
        </FullscreenContainer>
    )
}

export default Announcement