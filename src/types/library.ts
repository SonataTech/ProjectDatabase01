export type RoomType = 'Study Room' | 'Reading Room' | 'Seminar Room';
export type RoomStatus = 'available' | 'maintenance' | 'booked';
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
export type UserRole = 'student' | 'admin';

export interface LibraryRoom {
  roomId: string;
  roomName: string;
  capacity: number;
  building: string;
  roomType: RoomType;
  status: RoomStatus;
  equipment: string[];
}

export interface LibraryBooking {
  bookingId: string;
  studentId: string;
  studentName: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  checkInTime?: string;
  checkOutTime?: string;
  purpose: string;
  createdAt: string;
}

export interface RoomUsageStat {
  roomId: string;
  roomName: string;
  building: string;
  totalBookings: number;
  totalHours: number;
  usageRatePercentage: number;
}

export interface StatisticsReportResult {
  startDate: string;
  endDate: string;
  building?: string;
  totalBookingsCount: number;
  totalUsageHours: number;
  statistics: RoomUsageStat[];
  generatedAt: string;
}
