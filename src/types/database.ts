export interface Role {
  role_id: number;
  role_name: string;
  description?: string;
}

export interface Permission {
  permission_id: number;
  permission_code: string;
  permission_name: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface Department {
  department_id: number;
  department_name: string;
}

export interface Position {
  position_id: number;
  position_name: string;
}

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  email: string;
  department_id: number;
  position_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface Student {
  student_id: number;
  student_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: number;
  created_at: string;
  updated_at: string;
}

export interface Work {
  work_id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  created_by_user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  check_in_id: number;
  work_id: number;
  student_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CheckInDetail {
  detail_id: number;
  check_in_id: number;
  check_time: string;
  check_type: string; // 'IN' | 'OUT'
}

export interface AuditLog {
  log_id: number;
  user_id: number | null;
  action: string; // 'INSERT' | 'UPDATE' | 'DELETE'
  table_name: string;
  record_id: number;
  ip_address?: string;
  created_at: string;
}

export interface DataHistory {
  history_id: number;
  log_id: number;
  field_name: string;
  old_value?: string;
  new_value?: string;
}
