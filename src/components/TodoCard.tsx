
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react';
import { Todo, updateTodo, deleteTodo } from '@/lib/localStorage';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface TodoCardProps {
  todo: Todo;
  onUpdate: () => void;
  onDelete: () => void;
}

const TodoCard = ({ todo, onUpdate, onDelete }: TodoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      updateTodo(todo._id as string, { completed: !todo.completed });
      onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      toast({
        title: "Empty Todo",
        description: "Todo text cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      updateTodo(todo._id as string, { text: editText });
      setIsEditing(false);
      onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      deleteTodo(todo._id as string);
      onDelete();
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className={cn(
        "w-full overflow-hidden transition-all duration-300 hover:shadow-md todo-enter bg-white/80 backdrop-blur-sm border border-blue-100/50",
        todo.completed && "opacity-80"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Checkbox 
                  id={`todo-${todo._id}`}
                  checked={todo.completed}
                  onCheckedChange={handleToggleComplete}
                  disabled={isUpdating || isDeleting}
                  className="todo-checkbox data-[state=checked]:bg-accent"
                />
                <label 
                  htmlFor={`todo-${todo._id}`}
                  className={cn(
                    "flex-1 text-lg transition-all duration-300",
                    todo.completed && "text-muted-foreground line-through"
                  )}
                >
                  {todo.text}
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    disabled={isUpdating || isDeleting}
                    className="h-8 w-8 transition-colors duration-200 hover:text-accent hover:bg-accent/10 rounded-full"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isDeleting || isUpdating}
                    className="h-8 w-8 transition-colors duration-200 hover:text-destructive hover:bg-destructive/10 rounded-full"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveEdit}
                  disabled={isUpdating}
                  className="h-8 w-8 transition-colors duration-200 hover:text-accent"
                >
                  <CheckIcon className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(todo.text);
                  }}
                  className="h-8 w-8 transition-colors duration-200 hover:text-destructive"
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TodoCard;
