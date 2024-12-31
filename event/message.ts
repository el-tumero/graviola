import type { Card, EventMessage, SupportedEvents } from "@graviola/core"

const isVRFEventName = (
    eventName: SupportedEvents,
): eventName is "RequestVRFSent" | "RequestVRFFulfilled" =>
    eventName === "RequestVRFSent" || eventName === "RequestVRFFulfilled"

export const createEventMessage = (
    requestId: bigint,
    eventName: SupportedEvents,
    initiator: string,
    card?: Card,
): EventMessage => {
    if (isVRFEventName(eventName)) {
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
