import type { GraviolaGenerator } from "@graviola/contracts/typechain"

export const generationPhaseMessages = [
    "Prepare",
    "Waiting for generation seed...",
    "Generate",
    "Generating...",
    "Generating...",
    "Completed",
]

export const GenerationPhase = {
    NONE: 0,
    PREPARE_LOAD: 1,
    PREPARE_COMPLETE: 2,
    GENERATE_LOAD: 3,
    GENERATE_KEYWORDS: 4,
    GENERATE_COMPLETE: 5,
} as const

export const GenerationStatus = {
    NON_EXISTENT: 0,
    VRF_WAIT: 1,
    VRF_RESPONSE: 2,
    OAO_WAIT: 3,
    OAO_RESPONSE: 4,
} as const

const STATE_CHANGE_INTERVAL = 2000

export const waitForStateChange = (
    generator: GraviolaGenerator,
    requestId: string,
    targetStatus: number,
) => {
    return new Promise<void>((resolve) => {
        const timer = window.setInterval(async () => {
            const status = await generator.getGeneratorRequestStatus(requestId)
            console.log("Waiting for the request state to change")
            if (Number(status) === targetStatus) {
                clearInterval(timer)
                resolve()
            }
        }, STATE_CHANGE_INTERVAL)
    })
}
