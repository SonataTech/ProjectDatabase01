import React, { useState, useEffect } from 'react';
import { LibraryBooking } from '../types/library';
import { libraryService } from '../services/libraryService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Calendar, Clock, MapPin, CheckCircle2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export const StudentMyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<LibraryBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const studentId = 'STU-6501';

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryService.getStudentBookings(studentId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลการจองห้องได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCheckIn = async (bookingId: string) => {
    try {
      setProcessingId(bookingId);
      setSuccessMsg(null);
      await libraryService.checkInBooking(bookingId);
      setSuccessMsg('เช็คอิน (Check-in) เข้าใช้งานห้องอ่านหนังสือสำเร็จ!');
      
      // Immediately update local state so UI updates instantly
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: 'checked_in' } : b));

      await fetchBookings();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('เช็คอินไม่สำเร็จ: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCheckOut = async (bookingId: string) => {
    try {
      setProcessingId(bookingId);
      setSuccessMsg(null);
      await libraryService.checkOutBooking(bookingId);
      setSuccessMsg('เช็คเอาท์ (Check-out) ออกจากห้องอ่านหนังสือสำเร็จเรียบร้อย!');

      // Immediately update local state so UI updates instantly
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: 'completed' } : b));

      await fetchBookings();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('เช็คเอาท์ไม่สำเร็จ: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'confirmed':
      case 'pending':
      case 'waiting':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> ยืนยันการจอง (พร้อมเช็คอิน)
          </span>
        );
      case 'checked_in':
      case 'in_use':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> กำลังใช้งาน (Check-in แล้ว)
          </span>
        );
      case 'completed':
      case 'checked_out':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ใช้งานเสร็จสิ้น (Completed)
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5 mr-1" /> ยกเลิกการจอง
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> ยืนยันการจอง
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-white bg-opacity-20 text-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          Student Portal / My Bookings & Check-in
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">การจองห้องอ่านหนังสือของฉัน & เช็คอิน / เช็คเอาท์</h2>
        <p className="text-indigo-100 text-sm md:text-base">
          จัดการการจองห้องอ่านหนังสือ ทำรายการเช็คอินเมื่อถึงห้องสมุด และเช็คเอาท์เมื่อใช้งานเสร็จสิ้น
        </p>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <LoadingState message="กำลังโหลดข้อมูลการจองของคุณ..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : bookings.length === 0 ? (
        <EmptyState message="ไม่พบรายการจองห้องอ่านหนังสือในระบบ" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">รหัสการจอง / ห้อง</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">อาคาร / สถานที่</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">วันที่ & เวลา</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">การจัดการ (Check-in / Check-out)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((b) => {
                  const s = String(b.status || '').toLowerCase();
                  return (
                    <tr key={b.bookingId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{b.roomName}</div>
                        <div className="text-xs text-gray-500">ID: {b.bookingId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{b.building}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{b.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{b.startTime} - {b.endTime} น.</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(b.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {s === 'confirmed' || s === 'pending' || s === 'waiting' || !b.status ? (
                          <button
                            disabled={processingId === b.bookingId}
                            onClick={() => handleCheckIn(b.bookingId)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                          >
                            {processingId === b.bookingId ? 'กำลังเช็คอิน...' : 'เช็คอิน (Check-in)'}
                          </button>
                        ) : s === 'checked_in' || s === 'in_use' ? (
                          <button
                            disabled={processingId === b.bookingId}
                            onClick={() => handleCheckOut(b.bookingId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                          >
                            {processingId === b.bookingId ? 'กำลังเช็คเอาท์...' : 'เช็คเอาท์ (Check-out)'}
                          </button>
                        ) : (
                          <span className="inline-flex items-center text-xs text-gray-500 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                            ใช้งานเสร็จสิ้น
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
