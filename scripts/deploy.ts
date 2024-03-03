import { AbiCoder, Contract, EventLog, id, parseEther } from "ethers";
import { ethers } from "hardhat";


async function main() {
  const [acc0] = await ethers.getSigners()

  const KEYHASH = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"

  // link token
  const link = await ethers.getContractAt("LinkTokenInterface", "0x779877a7b0d9e8603169ddbd7836e478b4624789")

  // aiOracle
  const aiOracle = await ethers.getContractAt("IAIOracle", "0xb880D47D3894D99157B52A7F869aB3B1E2D4349d")

  // create vrf sub
  const vrfCoordinator = await ethers.getContractAt("VRFCoordinatorV2","0x8103b0a8a00be2ddc778e6e7eaa21791cd364625")
  const subTx = await vrfCoordinator.createSubscription()
  const {logs: logs0} = (await subTx.wait())!
  const [subId] = (logs0.find(evt => evt instanceof EventLog && evt.fragment.name === "SubscriptionCreated") as EventLog).args as unknown as [bigint, string]


  const args = AbiCoder.defaultAbiCoder().encode(["uint256"], [subId])
  const ltx = await link.transferAndCall(await vrfCoordinator.getAddress(), ethers.parseEther("0.5"), args)
  await ltx.wait()

  const Graviola = await ethers.getContractFactory("Graviola")
  const graviola = await Graviola.deploy(subId, await vrfCoordinator.getAddress(), KEYHASH, await aiOracle.getAddress())

  const acTx = await vrfCoordinator.addConsumer(subId, await graviola.getAddress())
  await acTx.wait()

  // const subDetails = await vrfCoordinator.getSubscription(subId)
  // console.log(subDetails)

  // Sepolia Registry: 0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad
  // Sepolia Registrar: 0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976
  // const registrar = await ethers.getContractAt("GraviolaRe", "0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976")
  const Registrar = await ethers.getContractFactory("GraviolaRegisterUpkeep")
  const registrar = await Registrar.deploy(await link.getAddress(), "0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976")


  // const addr = acc0.address
  const trTx = await link.transfer(await registrar.getAddress(), parseEther("0.5"))
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
    amount: parseEther("0.5")
  })
  const {logs: logs1} = (await regTx.wait())!
  
  const upkeepId = (logs1.find((evt) => evt instanceof EventLog && evt.fragment.name == "UpkeepRegistered") as EventLog).args[0] as bigint

  console.log(upkeepId)




  console.log("Deploy script")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
