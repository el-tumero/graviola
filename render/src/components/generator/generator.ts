export const generationPhase = [
    "NONE",
    "PREPARE_LOAD",
    "PREPARE_COMPLETE",
    "GENERATE_LOAD",
    "GENERATE_KEYWORDS",
    "GENERATE_COMPLETE",
] as const

export const generationPhaseMessages = {
    NONE: "Prepare",
    PREPARE_LOAD: "Waiting for generation seed...",
    PREPARE_COMPLETE: "Generate",
    GENERATE_LOAD: "Generating...",
    GENERATE_KEYWORDS: "Generating...",
    GENERATE_COMPLETE: "Completed",
}

export type GenerationPhase = (typeof generationPhase)[number]
