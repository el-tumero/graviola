import { useState } from "react"
import { $user } from "../../store/user"
import { getUserAddress, setupDevWallet } from "../../wallet"
import cl from "clsx"

const DevWallet = () => {
    const [isConnected, setIsConnected] = useState(false)

    const handleClick = async () => {
        await setupDevWallet()
        $user.setKey("address", getUserAddress() || "0x")
        console.log("DEV WALLET ADDRESS:", getUserAddress())
        setIsConnected(true)
    }

    return (
        <div className="mx-auto w-fit">
            <button
                className={cl(
                    " border-solid border-2 p-2 rounded-lg",
                    isConnected
                        ? "text-green-500 border-green-500"
                        : "text-gray-300 border-gray-300",
                )}
                onClick={handleClick}
            >
                DEV MODE
            </button>
        </div>
    )
}

export default DevWallet
