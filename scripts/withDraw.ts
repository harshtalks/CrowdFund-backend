const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { owner } = await getNamedAccounts();
  const crowdFund = await ethers.getContract("CrowdFund", owner);
  console.log(`Got contract CrowdFund at ${crowdFund.address}`);
  console.log("Withdrawing from contract...");
  const transactionResponse = await crowdFund.withDraw();
  await transactionResponse.wait();
  console.log("Got it back!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
