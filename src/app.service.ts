import { Injectable } from '@nestjs/common';
import retrieveCost from './relayer-costgetter';

@Injectable()
export class AppService {
  getTransactionCost = async (costKey, relayer) => {
    try {
      const response = await retrieveCost(costKey, relayer);
      return response;
    } catch (error) {
      return error;
    }
  };
}
