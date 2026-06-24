import React from "react";
import TodoEditForm from "./TodoEditForm";
import { notFound } from "next/navigation";
import { getTodoById } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditTodoPage(
  props: {
    params: Promise<{ todoId: string }>;
    searchParams: Promise<{ filter?: string }>;
  }
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const todoId = params.todoId;
  const initialFilter = searchParams.filter || "all";
  
  const todo = await getTodoById(todoId);

  if (!todo) {
    notFound();
  }

  return (
    <TodoEditForm todo={todo} initialFilter={initialFilter} />
  );
}
