export interface RoomUsageStat {
  roomId: string;
  roomName: string;
  building: string;
  totalBookings: number;
  totalHours: number;
  usageRatePercentage: number;
}

export interface StatisticsReportFilter {
  startDate: string;
  endDate: string;
  building?: string;
  status?: string;
}

export interface RoomUsageReportResult {
  filter: StatisticsReportFilter;
  generatedAt: string;
  totalBookingsCount: number;
  totalUsageHours: number;
  statistics: RoomUsageStat[];
}
