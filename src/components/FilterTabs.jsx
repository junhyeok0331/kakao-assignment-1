const FILTER_TABS = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 mb-5">
      {FILTER_TABS.map((tab) => {
        const isActive = currentFilter === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
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
  );
}