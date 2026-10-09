import React, { useState, useEffect } from 'react';
import { AuditLog } from '../types/database';
import { apiService } from '../services/apiService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { ShieldAlert, Clock, Table, User } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถดึงข้อมูล Audit Logs ได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-sky-600 bg-opacity-40 text-sky-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          Entity: AUDIT_LOGS, DATA_HISTORIES
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">ประวัติการตรวจสอบระบบ (Audit Logs)</h2>
        <p className="text-sky-100 text-sm md:text-base">
          ติดตามการเปลี่ยนแปลงข้อมูล (INSERT / UPDATE / DELETE) และประวัติฟิลด์ข้อมูลตามโครงสร้าง ER Diagram ทุกประการ
        </p>
      </div>

      {loading ? (
        <LoadingState message="กำลังดึงข้อมูล AUDIT_LOGS จากฐานข้อมูล..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLogs} />
      ) : logs.length === 0 ? (
        <EmptyState message="ไม่พบข้อมูล AUDIT_LOGS ในฐานข้อมูล" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Log ID</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Table Name</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Record ID</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.log_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{log.log_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{log.table_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.record_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.user_id ?? 'System'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip_address || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.created_at}</td>
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
