
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import MongoDBSetup from '@/components/MongoDBSetup';
import { getMongoDBURI } from '@/lib/mongodb';
import { setupMockAPI } from '@/api';

// Initialize the mock API
setupMockAPI();

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check if MongoDB URI is set
    const uri = getMongoDBURI();
    setIsConnected(!!uri);
  }, []);

  const handleAddSuccess = () => {
    // Trigger a refresh of the todo list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full mx-auto"
      >
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Elegantly Simple Todos</h1>
            <p className="text-muted-foreground mt-2 mb-6">
              A beautifully designed, minimalist todo application
            </p>
          </motion.div>
          
          <div className="flex justify-center mb-8">
            <MongoDBSetup />
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md mx-auto flex flex-col items-center gap-8"
        >
          {isConnected ? (
            <>
              <TodoForm onAddSuccess={handleAddSuccess} />
              <TodoList key={refreshKey} />
            </>
          ) : (
            <div className="text-center py-12 glass-card p-8 rounded-xl animate-float">
              <h2 className="text-xl font-medium mb-4">Connect to MongoDB</h2>
              <p className="mb-6 text-muted-foreground">
                Please connect your MongoDB database to start managing your todos.
              </p>
              <MongoDBSetup />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
