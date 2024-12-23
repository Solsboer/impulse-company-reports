import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CampaignReport } from './entities/campaign-report.entity';
import { CampaignReportController } from './controllers/campaign-report.controller';
import { CampaignReportService } from './services/campaign-report.service';
import { ProbationApiService } from './services/probation-api.service';
import { dataSourceOptions } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => dataSourceOptions,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([CampaignReport]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CampaignReportController],
  providers: [CampaignReportService, ProbationApiService],
})
export class AppModule {} 