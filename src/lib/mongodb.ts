
import { toast } from '@/hooks/use-toast';

export interface Todo {
  _id?: string;
  text: string;
  completed: boolean;
  createdAt?: string;
}

// This will be replaced with your MongoDB URI
let MONGODB_URI = '';

// Function to set MongoDB URI
export const setMongoDBURI = (uri: string) => {
  MONGODB_URI = uri;
  localStorage.setItem('MONGODB_URI', uri);
  return MONGODB_URI;
};

// Function to get MongoDB URI
export const getMongoDBURI = (): string => {
  if (!MONGODB_URI) {
    const storedURI = localStorage.getItem('MONGODB_URI');
    if (storedURI) {
      MONGODB_URI = storedURI;
    }
  }
  return MONGODB_URI;
};

// Function to fetch todos from MongoDB
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const uri = getMongoDBURI();
    if (!uri) {
      console.log('MongoDB URI not set');
      return [];
    }

    const response = await fetch('/api/todos', {
      headers: {
        'X-MongoDB-URI': uri
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    toast({
      title: 'Error',
      description: 'Failed to load todos. Please check your connection.',
      variant: 'destructive'
    });
    return [];
  }
};

// Function to add a new todo
export const addTodo = async (text: string): Promise<Todo | null> => {
  try {
    const uri = getMongoDBURI();
    if (!uri) {
      toast({
        title: 'Error',
        description: 'MongoDB URI not set. Please add your URI first.',
        variant: 'destructive'
      });
      return null;
    }

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MongoDB-URI': uri
      },
      body: JSON.stringify({ text, completed: false })
    });

    if (!response.ok) {
      throw new Error('Failed to add todo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding todo:', error);
    toast({
      title: 'Error',
      description: 'Failed to add todo. Please try again.',
      variant: 'destructive'
    });
    return null;
  }
};

// Function to update a todo
export const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo | null> => {
  try {
    const uri = getMongoDBURI();
    if (!uri) {
      toast({
        title: 'Error',
        description: 'MongoDB URI not set. Please add your URI first.',
        variant: 'destructive'
      });
      return null;
    }

    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-MongoDB-URI': uri
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating todo:', error);
    toast({
      title: 'Error',
      description: 'Failed to update todo. Please try again.',
      variant: 'destructive'
    });
    return null;
  }
};

// Function to delete a todo
export const deleteTodo = async (id: string): Promise<boolean> => {
  try {
    const uri = getMongoDBURI();
    if (!uri) {
      toast({
        title: 'Error',
        description: 'MongoDB URI not set. Please add your URI first.',
        variant: 'destructive'
      });
      return false;
    }

    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'X-MongoDB-URI': uri
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }

    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete todo. Please try again.',
      variant: 'destructive'
    });
    return false;
  }
};
