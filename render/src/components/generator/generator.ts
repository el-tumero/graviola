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

// export type GenerationPhase = (typeof generationPhase)[number]
