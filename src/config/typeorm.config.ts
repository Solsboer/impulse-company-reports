import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { CampaignReport } from '../entities/campaign-report.entity';
import { CreateCampaignReportsTable1700000000000 } from '../migrations/1700000000000-CreateCampaignReportsTable';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  schema: configService.get('DATABASE_SCHEMA'),
  entities: [CampaignReport],
  migrations: [CreateCampaignReportsTable1700000000000],
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource; 