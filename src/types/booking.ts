export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  building: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose?: string;
  createdAt: string;
}
