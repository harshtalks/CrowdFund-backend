import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import verification from "../utils/verification";
import {
  networkConfigObject,
  developmentChains,
} from "../helper-hardhat.config";

const DeployCrowdFund: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments } = hre;

  // first we need an owner to claim the contract
  // the claimed contract will be transacted by the owner speicified here.
  const { log, deploy } = deployments;

  const { owner } = await getNamedAccounts();

  // get Chain Id

  const chainID = network.config.chainId;

  let ethPriceFeedAddress;
  if (chainID === 31337) {
    const aggregator = await deployments.get("MockV3Aggregator");
    ethPriceFeedAddress = aggregator.address;
  } else {
    if (chainID) {
      ethPriceFeedAddress = networkConfigObject[chainID].ethUsdPriceFeed;
    }
  }

  // deployment

  log("-----------");
  log("Deploying CrowdFund and waiting for confirmations...");
  log(`deployer: ${owner}`);
  const crowdFund = await deploy("CrowdFund", {
    from: owner,
    contract: "CrowdFund", // to be specified
    log: true,
    waitConfirmations: 1,
    args: [ethPriceFeedAddress],
  });

  log(`CrowdFund successfully deployed at address ${crowdFund.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verification(crowdFund.address, [ethPriceFeedAddress]);
  }
};
export default DeployCrowdFund;
DeployCrowdFund.tags = ["all", "crowd-fund"];
