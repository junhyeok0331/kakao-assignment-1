"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TodoCreateFormProps {
  initialDate: string;
  initialFilter: string;
}

export default function TodoCreateForm({ initialDate, initialFilter }: TodoCreateFormProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [date, setDate] = useState(initialDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      alert("할 일을 입력해주세요!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed,
          date: date,
        }),
      });

      if (res.ok) {
        // 성공 시 목록 페이지로 이동하며 최신화 (기존 필터 유지)
        router.push(`/todos?date=${date}&filter=${initialFilter}`);
        router.refresh();
      } else {
        alert("할 일 추가에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("네트워크 에러가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-500">새 할 일 추가</h2>
      
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-400">내용</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
          className="w-full px-4 py-2.5 text-sm rounded-2xl border border-violet-100 outline-none focus:ring-2 focus:ring-violet-200 text-gray-700 bg-violet-50/30"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-400">날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2.5 text-sm rounded-2xl border border-violet-100 outline-none focus:ring-2 focus:ring-violet-200 text-gray-700 bg-violet-50/30"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-[#672be0] hover:bg-[#521ec2] text-white text-sm font-bold rounded-2xl shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "추가 중..." : "추가하기"}
        </button>
        <Link
          href={`/todos?date=${initialDate}&filter=${initialFilter}`}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-2xl text-center transition-all"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
