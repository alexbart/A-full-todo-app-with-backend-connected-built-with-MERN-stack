import { TodoItem } from "./TodoItem"


export function TodoList({ todos, onDelete, onToggle, onEdit, onClick }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">

        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Task</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {todos.map(todo => (
            <tr
              key={todo._id}
              className="border-t hover:bg-gray-50 cursor-pointer"
              onClick={() => onClick(todo)}
            >

              {/* TASK */}
              <td className="p-3">
                {todo.title}
              </td>

              {/* STATUS */}
              <td className="p-3">
                <span className={`font-semibold ${todo.completed ? "text-green-600" : "text-red-600"
                  }`}>
                  {todo.completed ? "Completed" : "Active"}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="p-3 flex gap-2">

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(todo._id);
                  }}
                  className="text-sm px-2 py-1 bg-gray-200 rounded"
                >
                  Toggle
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(todo);
                  }}
                  className="text-sm px-2 py-1 bg-blue-200 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(todo._id);
                  }}
                  className="text-sm px-2 py-1 bg-red-200 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
