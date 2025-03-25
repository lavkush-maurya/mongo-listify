
export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

const TODOS_STORAGE_KEY = 'todos';

// Get all todos from localStorage
export const getTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
  if (!storedTodos) return [];
  
  try {
    return JSON.parse(storedTodos);
  } catch (error) {
    console.error('Failed to parse todos from localStorage:', error);
    return [];
  }
};

// Add a new todo to localStorage
export const addTodo = (text: string): Todo => {
  const todos = getTodos();
  
  const newTodo: Todo = {
    _id: Date.now().toString(),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  const updatedTodos = [...todos, newTodo];
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));
  
  return newTodo;
};

// Update a todo in localStorage
export const updateTodo = (id: string, updates: Partial<Todo>): Todo | null => {
  const todos = getTodos();
  const todoIndex = todos.findIndex(todo => todo._id === id);
  
  if (todoIndex === -1) return null;
  
  const updatedTodo = { ...todos[todoIndex], ...updates };
  todos[todoIndex] = updatedTodo;
  
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  return updatedTodo;
};

// Delete a todo from localStorage
export const deleteTodo = (id: string): boolean => {
  const todos = getTodos();
  const filteredTodos = todos.filter(todo => todo._id !== id);
  
  if (filteredTodos.length === todos.length) return false;
  
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(filteredTodos));
  return true;
};
