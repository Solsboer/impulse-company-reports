import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCampaignReportsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'campaign_reports',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'campaign',
            type: 'varchar',
          },
          {
            name: 'campaign_id',
            type: 'varchar',
          },
          {
            name: 'adgroup',
            type: 'varchar',
          },
          {
            name: 'adgroup_id',
            type: 'varchar',
          },
          {
            name: 'ad',
            type: 'varchar',
          },
          {
            name: 'ad_id',
            type: 'varchar',
          },
          {
            name: 'client_id',
            type: 'varchar',
          },
          {
            name: 'event_name',
            type: 'varchar',
          },
          {
            name: 'event_time',
            type: 'timestamp',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'campaign_reports',
      new TableIndex({
        name: 'IDX_campaign_reports_unique',
        columnNames: ['event_time', 'client_id', 'event_name'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('campaign_reports', 'IDX_campaign_reports_unique');
    await queryRunner.dropTable('campaign_reports');
  }
} 