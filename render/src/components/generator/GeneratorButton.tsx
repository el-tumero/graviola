import cl from "clsx"
import { useState } from "react"
import { generationPhaseMessages, type GenerationPhase } from "./generator"

interface Props {
    phase: GenerationPhase
    nextPhase: () => void
}

const GeneratorButton: React.FC<Props> = ({ phase, nextPhase }) => {
    const enabled =
        phase == "NONE" ||
        phase == "PREPARE_COMPLETE" ||
        phase == "GENERATE_COMPLETE"

    return (
        <button
            className={cl(
                "px-5 py-2 text-lg rounded-xl",
                "text-light-textSecondary dark:text-dark-textSecondary",
                "uppercase",

                enabled
                    ? [
                          "bg-accentDark",
                          "shadow-[0_8px_0_0_rgba(15,115,52,1)]",
                          "hover:shadow-[0_6px_0_0_rgba(15,115,52,1)]",
                          "hover:translate-y-[2px]",
                          "active:shadow-[0_4px_0_0_rgba(15,115,52,1)]",
                          "active:translate-y-[4px]",
                      ]
                    : [
                          "cursor-default",
                          "bg-dark-bgLight",
                          "shadow-[0_8px_0_0_rgba(25,26,25,1)]",
                          "animate-pulse",
                      ],
            )}
            onClick={nextPhase}
        >
            {generationPhaseMessages[phase]}
        </button>
    )
}

export default GeneratorButton
