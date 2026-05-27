import { api } from "./client";

export const getTodos = () => api.get("/todos");
export const createTodo = (todo) => api.post("/todos", todo);
export const toggleTodo = (id) => api.patch(`/todos/${id}/toggle`);
export const updateTodo = (id, data) => api.put(`/todos/${id}`, data);
export const deleteTodo = (id) => api.delete(`/todos/${id}`);