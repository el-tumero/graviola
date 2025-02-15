import cl from "clsx"
// TODO: move web3 logic to seperate file
import { GenerationPhase, generationPhaseMessages } from "./generator"
import { getSigner, getGeneratorContract } from "../../wallet"

interface Props {
    phase: number
    requestId: string
    setRequestId: (requestId: string) => void
    nextPhase: () => void
    prevPhase: () => void
}

const GeneratorButton: React.FC<Props> = ({
    phase,
    requestId,
    setRequestId,
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
        const generator = getGeneratorContract()

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

                    const requests = await generator.getUserGeneratorRequests(
                        await signer.getAddress(),
                    )
                    const lastRequest = requests[requests.length - 1]
                    setRequestId(lastRequest.toString())
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
                          "dark:bg-dark-bgLight",
                          "dark:shadow-[0_8px_0_0_rgba(25,26,25,1)]",
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
