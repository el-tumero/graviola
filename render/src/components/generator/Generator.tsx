import CardGenerate from "../card/generator/CardGenerate"
import GeneratorButton from "./GeneratorButton"
import { useEffect, useRef, useState } from "react"
import { GenerationPhase } from "./generator"
import { useStore } from "@nanostores/react"
import { $user } from "../../store/user"
import cl from "clsx"
import type { EventMessage, Card, Keyword } from "@graviola/core"

interface Props {}

const Generator: React.FC<Props> = () => {
    const [phase, setPhase] = useState<number>(GenerationPhase.NONE)
    const [keywords, setKeywords] = useState<Keyword[]>([])
    const user = useStore($user)
    const ws = useRef<WebSocket | null>(null)
    const [requestId, setRequestId] = useState<string>("")
    const [card, setCard] = useState<Card | undefined>(undefined)

    useEffect(() => {
        if (user.address === "0x") return

        ws.current = new WebSocket("ws://localhost:8085")
        ws.current.onopen = () => console.log("ws opened")
        ws.current.onclose = () => console.log("ws closed")

        const wsCurrent = ws.current

        if (ws.current) {
            ws.current.onmessage = (e) => {
                const message: EventMessage = JSON.parse(e.data)
                if (message.initiator !== user.address) return
                console.log(message)

                switch (message.eventName) {
                    case "RequestVRFFulfilled": {
                        setPhase(GenerationPhase.PREPARE_COMPLETE)
                        setRequestId(message.requestId)
                        break
                    }

                    case "RequestOAOFulfilled": {
                        setPhase(GenerationPhase.GENERATE_COMPLETE)
                        addCard(message.card)
                        console.log("RequestOAOFulfilled", message)
                        break
                    }

                    default: {
                        break
                    }
                }
            }
        }

        return () => {
            wsCurrent.close()
        }
    }, [user])

    const addCard = async (card: Card) => {
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
            <div className="flex justify-center my-8">
                <CardGenerate keywords={keywords} card={card} />
            </div>
            <div className="flex justify-center">
                {user.address !== "0x" ? (
                    <GeneratorButton
                        phase={phase}
                        requestId={requestId}
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
                            "bg-dark-bgLight",
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
