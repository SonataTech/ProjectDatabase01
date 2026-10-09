import { Booking } from '../types/booking';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const bookingService = {
  async getStudentBookings(userId: string): Promise<Booking[]> {
    const res = await fetch(`${API_URL}/check-in${userId ? `?student_id=${userId}` : ''}`, { headers: getHeaders() });
    const json = await res.json();
    if (!json.success) return [];
    return (json.data || []).map((ci: any) => ({
      id: `BK-${ci.check_in_id}`,
      userId: String(ci.student_id),
      roomId: String(ci.work_id),
      roomName: ci.work_title || `Work #${ci.work_id}`,
      building: ci.location || 'Main Building',
      date: ci.created_at ? ci.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
      startTime: '09:00',
      endTime: '12:00',
      status: ci.status === 'COMPLETED' ? 'completed' : 'confirmed',
      purpose: ci.work_title || 'Work Session',
      createdAt: ci.created_at || new Date().toISOString()
    }));
  },

  async getBookingById(bookingId: string): Promise<Booking | null> {
    const id = bookingId.replace('BK-', '');
    const res = await fetch(`${API_URL}/check-in`, { headers: getHeaders() });
    const json = await res.json();
    if (!json.success) return null;
    const found = (json.data || []).find((ci: any) => String(ci.check_in_id) === id);
    if (!found) return null;
    return {
      id: `BK-${found.check_in_id}`,
      userId: String(found.student_id),
      roomId: String(found.work_id),
      roomName: found.work_title || `Work #${found.work_id}`,
      building: found.location || 'Main Building',
      date: found.created_at ? found.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
      startTime: '09:00',
      endTime: '12:00',
      status: found.status === 'COMPLETED' ? 'completed' : 'confirmed',
      purpose: found.work_title || 'Work Session',
      createdAt: found.created_at || new Date().toISOString()
    };
  }
};
