import React from 'react';
import { Booking } from '../types/booking';
import { X, Calendar, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> ยืนยันการจองแล้ว
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> ใช้งานเสร็จสิ้น
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> ยกเลิกการจอง
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> รออนุมัติ
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <h2 className="text-lg font-bold">รายละเอียดการจองห้อง (UC9)</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start border-b border-gray-100 pb-3">
            <div>
              <p className="text-xs text-gray-500">รหัสการจอง (Booking ID)</p>
              <p className="text-base font-bold text-gray-900">{booking.id}</p>
            </div>
            <div>{getStatusBadge(booking.status)}</div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-start space-x-3 bg-gray-50 p-3 rounded-xl">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-medium">ห้องที่จอง (Room)</p>
                <p className="font-bold text-gray-800">{booking.roomName}</p>
                <p className="text-xs text-gray-600">{booking.building}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">วันที่จอง</p>
                  <p className="font-bold text-gray-800">{booking.date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">เวลา</p>
                  <p className="font-bold text-gray-800">{booking.startTime} - {booking.endTime} น.</p>
                </div>
              </div>
            </div>

            {booking.purpose && (
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">วัตถุประสงค์การใช้งาน</p>
                <p className="text-gray-800 text-sm">{booking.purpose}</p>
              </div>
            )}

            <div className="text-right text-xs text-gray-400 pt-2">
              สร้างรายการเมื่อ: {booking.createdAt}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
