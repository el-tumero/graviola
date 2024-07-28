import hardhat from "hardhat"
import { writeFileSync } from "fs"
import createLogger from "./logger"

const OUT_PATH = "candidates.json"
const CANDIDATE_AMOUNT = 100

const log = createLogger(OUT_PATH)

async function main() {
    writeFileSync(OUT_PATH, "")
    try {
        console.log("Starting...")

        const factory = await hardhat.ethers.getContractFactory(
            "TGraviolaSeasonsCandidates",
        )
        const gsc = await factory.deploy(100n)
        await gsc.waitForDeployment()

        console.log(
            "TGraviolaSeasonsCandidates address:",
            await gsc.getAddress(),
        )

        const sorted = Array.from({ length: 100 }, (_, i) => i + 1) // Init sorted array of CANDIDATE_AMOUNT len

        for (let id of sorted) {
            const d = await gsc.addCandidate(id)
            await gsc.upvoteCandidate(id, id)
        }

        console.log(`Added (${CANDIDATE_AMOUNT}) candidates`)

        const listSize = await gsc.getListSize()

        const candidates = (await gsc.getTopCandidatesInfo(listSize)).map(
            ({ id, score, author }) => ({
                id: id.toString(),
                score: score.toString(),
                author,
            }),
        )

        let resJson = { candidates }
        log(JSON.stringify(resJson, null, 4))

        console.log("Done")
    } catch (err) {
        console.log("Err: ", err)
    }
}

main()
