import { TodoItem } from "./TodoItem"


export function TodoList({todos, onDelete, onToggle}) {
  return (
    <div className="space-y-4">
        {todos.map((todo) => (
            <TodoItem 
                key={todo._id} 
                todo={todo} 
                onDelete={onDelete} 
                onToggle={onToggle} 
            />
        ))}
    </div>
  )
}
