import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const DECIMAL = "8";
const INITAL_PRICE = "200000000000"; // 2000 $

const DeployMock = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { owner } = await getNamedAccounts();

  const chainID = network.config.chainId;

  if (chainID === 31337) {
    log(
      "Local network has been detected, publishing/deploying the mock AggregatorV3 contract on the localhost."
    );
    log("Mock being deployed....");
    await deploy("MockV3Aggregator", {
      from: owner,
      log: true,
      contract: "MockV3Aggregator", // just to be specific
      waitConfirmations: 1,
      args: [DECIMAL, INITAL_PRICE],
    });
    log("Mock deployed");
    log("--------------------------------------");
    log(
      "You are deploying to a local network, you'll need a local network running to interact"
    );
    log(
      "Please run `npx hardhat console` to interact with the deployed smart contracts!"
    );
    log("--------------------------------------");
  }
};

export default DeployMock;

DeployMock.tags = ["all", "mocks"];
