import { useEffect, useState } from "react"

// Provides state if the user has Metamask or other web3 wallet extension installed.
export default function useWeb3(): [boolean] {
    const [web3, setWeb3] = useState<boolean>(true) // Default to 'true' in order to avoid flashing from "Loading..." to "Install metamask"

    useEffect(() => {
        console.log(web3)
        checkWeb3()
    }, [web3])

    const checkWeb3 = () => {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setWeb3(false); return
        }
        else setWeb3(true)
    }

    return [web3]
}