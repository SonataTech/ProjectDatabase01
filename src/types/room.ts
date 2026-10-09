export interface Room {
  id: string;
  roomName: string;
  capacity: number;
  building: string;
  floor: string;
  status: 'available' | 'maintenance' | 'booked';
}
