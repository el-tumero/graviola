import { useAppKitAccount } from "@reown/appkit/react"
import { useEffect } from "react"
import { $user } from "../store/web3"

const Wallet = () => {
    const { address, isConnected } = useAppKitAccount()

    useEffect(() => {
        $user.setKey("address", address || "0x")
    }, [isConnected])

    return <w3m-button />
}

export default Wallet
