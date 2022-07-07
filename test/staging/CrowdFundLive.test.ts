import assert from "assert";
import { ethers, getNamedAccounts, network } from "hardhat";
import { Address } from "hardhat-deploy/dist/types";
import { developmentChains } from "../../helper-hardhat.config";
import { CrowdFund } from "../../typechain-types/contracts/CrowdFund";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("CrowdFund Live", () => {
      let crowdFund: CrowdFund;
      let owner: Address;

      const valueToSend = ethers.utils.parseEther("0.01");

      beforeEach(async () => {
        owner = (await getNamedAccounts()).owner;
        crowdFund = await ethers.getContract("CrowdFund", owner);
      });

      it("allows people to send money and and then owner to retreive: ", async () => {
        await crowdFund.fund({ value: valueToSend });
        await crowdFund.withDraw();

        const startingFundBalance = await crowdFund.provider.getBalance(
          crowdFund.address
        );

        assert.equal(startingFundBalance.toString(), "0");
      });
    });
