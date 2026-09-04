import { network } from "hardhat";

const CONTRACT = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const { ethers } = await network.connect();
const [owner, user] = await ethers.getSigners();

const abi = [
  "function submitScore(address user, uint256 score) external payable",
  "function totalEarned(address) external view returns (uint256)",
  "event Rewarded(address indexed user, uint256 score, uint256 reward)"
];

const hasya = new ethers.Contract(CONTRACT, abi, owner);

const balanceBefore = await ethers.provider.getBalance(user.address);
console.log("User balance before:", ethers.formatEther(balanceBefore), "ETH");

const tx = await hasya.submitScore(user.address, 80);
await tx.wait();
console.log("Score submitted: 80");

const balanceAfter = await ethers.provider.getBalance(user.address);
console.log("User balance after:", ethers.formatEther(balanceAfter), "ETH");

const earned = await hasya.totalEarned(user.address);
console.log("Total earned on-chain:", ethers.formatEther(earned), "ETH");
