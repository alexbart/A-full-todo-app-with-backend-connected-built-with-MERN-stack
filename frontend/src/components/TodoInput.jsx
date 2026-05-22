import { useState } from "react";

export function TodoInput({ onAdd }) {
    const [text, setText] = useState("");

    const handleAdd = () => {
        if (!text.trim()) return;
        onAdd(text);
        setText("");
    };

    return (
        <div className="flex gap-2 mb-6">
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Add a new todo..." 
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button 
                onClick={handleAdd} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Add
            </button>
        </div>
    );
}