import { Work } from '../types/database';

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

const DEFAULT_WORKS: Work[] = [
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
];

export const workService = {
  async getAllWorks(): Promise<Work[]> {
    try {
      ensureToken();
      const res = await fetch(`${API_URL}/works`, { headers: getHeaders() });
      const json = await res.json();
      const rawData = (json.success && json.data) ? json.data : [];
      const items = rawData.length > 0 ? rawData : DEFAULT_WORKS;

      return items.map((item: any) => ({
        work_id: item.work_id || item.id || 1,
        title: item.title || item.name || 'ห้องบริการการศึกษา',
        description: item.description || '',
        start_time: item.start_time || '08:00',
        end_time: item.end_time || '20:00',
        location: item.location || 'Main Building',
        created_by_user_id: item.created_by_user_id || 1,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString()
      }));
    } catch (err) {
      return DEFAULT_WORKS;
    }
  },

  async getWorkById(workId: number): Promise<Work | null> {
    try {
      ensureToken();
      const res = await fetch(`${API_URL}/works/${workId}`, { headers: getHeaders() });
      const json = await res.json();
      if (!json.success || !json.data) {
        const works = await this.getAllWorks();
        return works.find(w => w.work_id === workId) || null;
      }
      const item = json.data;
      return {
        work_id: item.work_id || item.id || workId,
        title: item.title || item.name || 'ห้องบริการการศึกษา',
        description: item.description || '',
        start_time: item.start_time || '08:00',
        end_time: item.end_time || '20:00',
        location: item.location || 'Main Building',
        created_by_user_id: item.created_by_user_id || 1,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString()
      };
    } catch (err) {
      const works = await this.getAllWorks();
      return works.find(w => w.work_id === workId) || null;
    }
  },

  async createWork(workData: Omit<Work, 'work_id' | 'created_at' | 'updated_at'>): Promise<Work> {
    ensureToken();
    const res = await fetch(`${API_URL}/works`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to create work');
    return json.data;
  }
};
