import React, { useState, useEffect } from 'react';
import { libraryService } from '../services/libraryService';
import { StatisticsReportResult } from '../types/library';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { BarChart3, Calendar, Filter, RefreshCw, Clock, TrendingUp, Library } from 'lucide-react';

export const AdminStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportResult, setReportResult] = useState<StatisticsReportResult | null>(null);

  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-31');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await libraryService.getRoomUsageStatistics(startDate, endDate, buildingFilter);
      setReportResult(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถดึงข้อมูลรายงานสถิติได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-purple-600 bg-opacity-40 text-purple-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          UC10: Room Usage Statistics Report for Admins
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">รายงานสถิติการใช้งานห้องอ่านหนังสือห้องสมุด (Library Study Room Statistics)</h2>
        <p className="text-purple-100 text-sm md:text-base">
          เลือกช่วงเวลาและเงื่อนไขเพื่อตรวจสอบสถิติการใช้งานห้องอ่านหนังสือภายในห้องสมุดมหาวิทยาลัยตาม Use Case UC10
        </p>
      </div>

      {/* Filter Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-800">เลือกช่วงเวลาและเงื่อนไขรายงาน</h3>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">วันที่เริ่มต้น</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">วันที่สิ้นสุด</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">อาคารห้องสมุด / เงื่อนไข</label>
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">ทุกอาคาร (All Buildings)</option>
              <option value="อาคารหอสมุดกลาง">อาคารหอสมุดกลาง</option>
              <option value="อาคารทรัพยากรการเรียนรู้">อาคารทรัพยากรการเรียนรู้</option>
              <option value="อาคารวิทยบริการ">อาคารวิทยบริการ</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ประมวลผลรายงาน</span>
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingState message="กำลังประมวลผลสถิติการใช้งานห้องสมุด..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReport} />
      ) : !reportResult || reportResult.statistics.length === 0 ? (
        <EmptyState
          message="ไม่พบข้อมูลสถิติการใช้งานตามเงื่อนไขที่เลือก"
          subMessage="กรุณาเปลี่ยนช่วงเวลาหรือเงื่อนไขการค้นหาใหม่อีกครั้งเพื่อดูรายงานสถิติห้องสมุด"
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-600 p-3.5 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ยอดการจองห้องรวมทั้งหมด</p>
                <h4 className="text-2xl font-bold text-gray-900">{reportResult.totalBookingsCount} ครั้ง</h4>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
              <div className="bg-indigo-100 text-indigo-600 p-3.5 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">ชั่วโมงการใช้งานรวม</p>
                <h4 className="text-2xl font-bold text-gray-900">{reportResult.totalUsageHours} ชั่วโมง</h4>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">ผลการประมวลผลรายงานสถิติการใช้ห้อง (UC10)</h3>
                <p className="text-xs text-gray-500">สร้างรายงานเมื่อ: {reportResult.generatedAt}</p>
              </div>
              <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold border border-purple-100">
                ช่วงเวลา: {startDate} ถึง {endDate}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ห้องอ่านหนังสือ (Study Room)</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">อาคาร</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">จำนวนครั้งที่จอง</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">ชั่วโมงใช้งานรวม</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">อัตราการใช้งาน (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportResult.statistics.map((stat) => (
                    <tr key={stat.roomId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{stat.roomName}</div>
                        <div className="text-xs text-gray-500">ID: {stat.roomId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stat.building}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">{stat.totalBookings} ครั้ง</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{stat.totalHours} ชม.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${stat.usageRatePercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-purple-600 w-12 text-right">
                            {stat.usageRatePercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
