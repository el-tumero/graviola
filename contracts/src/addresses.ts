import localAddresses from '../addresses-local.json'
import testnetAddresses from '../addresses-testnet.json'
import { DeployedContractAddressData } from '../utils/contracts'

const addresses: Record<'local' | 'testnet', DeployedContractAddressData> = {
    local: localAddresses,
    testnet: testnetAddresses,
}

export { addresses }
