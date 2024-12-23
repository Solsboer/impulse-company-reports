import { IsDateString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';

export enum EventName {
  INSTALL = 'install',
  PURCHASE = 'purchase',
}

export class ProbationApiRequestDto {
  @IsNotEmpty()
  @IsDateString()
  from_date: string;

  @IsNotEmpty()
  @IsDateString()
  to_date: string;

  @IsNotEmpty()
  @IsEnum(EventName)
  event_name: EventName;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  take?: number;

  @IsOptional()
  @IsInt()
  page?: number;
}

export interface ProbationApiResponse {
  timestamp: number;
  data: {
    csv: string;
    pagination?: {
      next: string;
    };
  };
} 