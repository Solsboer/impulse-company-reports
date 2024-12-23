import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('campaign_reports')
@Index(['event_time', 'client_id', 'event_name'], { unique: true })
export class CampaignReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  campaign: string;

  @Column()
  campaign_id: string;

  @Column()
  adgroup: string;

  @Column()
  adgroup_id: string;

  @Column()
  ad: string;

  @Column()
  ad_id: string;

  @Column()
  client_id: string;

  @Column()
  event_name: string;

  @Column({ type: 'timestamp' })
  event_time: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 