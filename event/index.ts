export const GENERATION_TOPIC = "generation"

export type SupportedEvents =
    | "RequestVRFSent"
    | "RequestVRFFulfilled"
    | "RequestOAOSent"
    | "RequestOAOFulfilled"

export type MetadataFlat = {
    description: string
    image: string
    probability: number
    score: number
    seasonId: number
}

type EventMessageVRF = {
    eventName: "RequestVRFSent" | "RequestVRFFulfilled"
}

type EventMessageOAO = {
    eventName: "RequestOAOSent" | "RequestOAOFulfilled"
    metadata: MetadataFlat
}

export type EventMessage = {
    requestId: string
    initiator: string
} & (EventMessageVRF | EventMessageOAO)
