export function TodoItem({ todo, onDelete, onToggle, onEdit }) {
    return (
        <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">

            {/* Checkbox */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggle(todo._id)}
                    className="w-4 h-4"
                />

                <span
                    className={`cursor-pointer ${todo.completed ? "line-through text-gray-500" : ""
                        }`}
                >
                    {todo.title}
                </span>
            </div>

            {/* Edit */}
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(todo)}
                    className="text-blue-500"
                >
                    Edit
                </button>

            </div>

            {/* Delete */}
            <button
                onClick={() => onDelete(todo._id)}
                className="text-red-500"
            >
                Delete
            </button>
        </div>
    );
}