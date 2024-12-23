import { IsDateString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBeforeDate, IsNotFutureDate, IsWithinMaxRange } from '../validators/date.validator';
import { EventName } from './probation-api.dto';

export class GetReportsByDateDto {
  @ApiProperty({
    description: 'Start date in ISO format',
    example: '2023-11-01T00:00:00Z',
    type: String,
    format: 'date-time',
    required: true,
  })
  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsNotFutureDate({ message: 'Start date cannot be in the future' })
  @IsBeforeDate('to_date', { message: 'Start date must be before end date' })
  @IsWithinMaxRange('to_date', 31, { message: 'Date range cannot exceed 31 days' })
  from_date: string;

  @ApiProperty({
    description: 'End date in ISO format',
    example: '2023-11-30T23:59:59Z',
    type: String,
    format: 'date-time',
    required: true,
  })
  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsNotFutureDate({ message: 'End date cannot be in the future' })
  to_date: string;

  @ApiProperty({
    description: 'Event name filter (optional)',
    enum: EventName,
    example: EventName.INSTALL,
    required: false,
  })
  @IsOptional()
  @IsEnum(EventName, { message: 'Invalid event name. Must be either "install" or "purchase"' })
  event_name?: EventName;

  @ApiProperty({
    description: 'Number of records per page (1-100)',
    example: 100,
    type: Number,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Take value must be an integer' })
  @Min(1, { message: 'Minimum take value is 1' })
  @Max(100, { message: 'Maximum take value is 100' })
  take?: number = 100;

  @ApiProperty({
    description: 'Number of records to skip for pagination',
    example: 0,
    type: Number,
    minimum: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Skip value must be an integer' })
  @Min(0, { message: 'Minimum skip value is 0' })
  skip?: number = 0;
} 