import axios from "axios"

const BASE_URL = "http://localhost:5000/api/todos";

// GET all todos
export const getTodos = () => axios.get(BASE_URL);

// CREATE a todo 
export const createTodo = (todo) => axios.post(BASE_URL, todo);

// UPDATE


//DELETE a todo

export const deleteTodo = (id) => axios.delete(`${BASE_URL}/${id}`);