export const getAllPairsQuery = () => `
  query PairsQuery {
    pairs {
      id
      name
      reserve0
      reserve1
      reserveKLAY
      reserveUSD
      liquidityProviderCount
    }
  }
`;
