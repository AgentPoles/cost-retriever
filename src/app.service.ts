import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private indexerApiKey: string;
  private indexerURL: string;
  private relayerURL: string;

  constructor() {
    this.indexerApiKey = process.env.INDEXER_API_KEY;
    this.indexerURL = process.env.INDEXER_URL;
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
      const response = await axios.get(this.indexerURL, {
        params: {
          module: 'proxy',
          action: 'eth_getTransactionByHash',
          txhash: transactionHash,
          apikey: this.indexerApiKey,
        },
      });

      console.log(response);

      if (response.data && response.data.result && response.data.result.gas) {
        const gas = response.data.result.gas;
        const gasPrice = response.data.result.gasPrice / 1000000000;
        console.log(parseInt(gas));

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

  getTransactionReferenceFromRelayer = async (taskId: string) => {
    try {
      const response = await axios.get(this.relayerURL, {
        params: {
          taskId: taskId,
        },
      });

      console.log(response);
    } catch (error) {
      throw new Error(`Error fetching transaction details: ${error.message}`);
    }
  };
}
