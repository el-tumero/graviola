import type { Card } from "."

export type SupportedEvents =
    | "RequestVRFSent"
    | "RequestVRFFulfilled"
    | "RequestOAOSent"
    | "RequestOAOFulfilled"

type EventMessageVRF = {
    eventName: "RequestVRFSent" | "RequestVRFFulfilled"
}

type EventMessageOAO = {
    eventName: "RequestOAOSent" | "RequestOAOFulfilled"
    card: Card
}

export type EventMessage = {
    requestId: string
    initiator: string
} & (EventMessageVRF | EventMessageOAO)
