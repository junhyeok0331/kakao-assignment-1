import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggleComplete, onEditTodo, onDeleteTodo }) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-xs text-gray-300 py-10">
        할 일이 없습니다. 추가해보세요!
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-gray-100">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onEditTodo={onEditTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}