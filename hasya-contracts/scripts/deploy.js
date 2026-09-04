import { network } from "hardhat";

const { ethers } = await network.connect();

const [deployer] = await ethers.getSigners();
console.log("Deploying with:", deployer.address);

const Hasya = await ethers.getContractFactory("Hasya");
const hasya = await Hasya.deploy({ value: ethers.parseEther("0.01") });

await hasya.waitForDeployment();
const address = await hasya.getAddress();

console.log("Hasya deployed to:", address);
console.log("Funded with: 0.01 ETH");
