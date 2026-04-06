import { ethers } from "ethers";
import { CeloClickerConfig, LeaderboardEntry, UserStats } from "./types";

const ABI = [
  "function tap() external",
  "function globalCounter() external view returns (uint256)",
  "function userCounter(address) external view returns (uint256)",
  "function getUserCount(address user) external view returns (uint256)",
  "function getLeaderboard() external view returns (address[10], uint256[10])",
  "function topAddresses(uint256) external view returns (address)",
  "function topScores(uint256) external view returns (uint256)",
];

export class CeloClickerClient {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  public contractAddress: string;

  constructor(config: CeloClickerConfig) {
    const rpcUrl = config.rpcUrl || "https://forno.celo.org";
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contractAddress = config.contractAddress;
    this.contract = new ethers.Contract(config.contractAddress, ABI, this.provider);
  }

  async getGlobalCount(): Promise<number> {
    const count = await this.contract.globalCounter();
    return Number(count);
  }

  async getUserCount(address: string): Promise<UserStats> {
    const count = await this.contract.getUserCount(address);
    return { taps: Number(count) };
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const [addresses, scores] = await this.contract.getLeaderboard();
    const entries: LeaderboardEntry[] = [];
    for (let i = 0; i < 10; i++) {
      const addr = addresses[i];
      const score = Number(scores[i]);
      if (addr !== ethers.ZeroAddress && score > 0) {
        entries.push({ address: addr, score, rank: i + 1 });
      }
    }
    return entries;
  }
}

export { ABI as CELO_CLICKER_ABI };
