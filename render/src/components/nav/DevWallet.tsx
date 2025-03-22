import { useState } from "react"
import { $user } from "../../store/user"
import { getUserAddress, setupDevWallet } from "../../wallet"
import devIcon from "../../assets/dev-icon.png"
import devIconActive from "../../assets/dev-icon-active.png"
import { cn } from "../../utils/cn"

const DevWallet = () => {
    const [isConnected, setIsConnected] = useState(false)

    const handleClick = async () => {
        await setupDevWallet()
        $user.setKey("address", getUserAddress() || "0x")
        console.log("DEV WALLET ADDRESS:", getUserAddress())
        setIsConnected(true)
    }

    return (
        <span
            className={cn(
                "p-2 rounded-xl",
                "dark:text-dark-textSecondary dark:hover:text-dark-text",
                "max-lg:flex max-lg:w-full max-lg:justify-center",
                "max-lg:bg-light-border max-lg:dark:bg-dark-border",
                "hover:bg-light-text/10 dark:hover:bg-dark-text/10",
                "transition-colors duration-300",
            )}
            onClick={handleClick}
        >
            <img
                src={isConnected ? devIconActive.src : devIcon.src}
                alt="dev icon"
            />
        </span>
    )
}

export default DevWallet
