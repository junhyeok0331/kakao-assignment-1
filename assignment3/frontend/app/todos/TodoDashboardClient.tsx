"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  date: string;
}

interface TodoDashboardProps {
  initialTodos: Todo[];
  initialFilteredTodos: Todo[];
  initialSelectedDate: string;
  initialFilter: string;
  initialSearch: string;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 월요일 기준
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatWeekRange(start: Date) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${formatDate(start)} ~ ${formatDate(end)}`;
}

export default function TodoDashboardClient({
  initialTodos,
  initialFilteredTodos,
  initialSelectedDate,
  initialFilter,
  initialSearch,
}: TodoDashboardProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(initialFilteredTodos);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(initialSelectedDate));
  const [weekStartDate, setWeekStartDate] = useState<Date>(getWeekStart(new Date(initialSelectedDate)));
  const [searchVal, setSearchVal] = useState<string>(initialSearch);

  const currentFilter = initialFilter;
  const todayStr = formatDate(new Date());
  const selectedStr = formatDate(selectedDate);

  // 서버로부터 갱신된 props가 내려왔을 때 클라이언트 상태 동기화
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  useEffect(() => {
    setFilteredTodos(initialFilteredTodos);
  }, [initialFilteredTodos]);

  useEffect(() => {
    setSearchVal(initialSearch);
  }, [initialSearch]);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStartDate);
    d.setDate(weekStartDate.getDate() + i);
    return d;
  });

  const handlePrevWeek = () => {
    setWeekStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setWeekStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    router.push(`/todos?date=${formatDate(date)}&filter=${currentFilter}&search=${searchVal}`);
  };

  const handleFilterChange = (filterVal: string) => {
    router.push(`/todos?date=${selectedStr}&filter=${filterVal}&search=${searchVal}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/todos?date=${selectedStr}&filter=${currentFilter}&search=${searchVal.trim()}`);
  };

  const handleSearchClear = () => {
    setSearchVal("");
    router.push(`/todos?date=${selectedStr}&filter=${currentFilter}&search=`);
  };

  // 완료 토글 (PUT /api/todos/{id})
  const handleToggleComplete = async (todo: Todo) => {
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: !todo.isCompleted }),
      });
      if (res.ok) {
        const updated = await res.json();
        // 1. 전체 Todo 목록 갱신 (요일별 카운트 연동 목적)
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
        // 2. 현재 필터링되어 렌더링 중인 목록 갱신
        setFilteredTodos((prev) => {
          if (currentFilter === "completed" && !updated.isCompleted) {
            return prev.filter((t) => t.id !== todo.id);
          }
          if (currentFilter === "active" && updated.isCompleted) {
            return prev.filter((t) => t.id !== todo.id);
          }
          return prev.map((t) => (t.id === todo.id ? updated : t));
        });
        // 3. 서버 사이드 데이터 최신화 트리거
        router.refresh();
      } else {
        alert("할 일 상태 변경에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // 삭제 (DELETE /api/todos/{id})
  const handleDeleteTodo = async (id: number) => {
    if (!window.confirm("정말로 이 할 일을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (res.status === 204 || res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
        setFilteredTodos((prev) => prev.filter((t) => t.id !== id));
        router.refresh();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (e) {
      console.error(e);
      alert("네트워크 에러가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. WeekNavigator */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <button
            onClick={handlePrevWeek}
            aria-label="이전 주"
            className="text-[#672be0] hover:opacity-60 transition font-bold text-base leading-none"
          >
            ◀
          </button>
          <span className="text-xs font-semibold text-gray-400 tracking-wide">
            {formatWeekRange(weekStartDate)}
          </span>
          <button
            onClick={handleNextWeek}
            aria-label="다음 주"
            className="text-[#672be0] hover:opacity-60 transition font-bold text-base leading-none"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedStr;
            const isToday = dateStr === todayStr;
            const count = todos.filter((t) => t.date === dateStr).length;

            return (
              <button
                key={dateStr}
                onClick={() => handleSelectDate(date)}
                className={`
                  flex flex-col items-center justify-center gap-0.5
                  rounded-2xl py-2 transition-all
                  ${isSelected
                    ? "bg-[#672be0] text-white shadow-md shadow-violet-200"
                    : isToday
                    ? "bg-violet-100 text-[#672be0]"
                    : "text-gray-400 hover:bg-violet-50"
                  }
                `}
              >
                <span className="text-[10px] font-semibold">
                  {DAY_LABELS[date.getDay()]}
                </span>
                <span className="text-sm font-bold leading-snug">
                  {date.getDate()}
                </span>
                <span className={`text-[10px] font-medium ${isSelected ? "text-violet-200" : "text-gray-300"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1-2. Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-violet-50/20 px-3.5 py-2.5 rounded-2xl border border-violet-100 focus-within:ring-2 focus-within:ring-violet-200 transition-all">
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="할 일을 검색하세요... (Enter 혹은 클릭)"
          className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
        />
        {searchVal && (
          <button
            type="button"
            onClick={handleSearchClear}
            className="text-gray-400 hover:text-gray-600 text-xs font-bold px-1 transition"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="text-[#672be0] hover:opacity-60 transition text-sm font-bold"
        >
          검색
        </button>
      </form>

      {/* 2. 새 Todo 추가 헤더 */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-500">할 일 목록 ({filteredTodos.length})</span>
        <Link
          href={`/todos/new?date=${selectedStr}&filter=${currentFilter}&search=${searchVal}`}
          className="px-3 py-1.5 bg-[#672be0] hover:bg-[#521ec2] text-white text-xs font-semibold rounded-xl shadow transition-all"
        >
          + 새 할 일
        </Link>
      </div>

      {/* 3. FilterTabs */}
      <div className="flex gap-2 mb-5">
        {[
          { label: "전체", value: "all" },
          { label: "진행 중", value: "active" },
          { label: "완료", value: "completed" },
        ].map((tab) => {
          const isActive = currentFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className={`
                flex-1 py-2 rounded-full text-xs font-bold transition-all
                ${isActive
                  ? "bg-[#672be0] text-white shadow-md shadow-violet-200"
                  : "bg-violet-50 text-violet-300 hover:bg-violet-100"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. TodoList & TodoItem */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          등록된 할 일이 없거나 검색 결과가 없습니다.
        </div>
      ) : (
        <ul className="divide-y divide-violet-100 max-h-[250px] overflow-y-auto pr-1">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between py-3 gap-3">
              <span className={`flex-1 text-sm font-medium ${todo.isCompleted ? "line-through text-gray-300" : "text-gray-700"}`}>
                {todo.text}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleToggleComplete(todo)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all
                    ${todo.isCompleted
                      ? "bg-[#672be0] text-white hover:bg-[#5820c8]"
                      : "bg-violet-50 text-violet-300 hover:bg-violet-100"
                    }`}
                >
                  {todo.isCompleted ? "취소" : "완료"}
                </button>
                {!todo.isCompleted && (
                  <Link
                    href={`/todos/${todo.id}?date=${selectedStr}&filter=${currentFilter}&search=${searchVal}`}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-violet-50 text-violet-400 hover:bg-violet-100 transition"
                  >
                    수정
                  </Link>
                )}
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-800 text-white hover:bg-gray-900 transition"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
