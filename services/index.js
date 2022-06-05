const request = (query) => {
  return fetch(
    "https://graph.ipfs1.dev.infra.soramitsu.co.jp/subgraphs/name/klaytn-subgraph/exchange",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((e) => e);
};
export default request;
