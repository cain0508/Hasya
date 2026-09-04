import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: "0.8.20",
  networks: {
    sepolia: {
      type: "http",
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
});
