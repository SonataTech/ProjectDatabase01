import {
  Role,
  Permission,
  Department,
  Position,
  User,
  Student,
  Work,
  CheckIn,
  AuditLog,
} from '../types/database';

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

async function apiFetch(endpoint: string, fallbackData?: any) {
  try {
    ensureToken();
    const res = await fetch(`${API_URL}${endpoint}`, { headers: getHeaders() });
    const json = await res.json();
    if (!res.ok || !json.success) {
      if ((res.status === 401 || res.status === 403 || json.message?.includes('Authentication token')) && fallbackData !== undefined) {
        return fallbackData;
      }
      throw new Error(json.message || `API Error: ${res.status}`);
    }
    return json.data;
  } catch (err: any) {
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const apiService = {
  async getWorks(): Promise<Work[]> {
    return apiFetch('/works', [
      {
        work_id: 1,
        title: 'ห้องศึกษาเดี่ยว 01 (Study Room 1)',
        description: 'ห้องศึกษาเดี่ยวพร้อมอุปกรณ์ครบครัน',
        start_time: '08:00',
        end_time: '20:00',
        location: 'อาคารบรรณสาร (Main Library)',
        created_by_user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        work_id: 2,
        title: 'ห้องประชุมกลุ่ม 02 (Group Study Room 2)',
        description: 'ห้องประชุมกลุ่มขนาดกลางสำหรับอภิปราย',
        start_time: '08:00',
        end_time: '20:00',
        location: 'อาคารบรรณสาร (Main Library)',
        created_by_user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        work_id: 3,
        title: 'ห้องอ่านหนังสือเงียบ 03 (Silent Reading Room 3)',
        description: 'ห้องอ่านหนังสือบรรยากาศเงียบสงบ',
        start_time: '08:00',
        end_time: '20:00',
        location: 'อาคารนวัตกรรมการเรียนรู้',
        created_by_user_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  },

  async getStudents(): Promise<Student[]> {
    return apiFetch('/students', [
      {
        student_id: 1,
        student_code: '683380364-7',
        first_name: 'ณภัทรา',
        last_name: 'พนาลิกุล',
        email: 'napphatra@kkumail.com',
        department_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  },

  async getCheckIns(): Promise<CheckIn[]> {
    return apiFetch('/check-in', []);
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return apiFetch('/admin/audit-logs', [
      {
        log_id: 1,
        user_id: 1,
        action: 'INSERT',
        table_name: 'CHECK_INS',
        record_id: 101,
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      }
    ]);
  },

  async getDepartments(): Promise<Department[]> {
    return apiFetch('/departments', [
      { department_id: 1, department_name: 'Computer Science' }
    ]);
  },

  async getRoles(): Promise<Role[]> {
    return apiFetch('/admin/roles', [
      { role_id: 1, role_name: 'Admin', description: 'Administrator' }
    ]);
  }
};
