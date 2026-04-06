export interface LeaderboardEntry {
  address: string;
  score: number;
  rank: number;
}

export interface UserStats {
  taps: number;
}

export interface CeloClickerConfig {
  contractAddress: string;
  rpcUrl?: string;
}
