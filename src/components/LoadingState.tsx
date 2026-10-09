import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'กำลังโหลดข้อมูลจากระบบ...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-200 shadow-sm my-6">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
      <p className="text-gray-600 font-medium text-sm">{message}</p>
    </div>
  );
};
