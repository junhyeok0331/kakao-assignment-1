"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-8">
      <h2 className="text-lg font-bold text-red-600 mb-2">오류가 발생했습니다!</h2>
      <p className="text-sm text-gray-500 mb-6">{error.message || "알 수 없는 오류가 발생했습니다."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[#672be0] hover:bg-[#521ec2] text-white text-sm font-semibold rounded-xl shadow-md transition-all"
      >
        다시 시도하기
      </button>
    </div>
  );
}
