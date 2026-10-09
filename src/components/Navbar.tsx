import React from 'react';
import { UserRole } from '../types/library';
import { BookOpen, User, ShieldCheck, Library } from 'lucide-react';

export type StudentTab = 'browse' | 'myBookings' | 'history';
export type AdminTab = 'statistics' | 'rooms';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  studentTab: StudentTab;
  onStudentTabChange: (tab: StudentTab) => void;
  adminTab: AdminTab;
  onAdminTabChange: (tab: AdminTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  studentTab,
  onStudentTabChange,
  adminTab,
  onAdminTabChange,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold flex items-center justify-center">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">ระบบจองห้องอ่านหนังสือห้องสมุด (Library Study Room Booking)</h1>
              <p className="text-xs text-gray-500">University Library Study Room Booking System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentRole === 'student' ? (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onStudentTabChange('browse')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    studentTab === 'browse' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ค้นหาและจองห้อง (Rooms)
                </button>
                <button
                  onClick={() => onStudentTabChange('myBookings')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    studentTab === 'myBookings' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  การจองของฉัน & Check-in
                </button>
                <button
                  onClick={() => onStudentTabChange('history')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    studentTab === 'history' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  ประวัติการจอง (UC9)
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onAdminTabChange('statistics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    adminTab === 'statistics' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  รายงานสถิติการใช้งาน (UC10)
                </button>
                <button
                  onClick={() => onAdminTabChange('rooms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    adminTab === 'rooms' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  จัดการห้องสมุด (Rooms Management)
                </button>
              </div>
            )}

            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-sm">
              <button
                onClick={() => onRoleChange('student')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  currentRole === 'student'
                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>นักศึกษา (Student)</span>
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  currentRole === 'admin'
                    ? 'bg-white text-purple-600 shadow-sm font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ผู้ดูแลระบบ (Admin)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
