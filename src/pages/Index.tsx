
import { useState } from 'react';
import { motion } from 'framer-motion';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddSuccess = () => {
    // Trigger a refresh of the todo list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {/* Background waves */}
      <div className="wave-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full mx-auto px-4 py-12 relative z-10"
      >
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight bg-gradient-to-r from-accent to-blue-600 bg-clip-text text-transparent">Elegantly Simple Todos</h1>
            <p className="text-muted-foreground mt-2 mb-6 text-lg">
              A beautifully designed, minimalist todo application
            </p>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md mx-auto flex flex-col items-center gap-8 backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-lg border border-white/50"
        >
          <TodoForm onAddSuccess={handleAddSuccess} />
          <TodoList key={refreshKey} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
