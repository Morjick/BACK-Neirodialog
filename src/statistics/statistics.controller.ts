import { ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Controller, Get } from '@nestjs/common';

@ApiTags('Статистика')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticService: StatisticsService) {}

  @Get('user-sign-up')
  async getUserStatistic() {
    return await this.statisticService.getUserSignUpStatistic();
  }
}
