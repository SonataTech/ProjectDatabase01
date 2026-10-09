import { Student, CheckIn } from '../types/database';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function ensureToken() {
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock-dev-token');
  }
}

function getHeaders() {
  ensureToken();
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const studentService = {
  async getCurrentStudent(): Promise<Student> {
    ensureToken();
    const res = await fetch(`${API_URL}/students/1`, { headers: getHeaders() });
    const json = await res.json();
    if (!json.success) {
      return {
        student_id: 1,
        student_code: '683380364-7',
        first_name: 'ณภัทรา',
        last_name: 'พนาลิกุล',
        email: 'napphatra@kkumail.com',
        department_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    return json.data;
  },

  async getPersonalBookingHistory(studentId: number): Promise<any[]> {
    try {
      ensureToken();
      const sId = Number(studentId) || Number(localStorage.getItem('student_id')) || 1;
      const res = await fetch(`${API_URL}/students/${sId}`, { headers: getHeaders() });
      const json = await res.json();
      if (!json.success) return [];
      return json.data.checkInHistory || [];
    } catch (err) {
      return [];
    }
  },

  async performCheckIn(workId: number, studentId: number): Promise<CheckIn> {
    ensureToken();
    const wId = Number(workId);
    const sId = Number(studentId) || Number(localStorage.getItem('student_id')) || 1;

    const finalWorkId = (isNaN(wId) || wId <= 0) ? 1 : wId;
    const finalStudentId = (isNaN(sId) || sId <= 0) ? 1 : sId;

    const res = await fetch(`${API_URL}/check-in`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        work_id: Number(finalWorkId),
        student_id: Number(finalStudentId),
        status: "CHECKED_IN"
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Check-in failed');
    return json.data;
  },

  async performCheckOut(checkInId: number): Promise<CheckIn> {
    ensureToken();
    const cId = Number(checkInId) || 1;
    const res = await fetch(`${API_URL}/check-out`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ check_in_id: Number(cId) })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Check-out failed');
    return json.data;
  }
};
