import cl from "clsx"
import type { Card } from "../../types/Card"
import CardImage from "./CardImage.tsx"
import { useState } from "react"

export default function CardCarousel({ cards }: { cards: Card[] }) {
    const [selectedCard, setSelectedCard] = useState<number>(0)

    return (
        <div className="flex max-sm:flex-col gap-1 h-full justify-center items-center">
            <div className="flex flex-col max-sm:flex-row flex-grow gap-5 justify-center items-center p-4 mr-1">
                {cards.map((_: Card, i) => {
                    return (
                        <div
                            key={i}
                            className={cl(
                                "w-3 h-3 rounded-full cursor-pointer",
                                "transition-colors duration-300",
                                "hover:bg-light-text dark:hover:bg-dark-text",
                                selectedCard == i
                                    ? "bg-light-text dark:bg-dark-text"
                                    : "bg-light-text/25 dark:bg-dark-text/25",
                                "carousel-dot",
                            )}
                            onClick={() => setSelectedCard(i)}
                        />
                    )
                })}
            </div>
            <div className="w-64 h-64 relative">
                {cards.map((card: Card, i) => (
                    <div
                        key={i}
                        className={cl(
                            "absolute top-0 left-0 w-full h-full transition-opacity duration-600",
                            "carousel-card",
                            selectedCard == i ? "opacity-100" : "opacity-0",
                        )}
                    >
                        <CardImage
                            card={card}
                            breathingEffect={false}
                            size={"large"}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
