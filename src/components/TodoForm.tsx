
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addTodo } from '@/lib/localStorage';
import { toast } from '@/hooks/use-toast';
import { PlusIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TodoFormProps {
  onAddSuccess: () => void;
}

const TodoForm = ({ onAddSuccess }: TodoFormProps) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast({
        title: "Empty Todo",
        description: "Please enter something to do.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      addTodo(text);
      setText('');
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
      onAddSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4 w-full max-w-md mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex gap-2 items-center w-full">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 h-12 px-4 text-base transition-all duration-200 focus-within:shadow-md focus-within:border-accent bg-white/70 backdrop-blur-sm"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          className="h-12 px-4 transition-all duration-300 hover:scale-105 bg-accent hover:bg-accent/90"
          disabled={isSubmitting}
        >
          <span className="sr-only">Add Todo</span>
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
    </motion.form>
  );
};

export default TodoForm;
