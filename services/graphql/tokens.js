export const getAllTokensQuery = () =>
  `query GetTokens {
    tokens {
      decimals
      derivedKLAY
      derivedUSD
      id
      name
      symbol
      totalLiquidity
      totalSupply
      totalTransactions
      tradeVolume
      tradeVolumeUSD
      untrackedVolumeUSD
    }
  }`;
