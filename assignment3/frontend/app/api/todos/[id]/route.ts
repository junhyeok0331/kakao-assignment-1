import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

// 1. PUT /api/todos/[id] (Todo 수정 - 내용 및 완료 여부 토글)
export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to update todo in backend" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. DELETE /api/todos/[id] (Todo 삭제)
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const id = params.id;
  try {
    const res = await fetch(`${BACKEND_API_URL}/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete todo in backend" }, { status: res.status });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
