import React from 'react';
import { FileQuestion, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-gray-200 shadow-sm my-6 text-center">
      <div className="bg-gray-100 p-4 rounded-full text-gray-400 mb-3">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h3 className="text-base font-bold text-gray-800 mb-1">{message}</h3>
      {subMessage && <p className="text-sm text-gray-500 max-w-md">{subMessage}</p>}
    </div>
  );
};
