import React from "react";
import TodoCreateForm from "./TodoCreateForm";

export default async function NewTodoPage(
  props: {
    searchParams: Promise<{ date?: string; filter?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const todayStr = new Date().toISOString().split("T")[0];
  const initialDate = searchParams.date || todayStr;
  const initialFilter = searchParams.filter || "all";

  return (
    <TodoCreateForm initialDate={initialDate} initialFilter={initialFilter} />
  );
}
