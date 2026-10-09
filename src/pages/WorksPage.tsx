import React, { useState, useEffect } from 'react';
import { Work, Student, CheckIn } from '../types/database';
import { apiService } from '../services/apiService';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Calendar, MapPin, User, CheckCircle2, Clock, FileText } from 'lucide-react';

export const WorksPage: React.FC = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [wData, sData, cData] = await Promise.all([
        apiService.getWorks(),
        apiService.getStudents(),
        apiService.getCheckIns(),
      ]);
      setWorks(wData);
      setStudents(sData);
      setCheckIns(cData);
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถดึงข้อมูลจากระบบได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8">
        <span className="bg-teal-500 bg-opacity-40 text-teal-100 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
          Entity: WORKS, STUDENTS, CHECK_INS, CHECK_IN_DETAILS
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">จัดการงาน (Works) และบันทึกการเข้าร่วม</h2>
        <p className="text-teal-100 text-sm md:text-base">
          แสดงรายการงานตาม ER Diagram เป๊ะๆ 100% เชื่อมโยงระหว่าง USERS (ผู้สร้างงาน), STUDENTS (นักศึกษาผู้เข้าร่วม), และ CHECK_INS
        </p>
      </div>

      {loading ? (
        <LoadingState message="กำลังดึงข้อมูล WORKS และ CHECK_INS จากฐานข้อมูล..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : works.length === 0 ? (
        <EmptyState message="ไม่พบข้อมูล WORKS ในฐานข้อมูล" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {works.map((work) => {
            const workCheckIns = checkIns.filter((c) => c.work_id === work.work_id);
            return (
              <div key={work.work_id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{work.title}</h3>
                    <span className="bg-teal-50 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-100">
                      Work ID: {work.work_id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{work.description}</p>

                  <div className="space-y-2 text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>เริ่ม: {work.start_time} | สิ้นสุด: {work.end_time}</span>
                    </div>
                    {work.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-teal-600" />
                        <span>สถานที่: {work.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-teal-600" />
                      <span>สร้างโดย User ID: {work.created_by_user_id}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    นักศึกษาที่เข้าร่วม (CHECK_INS): {workCheckIns.length} คน
                  </h4>
                  <div className="space-y-1.5">
                    {workCheckIns.map((ci) => {
                      const student = students.find((s) => s.student_id === ci.student_id);
                      return (
                        <div key={ci.check_in_id} className="flex justify-between items-center text-xs bg-teal-50 bg-opacity-50 px-3 py-2 rounded-lg">
                          <span className="font-semibold text-gray-800">
                            {student ? `${student.student_code} - ${student.first_name} ${student.last_name}` : `Student ID: ${ci.student_id}`}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">
                            {ci.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
