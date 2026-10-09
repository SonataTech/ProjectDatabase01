import React, { useState, useEffect } from 'react';
import { LibraryBooking } from '../types/library';
import { libraryService } from '../services/libraryService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Calendar, Clock, MapPin, Search, Filter, CheckCircle2, XCircle, AlertCircle, Eye, X } from 'lucide-react';

export const StudentBookingHistoryPage: React.FC = () => {
  const [bookings, setBookings] = useState<LibraryBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<LibraryBooking | null>(null);

  const studentId = 'STU-6501';

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryService.getStudentBookings(studentId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดประวัติการจองห้องได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: LibraryBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> ยืนยันการจอง
          </span>
        );
      case 'checked_in':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> กำลังใช้งาน
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ใช้งานเสร็จสิ้น
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5 mr-1" /> ยกเลิกการจอง
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-white bg-opacity-20 text-blue-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          UC9: Personal Booking History for Students
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">ประวัติการจองห้องอ่านหนังสือห้องสมุดส่วนตัว</h2>
        <p className="text-blue-100 text-sm md:text-base">
          ตรวจสอบประวัติการจองห้องอ่านหนังสือย้อนหลังทั้งหมดของคุณ ค้นหา และดูรายละเอียดการจอง
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อห้อง, อาคาร, วัตถุประสงค์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">สถานะ:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="confirmed">ยืนยันการจอง</option>
            <option value="checked_in">กำลังใช้งาน</option>
            <option value="completed">ใช้งานเสร็จสิ้น</option>
            <option value="cancelled">ยกเลิกการจอง</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="กำลังโหลดประวัติการจองห้องสมุด..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          message="ไม่พบประวัติการจอง"
          subMessage="คุณยังไม่มีประวัติการจองห้องอ่านหนังสือห้องสมุดตามเงื่อนไขที่เลือกในระบบ"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">รหัส / ห้องอ่านหนังสือ</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">อาคาร</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">วันที่ & เวลา</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((b) => (
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
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center space-x-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูรายละเอียด</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold">รายละเอียดการจองห้อง (UC9)</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-white hover:bg-indigo-700 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <p className="text-xs text-gray-500">รหัสการจอง</p>
                  <p className="text-base font-bold text-gray-900">{selectedBooking.bookingId}</p>
                </div>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 p-3.5 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium">ห้องอ่านหนังสือ</p>
                  <p className="font-bold text-gray-900">{selectedBooking.roomName}</p>
                  <p className="text-xs text-gray-600">{selectedBooking.building}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium">วันที่จอง</p>
                    <p className="font-bold text-gray-800">{selectedBooking.date}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium">เวลา</p>
                    <p className="font-bold text-gray-800">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">วัตถุประสงค์</p>
                  <p className="text-gray-800 text-sm">{selectedBooking.purpose}</p>
                </div>

                {selectedBooking.checkInTime && (
                  <div className="text-xs text-gray-500">
                    เช็คอินเมื่อ: {selectedBooking.checkInTime} {selectedBooking.checkOutTime ? `| เช็คเอาท์เมื่อ: ${selectedBooking.checkOutTime}` : ''}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-xl text-xs font-medium transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
