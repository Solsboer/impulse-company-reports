import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CampaignReportService } from '../services/campaign-report.service';
import { FetchDataDto } from '../dto/fetch-data.dto';
import { AggregateDataDto } from '../dto/aggregate-data.dto';
import { GetReportsByDateDto } from '../dto/get-reports-by-date.dto';

@ApiTags('campaign-reports')
@Controller('campaign-reports')
export class CampaignReportController {
  constructor(private readonly campaignReportService: CampaignReportService) {}

  @Post('fetch')
  @ApiOperation({ summary: 'Fetch data for date range' })
  @ApiResponse({ status: 201, description: 'Data fetch initiated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 502, description: 'Error fetching data from Probation API' })
  async fetchData(@Body() fetchDataDto: FetchDataDto) {
    await this.campaignReportService.fetchDataForDateRange(
      fetchDataDto.from_date,
      fetchDataDto.to_date,
      fetchDataDto.event_name,
    );
    return { message: 'Data fetch initiated successfully' };
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get reports by date range' })
  @ApiResponse({ status: 200, description: 'Returns reports for the specified date range' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async getReportsByDate(@Query() getReportsDto: GetReportsByDateDto) {
    return this.campaignReportService.getReportsByDate(
      new Date(getReportsDto.from_date),
      new Date(getReportsDto.to_date),
      getReportsDto.event_name,
      getReportsDto.take,
      getReportsDto.skip,
    );
  }

  @Get('aggregate')
  @ApiOperation({ summary: 'Get aggregated data' })
  @ApiResponse({ status: 200, description: 'Returns aggregated data' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async getAggregatedData(@Query() aggregateDataDto: AggregateDataDto) {
    return this.campaignReportService.getAggregatedData(
      new Date(aggregateDataDto.from_date),
      new Date(aggregateDataDto.to_date),
      aggregateDataDto.event_name,
      aggregateDataDto.take,
      aggregateDataDto.skip,
    );
  }
} 