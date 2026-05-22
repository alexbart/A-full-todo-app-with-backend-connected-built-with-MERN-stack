import { TodoItem } from "./TodoItem"


export function TodoList({todos, onDelete}) {
  return (
    <div className="space-y-4">
        {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
        ))}
    </div>
  )
}
