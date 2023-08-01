import { Injectable } from '@nestjs/common';
import retrieveCost from './relayer-costgetter';

@Injectable()
export class AppService {
  getTransactionCost = async (costKey, relayer, network) => {
    try {
      const response = await retrieveCost(costKey, relayer, network);
      return response;
    } catch (error) {
      return error;
    }
  };
}
