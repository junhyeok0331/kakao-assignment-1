import { useState, useRef } from "react";

export default function TodoInput({ onAddTodo }) {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);

  function handleSubmit() {
    const trimmed = inputText.trim();
    if (!trimmed) {
      window.alert("할 일을 입력해주세요!");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }
    onAddTodo(trimmed);
    setInputText("");
  }

  function handleKeyDown(e) { if (e.key === "Enter") handleSubmit(); }

  return (
    <div className="mb-4">
      {/* 입력창 + 추가 버튼 통합 박스 */}
      <div className="flex items-center rounded-2xl border border-gray-200 overflow-hidden focus-within:border-[#672be0] focus-within:ring-2 focus-within:ring-violet-100 transition-all">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력하세요"
          className="flex-1 px-4 py-3 text-sm text-gray-700 placeholder-gray-300 bg-white outline-none"
        />
        <button
          onClick={handleSubmit}
          className="px-5 py-3 bg-[#672be0] text-white text-sm font-bold hover:bg-[#5820c8] active:scale-95 transition-all shrink-0"
        >
          추가
        </button>
      </div>
    </div>
  );
}