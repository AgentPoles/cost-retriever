import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private etherscanApiKey: string;

  constructor() {
    this.etherscanApiKey = 'RM7NRD9JH6FU2PZ7177XMJ7FZMYY2F5PTI';
  }

  calculateTransactionFee(gasUsed, gasPriceInGwei) {
    // Convert gas price from Gwei to ethers
    const gasPriceInEthers = gasPriceInGwei / 1000000000;

    // Calculate transaction fee
    const transactionFee = gasUsed * gasPriceInEthers;

    return transactionFee;
  }

  async getTransactionGasCost(transactionHash: string) {
    try {
      const response = await axios.get(
        'https://api-testnet.polygonscan.com/api',
        {
          params: {
            module: 'proxy',
            action: 'eth_getTransactionByHash',
            txhash: transactionHash,
            apikey: this.etherscanApiKey,
          },
        },
      );

      console.log(response);

      if (response.data && response.data.result && response.data.result.gas) {
        const gas = response.data.result.gas;
        const gasPrice = response.data.result.gasPrice / 1000000000;
        console.log(parseInt(gas));
        console.log(gasPrice);
        return {
          gas: parseInt(gas, 16),
          gasInEthers: this.calculateTransactionFee(gas, gasPrice),
        };
      }

      throw new Error(
        'Gas cost information not found for the given transaction.',
      );
    } catch (error) {
      throw new Error(`Error fetching transaction details: ${error.message}`);
    }
  }
}
