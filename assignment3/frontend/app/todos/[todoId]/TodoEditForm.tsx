"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  date: string;
}

interface TodoEditFormProps {
  todo: Todo;
  initialFilter: string;
}

export default function TodoEditForm({ todo, initialFilter }: TodoEditFormProps) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [isCompleted, setIsCompleted] = useState(todo.isCompleted);
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
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmed,
          isCompleted: isCompleted,
        }),
      });

      if (res.ok) {
        router.push(`/todos?date=${todo.date}&filter=${initialFilter}`);
        router.refresh();
      } else {
        alert("할 일 수정에 실패했습니다.");
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
      <h2 className="text-sm font-semibold text-gray-500">할 일 수정</h2>
      
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

      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          id="isCompleted"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="w-4.5 h-4.5 text-[#672be0] bg-gray-100 border-gray-300 rounded-lg focus:ring-[#672be0] focus:ring-2"
        />
        <label htmlFor="isCompleted" className="text-sm font-semibold text-gray-600 cursor-pointer select-none">
          완료 여부
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-[#672be0] hover:bg-[#521ec2] text-white text-sm font-bold rounded-2xl shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "수정 중..." : "수정 완료"}
        </button>
        <Link
          href={`/todos?date=${todo.date}&filter=${initialFilter}`}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold rounded-2xl text-center transition-all"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
