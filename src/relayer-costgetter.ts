import axios from 'axios';
import symbolRetriever from './symbol-finder';

const retrieveCost = (costKey, relayer, network) => {
  switch (relayer) {
    case 'gelato': {
      return gelatoCostRetriever(costKey, network);
    }
  }
};

const gelatoCostRetriever = async (taskId, network) => {
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
  const totalCost = addPremium(cost);
  const tokenSymbol = symbolRetriever(network);
  const totalCostInDollar = await retrieveCostInDollar(totalCost, tokenSymbol);
  return { totalCost, totalCostInDollar };
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

const retrieveCostInDollar = async (cost, tokenSymbol) => {
  const response = await axios.get(process.env.PRICE_ORACLE_URL, {
    params: {
      symbol: tokenSymbol,
      convert: 'USD',
    },
    headers: {
      'X-CMC_PRO_API_KEY': process.env.PRICE_ORACLE_API_KEY,
    },
  });

  const tokenData = response.data.data[tokenSymbol];

  const priceInUSD = tokenData[0].quote.USD.price;

  return priceInUSD * cost;
};

export default retrieveCost;
