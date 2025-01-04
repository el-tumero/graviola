import cl from "clsx"
import { GenerationPhase, generationPhaseMessages } from "./generator"
import { GraviolaGenerator__factory } from "@graviola/contracts"
import { addresses } from "@graviola/contracts"
import { getSigner } from "../../wallet"

interface Props {
    phase: number
    requestId: string
    nextPhase: () => void
    prevPhase: () => void
}

const GeneratorButton: React.FC<Props> = ({
    phase,
    requestId,
    nextPhase,
    prevPhase,
}) => {
    const enabled =
        phase == GenerationPhase.NONE ||
        phase == GenerationPhase.PREPARE_COMPLETE ||
        phase == GenerationPhase.GENERATE_COMPLETE

    const handleClick = async () => {
        const signer = getSigner()
        if (!signer) return

        const generator = GraviolaGenerator__factory.connect(
            addresses.local.GENERATOR_ADDRESS,
            signer,
        )

        switch (phase) {
            case GenerationPhase.NONE: {
                nextPhase()
                try {
                    const fee = await generator.estimateServiceFee()
                    const prepare = await generator.prepare({
                        gasLimit: 1_000_000,
                        value: fee + 1_000n,
                    })
                    const tx = await prepare.wait()
                    console.log(tx)
                } catch (err) {
                    console.log(err)
                    prevPhase()
                }
                break
            }
            case GenerationPhase.PREPARE_COMPLETE: {
                nextPhase()
                try {
                    if (!requestId) return
                    const generate = await generator.generate(
                        BigInt(requestId),
                        {
                            gasLimit: 1_000_000,
                        },
                    )
                    const tx = await generate.wait()
                    console.log(tx)
                } catch (err) {
                    console.log(err)
                    prevPhase()
                }
                break
            }
            default: {
                break
            }
        }
    }

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
            onClick={handleClick}
        >
            {generationPhaseMessages[phase]}
        </button>
    )
}

export default GeneratorButton
