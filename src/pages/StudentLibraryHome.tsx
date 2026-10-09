import React, { useState, useEffect } from 'react';
import { LibraryRoom, LibraryBooking, RoomType } from '../types/library';
import { libraryService } from '../services/libraryService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Library, Users, MapPin, Sparkles, Calendar, Clock, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface StudentLibraryHomeProps {
  onNavigateToMyBookings: () => void;
}

export const StudentLibraryHome: React.FC<StudentLibraryHomeProps> = ({ onNavigateToMyBookings }) => {
  const [rooms, setRooms] = useState<LibraryRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<LibraryRoom | null>(null);

  // Booking Modal Form State
  const [bookingDate, setBookingDate] = useState<string>('2026-10-20');
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('12:00');
  const [purpose, setPurpose] = useState<string>('ติวหนังสือสอบปลายภาค');
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryService.getRooms();
      setRooms(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถโหลดข้อมูลห้องอ่านหนังสือได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((r) => {
    if (selectedType === 'all') return true;
    return r.roomType === selectedType;
  });

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(null);

      await libraryService.createBooking({
        studentId: 'STU-6501',
        studentName: 'สมชาย ใจดี',
        roomId: selectedRoom.roomId,
        roomName: selectedRoom.roomName,
        building: selectedRoom.building,
        date: bookingDate,
        startTime,
        endTime,
        purpose,
      });

      setBookingSuccess('จองห้องอ่านหนังสือสำเร็จเรียบร้อย!');
      setTimeout(() => {
        setSelectedRoom(null);
        setBookingSuccess(null);
        onNavigateToMyBookings();
      }, 1500);
    } catch (err: any) {
      setBookingError(err.message || 'เกิดข้อผิดพลาดในการจองห้อง');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-white bg-opacity-20 text-indigo-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          University Library Study Room Booking
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">จองห้องอ่านหนังสือภายในห้องสมุดมหาวิทยาลัย</h2>
        <p className="text-indigo-100 text-sm md:text-base max-w-2xl">
          เลือกห้องอ่านหนังสือ (Study Room / Reading Room) ตรวจสอบความพร้อมและอุปกรณ์ พร้อมจองเวลาใช้งานเพื่อการศึกษาค้นคว้า
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ประเภทห้อง:</span>
          {['all', 'Study Room', 'Reading Room', 'Seminar Room'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'ทุกประเภท' : type}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          ห้องทั้งหมด: <span className="font-bold text-gray-800">{filteredRooms.length} ห้อง</span>
        </div>
      </div>

      {loading ? (
        <LoadingState message="กำลังโหลดห้องอ่านหนังสือในห้องสมุด..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRooms} />
      ) : filteredRooms.length === 0 ? (
        <EmptyState message="ไม่พบห้องอ่านหนังสือตามเงื่อนไขที่เลือก" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.roomId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{room.roomName}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {room.status === 'available' ? 'ว่าง (Available)' : 'ปิดปรับปรุง'}
                  </span>
                </div>

                <p className="text-xs font-medium text-indigo-600 mb-3">{room.roomType}</p>

                <div className="space-y-2 text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>รองรับ: {room.capacity} ที่นั่ง</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="truncate">{room.building}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">อุปกรณ์ภายในห้อง:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {room.equipment.map((eq, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-md font-medium">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                disabled={room.status !== 'available'}
                onClick={() => setSelectedRoom(room)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm ${
                  room.status === 'available'
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>จองห้องอ่านหนังสือนี้ (Book Room)</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Room Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Library className="w-5 h-5" />
                <h3 className="text-lg font-bold">จองห้องอ่านหนังสือห้องสมุด</h3>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-white hover:bg-indigo-700 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-900">{selectedRoom.roomName}</h4>
                <p className="text-xs text-indigo-700">{selectedRoom.building} ({selectedRoom.roomType} - {selectedRoom.capacity} ที่นั่ง)</p>
              </div>

              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {bookingSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{bookingSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">วันที่ต้องการจอง</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">เวลาเริ่มต้น</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">เวลาสิ้นสุด</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">วัตถุประสงค์การใช้งาน / วิชา</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="ระบุวัตถุประสงค์ เช่น ติวหนังสือสอบโครงสร้างข้อมูล"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center space-x-2"
                >
                  <span>{bookingLoading ? 'กำลังบันทึกการจอง...' : 'ยืนยันการจองห้อง'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
