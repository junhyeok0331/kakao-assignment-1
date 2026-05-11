const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatWeekRange(start) {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const f = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  return `${f(start)} ~ ${f(end)}`;
}

export default function WeekNavigator({ selectedDate, weekStartDate, todos, onSelectDate, onPrevWeek, onNextWeek }) {
  const todayStr = formatDate(new Date());
  const selectedStr = formatDate(selectedDate);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStartDate);
    d.setDate(weekStartDate.getDate() + i);
    return d;
  });

  return (
    <div className="mb-5">
      {/* 주간 범위 헤더 */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <button
          onClick={onPrevWeek}
          aria-label="이전 주"
          className="text-[#672be0] hover:opacity-60 transition font-bold text-base leading-none"
        >
          ◀
        </button>

        <span className="text-xs font-semibold text-gray-400 tracking-wide">
          {formatWeekRange(weekStartDate)}
        </span>

        <button
          onClick={onNextWeek}
          aria-label="다음 주"
          className="text-[#672be0] hover:opacity-60 transition font-bold text-base leading-none"
        >
          ▶
        </button>
      </div>

      {/* 요일 + 날짜 + 개수 셀 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const isSelected = dateStr === selectedStr;
          const isToday = dateStr === todayStr;
          const count = todos.filter((t) => t.date === dateStr).length;

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(date)}
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
  );
}