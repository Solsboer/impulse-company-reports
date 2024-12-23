import { IsDateString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsBeforeDate, IsNotFutureDate, IsWithinMaxRange } from '../validators/date.validator';
import { EventName } from './probation-api.dto';

export class FetchDataDto {
  @ApiProperty({
    description: 'Start date in ISO format',
    example: '2024-12-23T00:00:00Z',
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
    example: '2024-12-23T23:59:59Z',
    type: String,
    format: 'date-time',
    required: true,
  })
  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString({}, { message: 'Invalid date format' })
  @IsNotFutureDate({ message: 'End date cannot be in the future' })
  to_date: string;

  @ApiProperty({
    description: 'Event name to fetch data for',
    enum: EventName,
    example: EventName.INSTALL,
    required: true,
    enumName: 'EventName',
  })
  @IsNotEmpty({ message: 'Event name is required' })
  @IsEnum(EventName, { message: 'Invalid event name. Must be either "install" or "purchase"' })
  event_name: EventName;
} 