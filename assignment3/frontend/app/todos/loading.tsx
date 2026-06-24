import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="w-10 h-10 border-4 border-[#672be0] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500">데이터를 불러오는 중입니다...</p>
    </div>
  );
}
