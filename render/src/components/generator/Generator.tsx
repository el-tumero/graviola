import CardGenerate from "../card/generator/CardGenerate"
import GeneratorButton from "./GeneratorButton"
import { useEffect, useState } from "react"
import {
    GenerationPhase,
    GenerationStatus,
    waitForStateChange,
} from "./generator"
import { useStore } from "@nanostores/react"
import { $user } from "../../store/user"
import cl from "clsx"
import { propertiesToCard, type Card, type Keyword } from "@graviola/core"
import { getCollectionReadProxy, getGeneratorContract } from "../../wallet"

interface Props {}

const Generator: React.FC<Props> = () => {
    const [phase, setPhase] = useState<number>(GenerationPhase.NONE)
    const [keywords, setKeywords] = useState<Keyword[]>([])
    const user = useStore($user)
    const [requestId, setRequestId] = useState<string>("")
    const [card, setCard] = useState<Card | undefined>(undefined)

    useEffect(() => {
        ;(async () => {
            if (user.address === "0x") return
            const generator = getGeneratorContract()
            const requests = await generator.getUserGeneratorRequests(
                user.address,
            )
            const lastRequest = requests[requests.length - 1]
            const requestStatus = Number(
                await generator.getGeneratorRequestStatus(lastRequest),
            )

            if (requestStatus !== GenerationStatus.OAO_RESPONSE) {
                setRequestId(lastRequest.toString())
                setPhase(requestStatus)
            }
        })()
    }, [user])

    useEffect(() => {
        ;(async () => {
            if (requestId === "") return
            const generator = getGeneratorContract()
            switch (phase) {
                case GenerationPhase.PREPARE_LOAD: {
                    await waitForStateChange(
                        generator,
                        requestId,
                        GenerationStatus.VRF_RESPONSE,
                    )
                    setPhase(GenerationPhase.PREPARE_COMPLETE)
                    break
                }

                case GenerationPhase.GENERATE_LOAD: {
                    const collectionReadProxy = getCollectionReadProxy()
                    await waitForStateChange(
                        generator,
                        requestId,
                        GenerationStatus.OAO_RESPONSE,
                    )
                    const tokenId = await generator.getTokenId(requestId)
                    const properties =
                        await collectionReadProxy.getProperties(tokenId)
                    console.log(properties)
                    await addCard(propertiesToCard(tokenId, properties))
                    setPhase(GenerationPhase.GENERATE_COMPLETE)
                    break
                }

                default: {
                    break
                }
            }
        })()
    }, [phase, requestId])

    const addCard = async (card: Card) => {
        console.log(card)
        setKeywords((keywords) => [...keywords, card.keywords[0]])
        await new Promise((r) => setTimeout(r, 1000))
        setKeywords((keywords) => [...keywords, card.keywords[1]])
        await new Promise((r) => setTimeout(r, 1000))
        setKeywords((keywords) => [...keywords, card.keywords[2]])
        await new Promise((r) => setTimeout(r, 1000))
        setCard(card)
    }

    const nextPhase = () => {
        setPhase((phase + 1) % Object.keys(GenerationPhase).length)
    }

    const prevPhase = () => {
        if (phase === GenerationPhase.PREPARE_LOAD) {
            setPhase(GenerationPhase.NONE)
        }

        if (phase === GenerationPhase.GENERATE_LOAD) {
            setPhase(GenerationPhase.PREPARE_COMPLETE)
        }
    }

    return (
        <>
            <div className="mt-4 mb-10">
                <CardGenerate phase={phase} keywords={keywords} card={card} />
            </div>
            <div className="flex justify-center">
                {user.address !== "0x" ? (
                    <GeneratorButton
                        phase={phase}
                        requestId={requestId}
                        setRequestId={setRequestId}
                        nextPhase={nextPhase}
                        prevPhase={prevPhase}
                    />
                ) : (
                    <p
                        className={cl(
                            "px-5 py-2 w-64 text-center text-lg rounded-xl",
                            "text-light-textSecondary dark:text-dark-textSecondary",
                            "uppercase",
                            "cursor-default",
                            "bg-light-bgLight",
                            "dark:bg-dark-bgLight",
                        )}
                    >
                        Please connect your wallet
                    </p>
                )}
            </div>
        </>
    )
}

export default Generator
