
import { useState, useEffect } from 'react';
import TodoCard from './TodoCard';
import { Todo, fetchTodos } from '@/lib/mongodb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
      toast({
        title: 'Error',
        description: 'Failed to load todos. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleUpdate = () => {
    loadTodos();
  };

  const handleDelete = () => {
    loadTodos();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 transition-all duration-300">
      {todos.length > 0 && (
        <div className="flex justify-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="transition-all duration-200"
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
            className="transition-all duration-200"
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="transition-all duration-200"
          >
            Completed
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-accent"></div>
        </div>
      ) : filteredTodos.length > 0 ? (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground animate-fade-in">
          {todos.length === 0 ? (
            <p>Add your first todo to get started</p>
          ) : (
            <p>No {filter !== 'all' ? filter : ''} todos found</p>
          )}
        </div>
      )}
      
      {todos.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="text-sm text-muted-foreground text-center animate-fade-in">
            {activeTodoCount} {activeTodoCount === 1 ? 'item' : 'items'} left
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList;
