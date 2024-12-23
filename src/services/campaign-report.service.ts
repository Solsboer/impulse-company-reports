import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CampaignReport } from '../entities/campaign-report.entity';
import { ProbationApiService } from './probation-api.service';
import { EventName } from '../dto/probation-api.dto';

@Injectable()
export class CampaignReportService {
  constructor(
    @InjectRepository(CampaignReport)
    private campaignReportRepository: Repository<CampaignReport>,
    private probationApiService: ProbationApiService,
  ) {}

  async fetchDataForDateRange(
    from_date: string,
    to_date: string,
    event_name: EventName,
  ): Promise<void> {
    await this.probationApiService.fetchAndSaveData(from_date, to_date, event_name);
  }

  async getReportsByDate(
    from_date: Date,
    to_date: Date,
    event_name?: EventName,
    take: number = 100,
    skip: number = 0,
  ) {
    const queryBuilder = this.campaignReportRepository
      .createQueryBuilder('report')
      .where('report.event_time BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      });

    if (event_name) {
      queryBuilder.andWhere('report.event_name = :event_name', { event_name });
    }

    const [results, total] = await Promise.all([
      queryBuilder
        .orderBy('report.event_time', 'DESC')
        .skip(skip)
        .take(take)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data: results,
      meta: {
        total,
        take,
        skip,
        from_date,
        to_date,
        event_name,
      },
    };
  }

  async getAggregatedData(
    from_date: Date,
    to_date: Date,
    event_name: EventName,
    take: number = 10,
    skip: number = 0,
  ) {
    // Підзапит для отримання агрегованих даних
    const aggregateQuery = this.campaignReportRepository
      .createQueryBuilder('report')
      .select('report.ad_id', 'ad_id')
      .addSelect('DATE(report.event_time)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('report.event_time BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      })
      .andWhere('report.event_name = :event_name', { event_name })
      .groupBy('report.ad_id')
      .addGroupBy('DATE(report.event_time)')
      .orderBy('date', 'DESC')
      .addOrderBy('count', 'DESC');

    // Отримуємо загальну кількість унікальних комбінацій
    const totalQuery = this.campaignReportRepository
      .createQueryBuilder('report')
      .select('COUNT(DISTINCT CONCAT(report.ad_id, DATE(report.event_time)))', 'count')
      .where('report.event_time BETWEEN :from_date AND :to_date', {
        from_date,
        to_date,
      })
      .andWhere('report.event_name = :event_name', { event_name });

    const [results, totalResult] = await Promise.all([
      aggregateQuery
        .offset(skip)
        .limit(take)
        .getRawMany(),
      totalQuery.getRawOne(),
    ]);

    return {
      data: results,
      meta: {
        total: Number(totalResult?.count || 0),
        take,
        skip,
      },
    };
  }
} 