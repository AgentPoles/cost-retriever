const symbols = {
  MUMBAI: 'MATIC',
  ETHERUEM: 'ETH',
};

const retrieveTokenSymbolFromNetwork = (network) => {
  return symbols[network];
};
export default retrieveTokenSymbolFromNetwork;
