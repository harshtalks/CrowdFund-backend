import assert from "assert";
import { expect } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { CrowdFund } from "../../typechain-types/contracts/CrowdFund";
import { developmentChains } from "../../helper-hardhat.config";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("CrowdFund", () => {
      let crowdFund: CrowdFund;
      let mockV3Aggregator: any;
      let owner: string;

      const valueToSend = ethers.utils.parseEther("1");

      beforeEach(async () => {
        owner = (await getNamedAccounts()).owner;
        await deployments.fixture(["all"], { keepExistingDeployments: true });
        crowdFund = await ethers.getContract("CrowdFund", owner);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", owner);
      });

      describe("constructor", () => {
        it("sets the aggregator addresses correctly", async () => {
          const response = await crowdFund.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("fund", () => {
        it("it fails to send when you don't have enough money to deposit fund. ", async () => {
          await expect(crowdFund.fund()).to.be.revertedWith(
            "You need to spend more funds."
          );
        });

        it("now we will transfer the stated amount 1 ETHER to the contract and expect it to be equal to the balance provided by the stated address.", async () => {
          await crowdFund.fund({ value: valueToSend });
          const response = await crowdFund.getAmountFundedByTheAddress(owner);
          assert(response.toString(), valueToSend.toString());
        });

        it("Adds the person who just deposited funds to the funders history", async () => {
          await crowdFund.fund({ value: valueToSend });
          const response = await crowdFund.getFunder(0);
          assert.equal(response, owner);
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await crowdFund.fund({ value: valueToSend });
        });

        it("Withdrawing ETH from a single funder", async () => {
          const startingFundBalance = await crowdFund.provider.getBalance(
            crowdFund.address
          );

          const startingDeployerBalance = await crowdFund.provider.getBalance(
            owner
          );

          const transactionResponse = await crowdFund.withDraw();

          const transactionReceipt = await transactionResponse.wait();

          const { gasUsed, effectiveGasPrice } = transactionReceipt;

          const totalGasPrice = gasUsed.mul(effectiveGasPrice);

          const endingFundBalance = await crowdFund.provider.getBalance(
            crowdFund.address
          );

          const endingDeployerBalance = await crowdFund.provider.getBalance(
            owner
          );

          assert(endingFundBalance.toString(), "0");

          assert(
            startingFundBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(totalGasPrice).toString()
          );
        });

        it("With multiple funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 6; i++) {
            const connectAccounttoCrowdFund = crowdFund.connect(accounts[i]);

            await connectAccounttoCrowdFund.fund({ value: valueToSend });
          }

          const startingFundBalance = await crowdFund.provider.getBalance(
            crowdFund.address
          );

          const startingDeployerBalance = await crowdFund.provider.getBalance(
            owner
          );

          const transactionResponse = await crowdFund.withDraw();

          const transactionReceipt = await transactionResponse.wait();

          const { gasUsed, effectiveGasPrice } = transactionReceipt;

          const gasUsedTotal = gasUsed.mul(effectiveGasPrice);

          const endingFundmeBalance = await crowdFund.provider.getBalance(
            crowdFund.address
          );

          const endingDeployerBalance = await crowdFund.provider.getBalance(
            owner
          );

          assert.equal(
            startingFundBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasUsedTotal).toString()
          );

          await expect(crowdFund.getFunder(0)).to.be.reverted;

          for (let i = 1; i < 6; i++) {
            assert.equal(
              await crowdFund.getAmountFundedByTheAddress(accounts[i].address),
              0
            );
          }
        });

        it("Only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners();
          const fundMeConnectedContract = crowdFund.connect(accounts[1]);
          await expect(fundMeConnectedContract.withDraw()).to.be.revertedWith(
            "CrowdFund__NotOwner"
          );
        });
      });
    });
