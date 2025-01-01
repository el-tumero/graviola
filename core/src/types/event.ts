import type { Card } from "./card"

export type SupportedEvents =
    | "RequestVRFSent"
    | "RequestVRFFulfilled"
    | "RequestOAOSent"
    | "RequestOAOFulfilled"

type EventMessageDefault = {
    eventName: "RequestVRFSent" | "RequestVRFFulfilled" | "RequestOAOSent"
}

type EventMessageCard = {
    eventName: "RequestOAOFulfilled"
    card: Card
}

export type EventMessage = {
    requestId: string
    initiator: string
} & (EventMessageDefault | EventMessageCard)
