import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('transactions')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':taskId')
  async getTransactionCost(@Param('taskId') taskId: string) {
    return this.appService.getTransactionCost(taskId, 'gelato');
  }
}
