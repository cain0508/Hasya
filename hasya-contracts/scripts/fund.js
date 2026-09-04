import { network } from "hardhat";

const CONTRACT = "0xAfcaB0b183444D8b2b3813Fbea8493800D6df356";

const { ethers } = await network.connect();
const [owner] = await ethers.getSigners();

const tx = await owner.sendTransaction({
  to: CONTRACT,
  value: ethers.parseEther("0.01"),
});
await tx.wait();

console.log("Funded contract with 0.01 ETH");
console.log("Tx:", tx.hash);

const balance = await ethers.provider.getBalance(CONTRACT);
console.log("Contract balance:", ethers.formatEther(balance), "ETH");
