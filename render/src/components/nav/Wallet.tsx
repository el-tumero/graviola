import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import { useEffect } from "react"
import { $user } from "../../store/user"
import type { Eip1193Provider } from "ethers"
import { removeProvider, setupProvider } from "../../wallet"

const Wallet = () => {
    const { address, isConnected } = useAppKitAccount()
    const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155")

    useEffect(() => {
        if (isConnected) {
            $user.setKey("address", address || "0x")
            setupProvider(walletProvider)
        } else {
            $user.setKey("address", "0x")
            removeProvider()
        }
    }, [isConnected])

    return (
        <div className="mx-auto w-fit">
            <w3m-button size="sm" />
        </div>
    )
}

export default Wallet
