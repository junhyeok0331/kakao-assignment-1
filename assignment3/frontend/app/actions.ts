"use server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
  date: string;
}

// 1. Todo 목록 가져오기 Server Action (날짜, 필터 및 검색 지원)
export async function getTodos(date?: string, filter?: string, search?: string): Promise<Todo[]> {
  try {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (filter) params.append("filter", filter);
    if (search) params.append("search", search);

    const url = params.toString()
      ? `${BACKEND_API_URL}/todos?${params.toString()}`
      : `${BACKEND_API_URL}/todos`;

    const res = await fetch(url, {
      cache: "no-store", // 캐시 비활성화하여 항상 최신 데이터 조회
    });
    if (!res.ok) {
      throw new Error(`FastAPI 서버 응답 실패: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("getTodos Server Action 에러:", error);
    return [];
  }
}

// 2. 단건 Todo 가져오기 Server Action
export async function getTodoById(id: string): Promise<Todo | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/todos/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`FastAPI 서버 응답 실패: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`getTodoById(${id}) Server Action 에러:`, error);
    return null;
  }
}
