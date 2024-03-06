import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";


async function main() {
  const [acc0] = await ethers.getSigners()

  const aiOracleAddress = "0xb880D47D3894D99157B52A7F869aB3B1E2D4349d"
  const linkAddress = "0x779877a7b0d9e8603169ddbd7836e478b4624789"
  const vrfHostAddress = "0x20f6ade65F4416d4bA64113191c373766bfea0E4"
  
  // link token
  const link = await ethers.getContractAt("LinkTokenInterface", linkAddress)

  // aiOracle
  // const aiOracle = await ethers.getContractAt("IAIOracle", aiOracleAddress)

  // vrfHost
  // const vrfHost = await ethers.getContractAt("VRFHostConsumerInterface", aiOracleAddress)

  const Graviola = await ethers.getContractFactory("Graviola")
  const graviola = await Graviola.deploy(aiOracleAddress, vrfHostAddress)


  // Upkeep registration
  // Sepolia Registry: 0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad
  // Sepolia Registrar: 0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976
  const Registrar = await ethers.getContractFactory("GraviolaRegisterUpkeep")
  const registrar = await Registrar.deploy(await link.getAddress(), "0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976")

  const trTx = await link.transfer(await registrar.getAddress(), parseEther("2"))
  await trTx.wait()

  const regTx = await registrar.register({
    name: "test upkeep",
    encryptedEmail: "0x",
    upkeepContract: await graviola.getAddress(),
    gasLimit: 500000n,
    adminAddress: acc0.address,
    triggerType: 0n,
    checkData: "0x",
    triggerConfig: "0x",
    offchainConfig: "0x",
    amount: parseEther("2")
  })
  const {logs: logs1} = (await regTx.wait())!
  
  const upkeepId = (logs1.find((evt) => evt instanceof EventLog && evt.fragment.name == "UpkeepRegistered") as EventLog).args[0] as bigint
  console.log("Upkeep id:", upkeepId)
  console.log("Graviola address", await graviola.getAddress())
  // const data = await registry.getUpkeep(upkeepId)
  // console.log(data)


  console.log("Deploy script")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
