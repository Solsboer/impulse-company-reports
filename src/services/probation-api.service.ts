import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignReport } from '../entities/campaign-report.entity';
import { ProbationApiRequestDto, ProbationApiResponse, EventName } from '../dto/probation-api.dto';

@Injectable()
export class ProbationApiService {
  private readonly apiDomain: string;
  private readonly apiKey: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(CampaignReport)
    private campaignReportRepository: Repository<CampaignReport>,
  ) {
    const apiDomain = this.configService.get<string>('API_DOMAIN');
    const apiKey = this.configService.get<string>('API_KEY');

    if (!apiDomain || !apiKey) {
      throw new Error('API_DOMAIN and API_KEY must be defined in environment variables');
    }

    this.apiDomain = apiDomain;
    this.apiKey = apiKey;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyFetch() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch data for both event types
    await Promise.all([
      this.fetchAndSaveData(today.toISOString(), tomorrow.toISOString(), EventName.INSTALL),
      this.fetchAndSaveData(today.toISOString(), tomorrow.toISOString(), EventName.PURCHASE),
    ]);
  }

  async fetchData(params: ProbationApiRequestDto): Promise<ProbationApiResponse> {
    try {
      const queryParams = new URLSearchParams({
        from_date: params.from_date,
        to_date: params.to_date,
        event_name: params.event_name,
        take: (params.take || '100').toString(),
        ...(params.page && { page: params.page.toString() }),
      });

      const response = await fetch(
        `${this.apiDomain}/tasks/campaign/reports?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch data from Probation API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data: ProbationApiResponse = await response.json();
      return data;
    } catch (error) {
      throw new HttpException(
        'Error fetching data from Probation API',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchAndSaveData(
    from_date: string,
    to_date: string,
    event_name: EventName,
  ): Promise<void> {
    try {
      const csvData = await this.fetchAllData(from_date, to_date, event_name);
      
      for (const csv of csvData) {
        const reports = this.parseCsvToReports(csv);
        await this.saveReports(reports);
      }
    } catch (error) {
      console.error(`Error fetching and saving data for ${event_name}:`, error);
      throw error;
    }
  }

  private async fetchAllData(
    from_date: string,
    to_date: string,
    event_name: EventName,
  ): Promise<string[]> {
    const csvData: string[] = [];
    let hasNextPage = true;
    let currentPage = undefined;

    while (hasNextPage) {
      const params: ProbationApiRequestDto = {
        from_date,
        to_date,
        event_name,
        take: 100,
        page: currentPage,
      };

      const response = await this.fetchData(params);
      csvData.push(response.data.csv);
      
      if (response.data.pagination?.next) {
        currentPage = currentPage === undefined ? 1 : currentPage + 1;
      } else {
        hasNextPage = false;
      }
    }

    return csvData;
  }

  private parseCsvToReports(csv: string): Partial<CampaignReport>[] {
    // Skip header row and split into lines
    const lines = csv.split('\n').slice(1);
    
    return lines
      .filter(line => line.trim())
      .map(line => {
        const [
          campaign,
          campaign_id,
          adgroup,
          adgroup_id,
          ad,
          ad_id,
          client_id,
          event_name,
          event_time,
        ] = line.split(',').map(field => field.trim());

        return {
          campaign,
          campaign_id,
          adgroup,
          adgroup_id,
          ad,
          ad_id,
          client_id,
          event_name,
          event_time: new Date(event_time),
        };
      });
  }

  private async saveReports(reports: Partial<CampaignReport>[]): Promise<void> {
    if (!reports.length) return;

   
    await this.campaignReportRepository
      .createQueryBuilder()
      .insert()
      .into(CampaignReport)
      .values(reports)
      .orIgnore() // Skip if record already exists
      .execute();
  }
} 