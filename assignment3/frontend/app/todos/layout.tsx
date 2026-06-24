import React from "react";

export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-7 py-8">
        <h1 className="text-center text-2xl font-extrabold italic text-[#672be0] mb-6 tracking-tight">
          Todo List
        </h1>
        {children}
      </div>
    </div>
  );
}
