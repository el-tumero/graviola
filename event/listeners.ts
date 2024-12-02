import type { Server } from "bun"
import {
    GraviolaGenerator__factory,
    GraviolaCollection__factory,
    addresses,
} from "@graviola/contracts"
import { WebSocketProvider } from "ethers"
import { GENERATION_TOPIC } from "./index"
import type { SupportedEvents, Metadata, EventMessage } from "./index"
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

const publishEventMessage = (
    server: Server,
    requestId: bigint,
    eventName: SupportedEvents,
    initiator: string,
    metadata?: Metadata,
) => {
    server.publish(
        GENERATION_TOPIC,
        JSON.stringify(
            createEventMessage(requestId, eventName, initiator, metadata),
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
            const metadata = await collection.getMetadata(tokenId)

            const parsedMetadata = {
                description: metadata.description,
                image: "",
                probability: Number(metadata.probability),
                score: Number(metadata.score),
                seasonId: Number(metadata.seasonId),
            }

            publishEventMessage(
                server,
                requestId,
                "RequestOAOSent",
                initiator,
                parsedMetadata,
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
            const metadata = await collection.getMetadata(tokenId)

            const parsedMetadata = {
                description: metadata.description,
                image: metadata.image,
                probability: Number(metadata.probability),
                score: Number(metadata.score),
                seasonId: Number(metadata.seasonId),
            }

            publishEventMessage(
                server,
                requestId,
                "RequestOAOFulfilled",
                initiator,
                parsedMetadata,
            )
        },
    )
}
