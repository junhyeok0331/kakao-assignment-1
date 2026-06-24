import React from "react";
import TodoDashboardClient from "./TodoDashboardClient";
import { getTodos } from "../actions";

// 빌드 에러 방지를 위해 dynamic 렌더링 강제 및 캐싱 제외
export const dynamic = "force-dynamic";

export default async function TodosPage(
  props: {
    searchParams: Promise<{ date?: string; filter?: string; search?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const todayStr = new Date().toISOString().split("T")[0];
  const selectedDate = searchParams.date || todayStr;
  const filter = searchParams.filter || "all";
  const search = searchParams.search || "";

  // 요일별 카운팅을 위해 전체 Todo 리스트 조회 (필터 및 검색 없음)
  const allTodos = await getTodos();
  
  // 화면에 렌더링할 필터링된/검색된 Todo 리스트 조회 (백엔드 단에서 필터링 및 검색)
  const filteredTodos = await getTodos(selectedDate, filter, search);

  return (
    <TodoDashboardClient
      initialTodos={allTodos}
      initialFilteredTodos={filteredTodos}
      initialSelectedDate={selectedDate}
      initialFilter={filter}
      initialSearch={search}
    />
  );
}
