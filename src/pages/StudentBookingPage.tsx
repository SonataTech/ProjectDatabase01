import React, { useState, useEffect } from 'react';
import { Booking } from '../types/booking';
import { bookingService } from '../services/bookingService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { BookingDetailModal } from '../components/BookingDetailModal';
import { Calendar, Clock, MapPin, Eye, Search, Filter, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const StudentBookingPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentStudentId = 'STU-6501'; // Mock logged-in student

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getStudentBookings(currentStudentId);
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถดึงข้อมูลประวัติการจองได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ยืนยันแล้ว
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> สำเร็จ
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5 mr-1" /> ยกเลิก
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> รออนุมัติ
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <div className="max-w-3xl">
          <span className="bg-blue-500 bg-opacity-40 text-blue-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
            UC9: ดูประวัติการจองส่วนตัว (Student View)
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">ประวัติการจองห้องส่วนตัว</h2>
          <p className="text-blue-100 text-sm md:text-base">
            ตรวจสอบรายการจองห้อง สถานะการจอง และเรียกดูรายละเอียดการจองย้อนหลังทั้งหมดของคุณตามข้อมูลในระบบฐานข้อมูล
          </p>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อห้อง, อาคาร, หรือรหัสการจอง..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>สถานะ:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="confirmed">ยืนยันแล้ว</option>
            <option value="completed">ใช้งานเสร็จสิ้น</option>
            <option value="cancelled">ยกเลิกการจอง</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="กำลังดึงประวัติการจองของนักศึกษาจากฐานข้อมูล..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchBookings} />
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          message="ไม่พบประวัติการจอง"
          subMessage="คุณยังไม่มีประวัติการจองห้องตามเงื่อนไขที่เลือกในระบบฐานข้อมูลขณะนี้"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    รหัสการจอง / ห้อง
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    อาคาร
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    วันที่ & เวลา
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    สถานะการจอง
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{b.roomName}</div>
                      <div className="text-xs text-gray-500">ID: {b.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {b.building}
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center space-x-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-semibold"
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

      {/* Booking Detail Modal (UC9 requirement) */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};
