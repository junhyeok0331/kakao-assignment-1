import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// 1. GET /api/todos (전체 또는 특정 날짜 및 필터 Todo 목록 조회)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const filter = searchParams.get("filter");
  const search = searchParams.get("search");
  
  const params = new URLSearchParams();
  if (date) params.append("date", date);
  if (filter) params.append("filter", filter);
  if (search) params.append("search", search);

  const url = params.toString()
    ? `${BACKEND_API_URL}/todos?${params.toString()}`
    : `${BACKEND_API_URL}/todos`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from backend" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST /api/todos (새 Todo 생성)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to create todo in backend" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
