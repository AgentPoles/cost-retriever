import axios from 'axios';

const retrieveCost = (costKey, relayer) => {
  switch (relayer) {
    case 'gelato': {
      return gelatoCostRetriever(costKey);
    }
  }
};

const gelatoCostRetriever = async (taskId) => {
  const url = process.env.GELATO_RELAYER_STATUS_URL + taskId;
  const gelatoResponse = await axios.get(url);
  const transactionHash = gelatoResponse.data.task.transactionHash;
  const indexerResponse = await axios.get(process.env.INDEXER_URL, {
    params: {
      module: 'proxy',
      action: 'eth_getTransactionByHash',
      txhash: transactionHash,
      apikey: process.env.INDEXER_API_KEY,
    },
  });
  const gas = indexerResponse.data.result.gas;
  const gasPriceInGWei = indexerResponse.data.result.gasPrice / 1000000000;
  const cost = calculateTransactionFee(gas, gasPriceInGWei);
  return addPremium(cost);
};

const calculateTransactionFee = (gasUsed, gasPriceInGwei) => {
  const gasPriceInEthers = gasPriceInGwei / 1000000000;
  const transactionFee = gasUsed * gasPriceInEthers;
  return transactionFee;
};

const addPremium = (cost: number) => {
  const premiumIncrement: number = 100 + parseInt(process.env.PREMIUM);
  return (cost * premiumIncrement) / 100;
};

export default retrieveCost;
