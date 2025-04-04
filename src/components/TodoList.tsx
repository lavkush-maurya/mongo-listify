
import { useState, useEffect } from 'react';
import TodoCard from './TodoCard';
import { Todo, getTodos } from '@/lib/localStorage';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const loadTodos = () => {
    setIsLoading(true);
    try {
      const data = getTodos();
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
        <motion.div 
          className="flex justify-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="transition-all duration-200 bg-opacity-90"
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
            className="transition-all duration-200 bg-opacity-90"
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
            className="transition-all duration-200 bg-opacity-90"
          >
            Completed
          </Button>
        </motion.div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-accent"></div>
        </div>
      ) : (
        <AnimatePresence>
          {filteredTodos.length > 0 ? (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredTodos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {todos.length === 0 ? (
                <p>Add your first todo to get started</p>
              ) : (
                <p>No {filter !== 'all' ? filter : ''} todos found</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {todos.length > 0 && (
        <>
          <Separator className="my-4" />
          <motion.div 
            className="text-sm text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {activeTodoCount} {activeTodoCount === 1 ? 'item' : 'items'} left
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TodoList;
