import type { Server } from "bun"
import {
    GraviolaGenerator__factory,
    GraviolaCollection__factory,
    GraviolaCollectionReadProxy__factory,
    addresses,
} from "@graviola/contracts"
import { WebSocketProvider } from "ethers"
import { GENERATION_TOPIC } from "./index"
import {
    type SupportedEvents,
    type Card,
    propertiesToCard,
} from "@graviola/core"
import { createEventMessage } from "./message"

const provider = new WebSocketProvider("ws://127.0.0.1:8545/")

const generator = GraviolaGenerator__factory.connect(
    addresses.local.GENERATOR_ADDRESS,
    provider,
)

const collection = GraviolaCollection__factory.connect(
    addresses.local.COLLECTION_ADDRESS,
    provider,
)

const collectionReadProxy = GraviolaCollectionReadProxy__factory.connect(
    addresses.local.COLLECTION_READ_PROXY_ADDRESS,
    provider,
)

const publishEventMessage = (
    server: Server,
    requestId: bigint,
    eventName: SupportedEvents,
    initiator: string,
    card?: Card,
) => {
    server.publish(
        GENERATION_TOPIC,
        JSON.stringify(
            createEventMessage(requestId, eventName, initiator, card),
        ),
    )
}

export const setupListeners = (server: Server) => {
    requestVRFSentListener(server)
    requestVRFFulfilledListener(server)
    requestOAOSentListener(server)
    requestOAOFulfilled(server)
}

const requestVRFSentListener = (server: Server) => {
    generator.on(generator.filters.RequestVRFSent, (initiator, requestId) => {
        console.log("RequestVRFSent", initiator, requestId)

        publishEventMessage(server, requestId, "RequestVRFSent", initiator)
    })
}

const requestVRFFulfilledListener = (server: Server) => {
    generator.on(
        generator.filters.RequestVRFFulfilled,
        (initiator, requestId) => {
            console.log("RequestVRFFulfilled", initiator, requestId)
            publishEventMessage(
                server,
                requestId,
                "RequestVRFFulfilled",
                initiator,
            )
        },
    )
}

const requestOAOSentListener = (server: Server) => {
    generator.on(
        generator.filters.RequestOAOSent,
        async (initiator, requestId) => {
            console.log("RequestOAOSent", initiator, requestId)
            const tokenId = await generator.getTokenId(requestId)
            const properties = await collectionReadProxy.getProperties(tokenId)
            const card = propertiesToCard(tokenId, properties)

            publishEventMessage(
                server,
                requestId,
                "RequestOAOSent",
                initiator,
                card,
            )
        },
    )
}

const requestOAOFulfilled = (server: Server) => {
    generator.on(
        generator.filters.RequestOAOFulfilled,
        async (initiator, requestId) => {
            console.log("RequestOAOFulfilled", initiator, requestId)

            const tokenId = await generator.getTokenId(requestId)
            const properties = await collectionReadProxy.getProperties(tokenId)
            const card = propertiesToCard(tokenId, properties)

            publishEventMessage(
                server,
                requestId,
                "RequestOAOFulfilled",
                initiator,
                card,
            )
        },
    )
}
