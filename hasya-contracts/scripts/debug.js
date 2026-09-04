import { network } from "hardhat";

const connection = await network.getOrCreate();
console.log("keys:", Object.keys(connection));
console.log("ethers:", connection.ethers);
