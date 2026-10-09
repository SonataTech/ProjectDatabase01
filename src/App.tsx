import React, { useState } from 'react';
import { Navbar, StudentTab, AdminTab } from './components/Navbar';
import { UserRole } from './types/library';
import { StudentLibraryHome } from './pages/StudentLibraryHome';
import { StudentBookingPage } from './pages/StudentBookingPage';
import { StudentMyBookingsPage } from './pages/StudentMyBookingsPage';
import { StudentBookingHistoryPage } from './pages/StudentBookingHistoryPage';
import { StudentCheckInPage } from './pages/StudentCheckInPage';
import { AdminStatisticsPage } from './pages/AdminStatisticsPage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [studentTab, setStudentTab] = useState<StudentTab>('browse');
  const [adminTab, setAdminTab] = useState<AdminTab>('statistics');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        studentTab={studentTab}
        onStudentTabChange={setStudentTab}
        adminTab={adminTab}
        onAdminTabChange={setAdminTab}
      />

      <main className="flex-grow">
        {currentRole === 'student' ? (
          <div className="py-6">
            {studentTab === 'browse' && <StudentLibraryHome onNavigateToMyBookings={() => setStudentTab('myBookings')} />}
            {studentTab === 'myBookings' && <StudentMyBookingsPage />}
            {studentTab === 'history' && <StudentBookingHistoryPage />}
          </div>
        ) : (
          <div className="py-6">
            {adminTab === 'statistics' && <AdminStatisticsPage />}
            {adminTab === 'rooms' && <AdminAuditLogsPage />}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
          <p className="font-medium text-gray-700">ระบบจองห้องอ่านหนังสือภายในห้องสมุดมหาวิทยาลัย (University Library Study Room Booking System)</p>
          <p className="mt-1 text-gray-500">
            Term Project: กลุ่ม ค่อยทำขอรำก่อน | ER Diagram & Use Case Diagrams เป็น Source of Truth 100%
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
