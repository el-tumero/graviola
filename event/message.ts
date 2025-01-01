import type { Card, EventMessage, SupportedEvents } from "@graviola/core"

const isDefaultEventName = (
    eventName: SupportedEvents,
): eventName is "RequestVRFSent" | "RequestVRFFulfilled" | "RequestOAOSent" =>
    eventName === "RequestVRFSent" ||
    eventName === "RequestVRFFulfilled" ||
    eventName === "RequestOAOSent"

export const createEventMessage = (
    requestId: bigint,
    eventName: SupportedEvents,
    initiator: string,
    card?: Card,
): EventMessage => {
    if (isDefaultEventName(eventName)) {
        return {
            requestId: requestId.toString(),
            initiator,
            eventName,
        }
    } else {
        return {
            requestId: requestId.toString(),
            initiator,
            eventName,
            card: card
                ? card
                : {
                      id: "",
                      description: "",
                      image: "",
                      keywords: [],
                      rarity: "common",
                      probability: 0,
                      score: 0,
                  },
        }
    }
}
