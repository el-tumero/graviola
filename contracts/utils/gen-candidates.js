const hh = require("hardhat");
// const { randomUUID } = require('node:crypto');
const { createLogger } = require("./fs")
const { writeFileSync } = require("fs")

const LOG_PATH = "candidates.json"
let CANDIDATE_AMOUNT = 100

const log = createLogger(LOG_PATH)

async function main() {

    writeFileSync(LOG_PATH, "")
    try {
        console.log("Starting...")
        // console.log(hh.ethers.Wallet.createRandom([randomUUID().toString()]).address)

        const Factory = await hh.ethers.getContractFactory("TGraviolaSeasonsCandidates")
        const TGraviolaSeasonsCandidates = (await Factory.deploy(100n));
        await TGraviolaSeasonsCandidates.waitForDeployment();

        const Addr = await TGraviolaSeasonsCandidates.getAddress();
        console.log("TGraviolaSeasonsCandidates OK. Addr: ", Addr)

        const sorted = Array.from({length: 100}, (_, i) => i + 1) // Init sorted array of CANDIDATE_AMOUNT len
        // console.log(sorted)

        for (let id of sorted) {
            const d = await TGraviolaSeasonsCandidates.addCandidate(id)
            await TGraviolaSeasonsCandidates.upvoteCandidate(id, id)
        }

        console.log(`Added (${CANDIDATE_AMOUNT}) candidates`)

        const listSize = await TGraviolaSeasonsCandidates.getListSize()
        const candidates = await TGraviolaSeasonsCandidates.getTopCandidatesInfo(listSize)

        const serialized = JSON.stringify(candidates, (_, v) => typeof v === 'bigint' ? v.toString() : v, 4)
        log(serialized)
        console.log("Done")

    } catch (err) {
        console.log("Err: ", err)
    }

}

main()