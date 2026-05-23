export function TodoItem({ todo, onClick, onToggle, onDelete }) {
    return (
        <div
            onClick={() => onClick(todo)}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
        >
            <div className="flex justify-between items-center">

                <span className={todo.completed ? "line-through text-gray-400" : ""}>
                    {todo.title}
                </span>

                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onToggle(todo._id); }}>
                       COMPLETE ✔
                    </button>

                    <button onClick={(e) => { e.stopPropagation(); onDelete(todo._id); }}>
                      DELETE  🗑
                    </button>
                </div>
            </div>
        </div>
    );
}