import kip7 from "~/utils/smartcontracts/kip-7.json";
import pairAbi from "~/utils/smartcontracts/pair.json";
import request from "@/services";
import { getAllTokensQuery } from "@/services/graphql/tokens";

export const state = () => ({
  tokensList: [],
  computedToken: null,
  selectedTokens: {
    emptyPair: false,
    pairAddress: null,
    pairBalance: null,
    userBalance: null,
    tokenA: null,
    tokenB: null,
  },
});

// const mockedTokens = [
//   "0xb9920BD871e39C6EF46169c32e7AC4C698688881",
//   "0x1CDcD477994e86A11E21C27ca907bEA266EA3A0a",
//   "0x2486A551714F947C386Fe9c8b895C2A6b3275EC9",
//   "0xAFea7569B745EaE7AB22cF17c3B237c3350407A1",
//   "0xC20A9eB22de0C6920619aDe93A11283C2a07273e",
//   "0xce77229fF8451f5791ef4Cc2a841735Ed4edc3cA",
//   "0xFbcb69f52D6A08C156c543Dd4Dc0521F5F545755",
//   "0x7cB550723972d7F29b047D6e71b62DcCcAF93992",
//   "0xcdBD333BDBB99bC80D77B10CCF74285a97150E5d",
//   "0x246C989333Fa3C3247C7171F6bca68062172992C",
// ];

export const actions = {
  async checkEmptyPair({ commit, state }) {
    const { tokenA, tokenB } = state.selectedTokens;
    if (!tokenA || !tokenB) {
      return;
    }

    const pairAddress = await this.$kaikas.tokens.getPairAddress(
      tokenA.address,
      tokenB.address
    );
    if (this.$kaikas.utils.isEmptyAddress(pairAddress)) {
      commit("SET_SELECTED_TOKENS_EMPTY_PAIR", { emptyPair: true });
      return;
    }

    commit("SET_SELECTED_TOKENS_EMPTY_PAIR", { emptyPair: false });
  },
  async setSelectedTokensByPair({ commit, state }, pairAddress) {
    const pairContract = this.$kaikas.config.createContract(
      pairAddress,
      pairAbi.abi
    );
    const pair = {};
    const token0Address = await pairContract.methods.token0().call({
      from: this.$kaikas.config.address,
    });
    const token1Address = await pairContract.methods.token1().call({
      from: this.$kaikas.config.address,
    });

    const token0 = {};
    const token1 = {};

    const contractToken0 = this.$kaikas.createContract(token0Address, kip7.abi);
    const contractToken1 = this.$kaikas.createContract(token1Address, kip7.abi);

    token0.address = token0Address;
    token0.name = await contractToken0.methods.name().call();
    token0.symbol = await contractToken0.methods.symbol().call();
    token0.balance = await contractToken0.methods
      .balanceOf(this.$kaikas.config.address)
      .call();

    token1.address = token1Address;
    token1.name = await contractToken1.methods.name().call();
    token1.symbol = await contractToken1.methods.symbol().call();
    token1.balance = await contractToken1.methods
      .balanceOf(this.$kaikas.config.address)
      .call();

    pair.tokenA = token0;
    pair.tokenB = token1;

    const { pairBalance, userBalance } =
      await this.$kaikas.tokens.getPairBalance(token0Address, token1Address);

    pair.pairBalance = pairBalance;
    pair.userBalance = userBalance;
    pair.emptyPair = false;
    pair.pairAddress = pairAddress;

    commit("SET_PAIR", pair);
  },
  async getTokens({ commit }) {
    const { data } = await request(getAllTokensQuery());
    const balance = await caver.klay.getBalance(this.$kaikas.config.address);

    const klay = {
      id: "0xae3a8a1D877a446b22249D8676AFeB16F056B44e",
      address: "0xae3a8a1D877a446b22249D8676AFeB16F056B44e",
      symbol: "KLAY",
      name: "Klaytn",
      logo: "-",
      slug: "-",
      balance,
    };

    const listTokens = data.tokens.map(async ({ id, ...token }) => {
      const contract = this.$kaikas.createContract(id, kip7.abi);
      const balance = await contract.methods
        .balanceOf(this.$kaikas.config.address)
        .call();

      return {
        ...token,
        id,
        balance,
        address: id,
      };
    });

    const resultList = await Promise.all([klay, ...listTokens]);

    commit("SET_TOKENS", resultList);
  },
  async setCurrencyRate({ commit }, { id, type }) {
    commit("SET_CURRENCY_RATE", { type, rate: "-" });
  },
};

export const mutations = {
  REFRESH_STORE(store) {
    store = state();
    return state();
  },
  SET_TOKENS(state, tokens) {
    state.tokensList = tokens;
  },
  CLEAR_SELECTED_TOKENS(state) {
    state.selectedTokens = {
      pairBalance: null,
      tokenA: null,
      tokenB: null,
    };
    return state;
  },
  SET_COMPUTED_TOKEN(state, token) {
    state.computedToken = token;
  },
  SET_SELECTED_TOKEN(state, { type, token }) {
    state.selectedTokens[type] = token;
  },
  SET_CURRENCY_RATE(state, { type, rate }) {
    state.selectedTokens[type] = {
      ...state.selectedTokens[type],
      price: rate,
    };
  },
  SET_PAIR(state, selectedToken) {
    state.selectedTokens = { ...selectedToken };
    return state;
  },
  SET_SELECTED_TOKENS_EMPTY_PAIR(state, { emptyPair }) {
    state.selectedTokens = {
      ...state.selectedTokens,
      emptyPair,
    };
  },
  SET_TOKEN_VALUE(state, { type, value, pairBalance, userBalance }) {
    state.selectedTokens = {
      ...state.selectedTokens,
      pairBalance,
      userBalance,
      [type]: {
        ...state.selectedTokens[type],
        value,
      },
    };
  },
};
