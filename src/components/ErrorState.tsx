import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-50 rounded-xl border border-red-200 shadow-sm my-6 text-center">
      <div className="bg-red-100 p-4 rounded-full text-red-600 mb-3">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h3 className="text-base font-bold text-red-800 mb-1">เกิดข้อผิดพลาดในการดึงข้อมูล</h3>
      <p className="text-sm text-red-600 max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>ลองใหม่อีกครั้ง</span>
        </button>
      )}
    </div>
  );
};
