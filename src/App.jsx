import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterTabs from "./components/FilterTabs";
import WeekNavigator from "./components/WeekNavigator";

const STORAGE_KEY = "minimal_todo_app_todos";
const SELECTED_DATE_KEY = "todos_selected_date";
const WEEK_START_KEY = "todos_week_start_date";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function loadSelectedDateFromLocalStorage() {
  try {
    const saved = localStorage.getItem(SELECTED_DATE_KEY);
    if (!saved) return new Date();
    return new Date(saved);
  } catch {
    return new Date();
  }
}

function loadWeekStartFromLocalStorage() {
  try {
    const saved = localStorage.getItem(WEEK_START_KEY);
    if (!saved) return getWeekStart(new Date());
    return new Date(saved);
  } catch {
    return getWeekStart(new Date());
  }
}

export default function App() {
  const [todos, setTodos] = useState(() => loadFromLocalStorage());
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => loadSelectedDateFromLocalStorage());
  const [weekStartDate, setWeekStartDate] = useState(() => loadWeekStartFromLocalStorage());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.warn("저장 실패:", e);
    }
  }, [todos]);

  useEffect(() => {
    try {
      localStorage.setItem(SELECTED_DATE_KEY, selectedDate.toISOString());
    } catch (e) {
      console.warn("선택 날짜 저장 실패:", e);
    }
  }, [selectedDate]);

  useEffect(() => {
    try {
      localStorage.setItem(WEEK_START_KEY, weekStartDate.toISOString());
    } catch (e) {
      console.warn("주간 시작일 저장 실패:", e);
    }
  }, [weekStartDate]);

  function handleSelectDate(date) { setSelectedDate(date); }
  function handlePrevWeek() {
    setWeekStartDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  }
  function handleNextWeek() {
    setWeekStartDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  }
  function handleAddTodo(text) {
    setTodos((prev) => [...prev, { id: Date.now(), text, isCompleted: false, date: formatDate(selectedDate) }]);
  }
  function handleToggleComplete(id) {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  }
  function handleEditTodo(id, newText) {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, text: newText } : t));
  }
  function handleDeleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== formatDate(selectedDate)) return false;
    if (currentFilter === "active") return !todo.isCompleted;
    if (currentFilter === "completed") return todo.isCompleted;
    return true;
  });

  return (
    /* 연보라 배경 */
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 py-12">
      {/* 흰색 카드 */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-7 py-8">

        {/* 타이틀 */}
        <h1 className="text-center text-2xl font-extrabold italic text-[#672be0] mb-6 tracking-tight">
          Todo List
        </h1>

        <WeekNavigator
          selectedDate={selectedDate}
          weekStartDate={weekStartDate}
          todos={todos}
          onSelectDate={handleSelectDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />

        <TodoInput onAddTodo={handleAddTodo} />

        <FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} />

        <TodoList
          todos={filteredTodos}
          onToggleComplete={handleToggleComplete}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </div>
    </div>
  );
}