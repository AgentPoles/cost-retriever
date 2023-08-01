const symbols = {
  MUMBAI: 'MATIC',
};

const retrieveTokenSymbolFromNetwork = (network) => {
  return symbols[network];
};
export default retrieveTokenSymbolFromNetwork;
