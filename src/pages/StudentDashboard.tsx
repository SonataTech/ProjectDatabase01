import React, { useState, useEffect } from 'react';
import { Work } from '../types/database';
import { workService } from '../services/workService';
import { studentService } from '../services/studentService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Calendar, MapPin, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToCheckIns: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateToCheckIns }) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workService.getAllWorks();
      setWorks(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลงานได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleCheckIn = async (workId: number) => {
    try {
      setCheckingInId(workId);
      setSuccessMsg(null);
      await studentService.performCheckIn(workId, 1); // Student ID 1
      setSuccessMsg('เช็คอิน (Check-in) สำเร็จเรียบร้อย!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('เช็คอินไม่สำเร็จ: ' + err.message);
    } finally {
      setCheckingInId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <span className="bg-blue-500 bg-opacity-40 text-blue-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            Student Portal / Dashboard
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">ยินดีต้อนรับ นักศึกษา (Student)</h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xl">
            ตรวจสอบงาน กิจกรรม และสถานที่ พร้อมทำรายการเช็คอิน (Check-in) และเช็คเอาท์ (Check-out) ได้อย่างสะดวกรวดเร็ว
          </p>
        </div>
        <button
          onClick={onNavigateToCheckIns}
          className="mt-4 md:mt-0 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center space-x-2"
        >
          <span>ดูประวัติการเข้าร่วมของฉัน (UC9)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 mb-4">รายการงานและกิจกรรมทั้งหมดที่เปิดให้เข้าร่วม (WORKS)</h3>

      {loading ? (
        <LoadingState message="กำลังโหลดรายการงาน..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchWorks} />
      ) : works.length === 0 ? (
        <EmptyState message="ไม่พบรายการงานในระบบฐานข้อมูล" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {works.map((work) => (
            <div key={work.work_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-2">{work.title}</h4>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{work.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>{work.start_time} - {work.end_time}</span>
                  </div>
                  {work.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>สถานที่: {work.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={checkingInId === work.work_id}
                onClick={() => handleCheckIn(work.work_id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{checkingInId === work.work_id ? 'กำลังเช็คอิน...' : 'ลงทะเบียนเช็คอิน (Check-in)'}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
