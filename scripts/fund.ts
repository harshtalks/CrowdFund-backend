import { ethers, getNamedAccounts } from "hardhat";

async function main() {
  const { owner } = await getNamedAccounts();

  const crowdFund = await ethers.getContract("CrowdFund", owner);

  console.log(`Got contract CrowdFund at ${crowdFund.address}`);
  console.log("Funding contract...");

  const transactionResponse = await crowdFund.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await transactionResponse.wait();
  console.log("Funded!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
