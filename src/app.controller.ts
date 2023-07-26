import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('transactions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':transactionHash/gas-cost')
  async getGasCost(@Param('transactionHash') transactionHash: string) {
    return this.appService.getTransactionGasCost(transactionHash);
  }
}
