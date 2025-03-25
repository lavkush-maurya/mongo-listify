
import { Todo } from '../lib/mongodb';

// Mock database to store todos when testing locally
const mockTodos: Todo[] = [];

// This will handle all our API requests in the frontend until we integrate with a real backend
export const handleRequest = async (request: Request) => {
  const url = new URL(request.url);
  const mongoDBURI = request.headers.get('X-MongoDB-URI');

  // Validate MongoDB URI is present
  if (!mongoDBURI) {
    return new Response(JSON.stringify({ error: 'MongoDB URI is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Handle todos endpoints
  if (url.pathname === '/api/todos') {
    // GET all todos
    if (request.method === 'GET') {
      return new Response(JSON.stringify(mockTodos), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // POST create new todo
    if (request.method === 'POST') {
      const data = await request.json();
      const newTodo: Todo = {
        _id: Date.now().toString(),
        text: data.text,
        completed: false,
        createdAt: new Date().toISOString()
      };
      mockTodos.push(newTodo);
      return new Response(JSON.stringify(newTodo), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle individual todo endpoints
  const todoIdMatch = url.pathname.match(/^\/api\/todos\/(.+)$/);
  if (todoIdMatch) {
    const todoId = todoIdMatch[1];
    const todoIndex = mockTodos.findIndex(todo => todo._id === todoId);

    if (todoIndex === -1) {
      return new Response(JSON.stringify({ error: 'Todo not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // GET single todo
    if (request.method === 'GET') {
      return new Response(JSON.stringify(mockTodos[todoIndex]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // PUT update todo
    if (request.method === 'PUT') {
      const data = await request.json();
      mockTodos[todoIndex] = { ...mockTodos[todoIndex], ...data };
      return new Response(JSON.stringify(mockTodos[todoIndex]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // DELETE todo
    if (request.method === 'DELETE') {
      const deletedTodo = mockTodos.splice(todoIndex, 1)[0];
      return new Response(JSON.stringify(deletedTodo), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle 404 for unknown routes
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Setup request interceptor
export const setupMockAPI = () => {
  // Create a proxy to intercept fetch requests
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? new URL(input, window.location.origin) : new URL(input.toString());
    
    // Handle API requests
    if (url.pathname.startsWith('/api/')) {
      const request = new Request(url.toString(), init);
      return handleRequest(request);
    }

    // Pass through other requests
    return originalFetch(input, init);
  };
};
