import { useState } from "react";

export default function TodoItem({ todo, onToggleComplete, onEditTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  function handleEditConfirm() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) onEditTodo(todo.id, trimmed);
    else setEditText(todo.text);
    setIsEditing(false);
  }

  function handleEditCancel() { setEditText(todo.text); setIsEditing(false); }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleEditConfirm();
    if (e.key === "Escape") handleEditCancel();
  }

  return (
    <li className="flex items-center justify-between py-3 gap-3">
      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <input
            autoFocus
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-violet-300 outline-none focus:ring-2 focus:ring-violet-100"
          />
          <button onClick={handleEditConfirm} className="px-3 py-1.5 text-xs font-bold rounded-full bg-[#672be0] text-white hover:bg-[#5820c8] transition">확인</button>
          <button onClick={handleEditCancel} className="px-3 py-1.5 text-xs font-bold rounded-full bg-violet-50 text-violet-400 hover:bg-violet-100 transition">취소</button>
        </div>
      ) : (
        <>
          {/* Todo 텍스트 */}
          <span className={`flex-1 text-sm font-medium ${todo.completed ? "line-through text-gray-300" : "text-gray-700"}`}>
            {todo.text}
          </span>

          {/* 액션 버튼 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all
                ${todo.completed
                  ? "bg-violet-50 text-violet-300 hover:bg-violet-100"
                  : "bg-[#672be0] text-white hover:bg-[#5820c8] shadow-sm shadow-violet-200"
                }`}
            >
              완료
            </button>
            <button
              onClick={() => { setEditText(todo.text); setIsEditing(true); }}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-violet-50 text-violet-400 hover:bg-violet-100 transition"
            >
              수정
            </button>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-800 text-white hover:bg-gray-900 transition"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}