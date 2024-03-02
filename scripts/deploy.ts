import { EventLog } from "ethers";
import { ethers } from "hardhat";

async function main() {

  const [acc0] = await ethers.getSigners()
  // console.log(acc0)
  // link token
  const Link = await ethers.getContractAt("LinkTokenInterface", "0x779877a7b0d9e8603169ddbd7836e478b4624789")
  console.log(await Link.balanceOf(acc0))

  return
  // create vrf sub
  const vrfCoordinator = await ethers.getContractAt("VRFCoordinatorV2","0x8103b0a8a00be2ddc778e6e7eaa21791cd364625")
  const subTx = await vrfCoordinator.createSubscription()
  const {logs} = (await subTx.wait())!
  const [subId] = (logs.find(evt => evt instanceof EventLog && evt.fragment.name === "SubscriptionCreated") as EventLog).args as unknown as [bigint, string]
  

  console.log(logs)



  console.log("Deploy script")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
