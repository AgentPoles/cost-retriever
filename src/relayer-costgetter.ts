import axios from 'axios';

const retrieveCost = (costKey, relayer) => {
  switch (relayer) {
    case 'gelato': {
      return gelatoCostRetriever(costKey);
    }
  }
};

const gelatoCostRetriever = async (taskId) => {
  try {
    const url = process.env.GELATO_RELAYER_STATUS_URL + taskId;
    const gelatoResponse = await axios.get(url);
    const transactionHash = gelatoResponse.data.transactionHash;
    const indexerResponse = await axios.get(process.env.indexerURL, {
      params: {
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: transactionHash,
        apikey: process.env.indexerApiKey,
      },
    });
    const gas = indexerResponse.data.result.gas;
    const gasPriceInWei = indexerResponse.data.result.gasPrice / 1000000000;
    const cost = calculateTransactionFee(gas, gasPriceInWei);
    return cost;
  } catch (error) {
    console.log(error);
  }
};

const calculateTransactionFee = (gasUsed, gasPriceInGwei) => {
  const gasPriceInEthers = gasPriceInGwei / 1000000000;
  const transactionFee = gasUsed * gasPriceInEthers;
  return transactionFee;
};

export default retrieveCost;
