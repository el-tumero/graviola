import type { EventMessage, MetadataFlat, SupportedEvents } from "."

const isVRFEventName = (
    eventName: SupportedEvents,
): eventName is "RequestVRFSent" | "RequestVRFFulfilled" =>
    eventName === "RequestVRFSent" || eventName === "RequestVRFFulfilled"

export const createEventMessage = (
    requestId: bigint,
    eventName: SupportedEvents,
    initiator: string,
    metadata?: MetadataFlat,
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
            metadata: metadata
                ? metadata
                : {
                      description: "",
                      image: "",
                      probability: 0,
                      score: 0,
                      seasonId: 0,
                  },
        }
    }
}
