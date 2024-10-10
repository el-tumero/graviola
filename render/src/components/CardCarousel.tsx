import { useState } from "react"
import type { Card } from "../types/Card"

const CardCarousel = ({ cards }: { cards: Card[] }) => {
    const [displayedCard, setDisplayedCard] = useState(0)

    return (
        <>
            <div>
                <img
                    src={cards[displayedCard].image}
                    alt={cards[displayedCard].description}
                    width={128}
                    height={128}
                />
            </div>
            <button
                onClick={() => {
                    setDisplayedCard((prev) => prev + 1)
                }}
            >
                Change
            </button>
        </>
    )
}

export default CardCarousel
