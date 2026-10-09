import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const StudentCheckInPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getPersonalBookingHistory(1); // Student ID 1
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถดึงข้อมูลประวัติการเข้าร่วมได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCheckOut = async (checkInId: number) => {
    try {
      setProcessingId(checkInId);
      await studentService.performCheckOut(checkInId);
      await fetchHistory();
    } catch (err: any) {
      alert('เช็คเอาท์ไม่สำเร็จ: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-blue-500 bg-opacity-40 text-blue-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          UC9: Personal Booking / Check-in History (Student View)
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">ประวัติการจองและเช็คอินส่วนตัว</h2>
        <p className="text-blue-100 text-sm md:text-base">
          ตรวจสอบประวัติการเข้าร่วมงาน การเช็คอิน (Check-in) และเช็คเอาท์ (Check-out) ตามข้อมูลในระบบฐานข้อมูล
        </p>
      </div>

      {loading ? (
        <LoadingState message="กำลังดึงประวัติการจองและเช็คอินจากฐานข้อมูล..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchHistory} />
      ) : history.length === 0 ? (
        <EmptyState
          message="ไม่พบประวัติการจอง"
          subMessage="คุณยังไม่มีประวัติการจองหรือเช็คอินห้อง/งานใดๆ ในระบบฐานข้อมูลขณะนี้"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">งาน / กิจกรรม (WORKS)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานที่ (Location/Room)</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">เวลา</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ (Status)</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">การจัดการ (Check-out)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.check_in_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{item.work?.title || `Work ID: ${item.work_id}`}</div>
                      <div className="text-xs text-gray-500">Check-In ID: {item.check_in_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.work?.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.work?.start_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {item.status === 'CHECKED_IN' ? (
                        <button
                          disabled={processingId === item.check_in_id}
                          onClick={() => handleCheckOut(item.check_in_id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        >
                          {processingId === item.check_in_id ? 'กำลังเช็คเอาท์...' : 'เช็คเอาท์ (Check-out)'}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">เสร็จสิ้นแล้ว</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
