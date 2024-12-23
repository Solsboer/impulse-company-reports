export interface ProbationApiRequestDto {
  from_date: string;
  to_date: string;
  event_name: string;
  take?: number;
  page?: number;
} 