import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";

dotenv.config({ path: __dirname + "/.env.example" });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const RINKEBY_URL =
  process.env.RINKEBY_URL !== undefined ? process.env.RINKEBY_URL : "";

const RINKEBY_ACCs =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [""];

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  networks: {
    localhost: {
      chainId: 31337,
    },
    rinkeby: {
      url: RINKEBY_URL,
      chainId: 4,
      accounts: RINKEBY_ACCs,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    coinmarketcap: process.env.COINMARKET_API_KEY!,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    owner: {
      default: 0,
    },
  },
};

export default config;
