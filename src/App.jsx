import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterTabs from "./components/FilterTabs";
import WeekNavigator from "./components/WeekNavigator";

const STORAGE_KEY = "todos_week_app";

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
    if (!saved) return { todos: [], nextId: 0 };
    const parsed = JSON.parse(saved);
    return { todos: parsed.todos || [], nextId: parsed.nextId || 0 };
  } catch {
    return { todos: [], nextId: 0 };
  }
}

export default function App() {
  const [todos, setTodos] = useState(() => loadFromLocalStorage().todos);
  const [nextId, setNextId] = useState(() => loadFromLocalStorage().nextId);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(() => getWeekStart(new Date()));

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, nextId }));
    } catch (e) {
      console.warn("저장 실패:", e);
    }
  }, [todos, nextId]);

  function handleSelectDate(date) { setSelectedDate(date); }
  function handlePrevWeek() {
    setWeekStartDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  }
  function handleNextWeek() {
    setWeekStartDate((prev) => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  }
  function handleAddTodo(text) {
    setTodos((prev) => [...prev, { id: nextId, text, completed: false, date: formatDate(selectedDate) }]);
    setNextId((prev) => prev + 1);
  }
  function handleToggleComplete(id) {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  }
  function handleEditTodo(id, newText) {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, text: newText } : t));
  }
  function handleDeleteTodo(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  const filteredTodos = todos.filter((todo) => {
    if (todo.date !== formatDate(selectedDate)) return false;
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
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