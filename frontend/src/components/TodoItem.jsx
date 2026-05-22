

export function TodoItem({ todo, onDelete }) {
    console.log(todo);

    return (
        <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
            <span className="text-black">{todo.title}</span>
            <button
                onClick={() => {
                    console.log("Deleting: ", todo.id);

                    onDelete(todo.id)
                }}
                className="text-red-500 hover:text-red-700"

            >
                Delete
            </button>
        </div>
    )
}
