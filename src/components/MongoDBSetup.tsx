
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import { setMongoDBURI, getMongoDBURI } from '@/lib/mongodb';
import { DatabaseIcon } from 'lucide-react';

const MongoDBSetup = () => {
  const [uri, setUri] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedUri = getMongoDBURI();
    setIsConfigured(!!savedUri);
    if (savedUri) {
      // Mask the URI for security
      setUri('mongodb://*****');
    }
  }, []);

  const handleSave = () => {
    if (!uri.trim() || !uri.startsWith('mongodb')) {
      toast({
        title: "Invalid URI",
        description: "Please enter a valid MongoDB URI",
        variant: "destructive"
      });
      return;
    }

    setMongoDBURI(uri);
    setIsConfigured(true);
    setOpen(false);
    
    toast({
      title: "Success",
      description: "MongoDB URI saved successfully",
    });
    
    // Refresh the page to apply the new URI
    window.location.reload();
  };

  const handleClear = () => {
    localStorage.removeItem('MONGODB_URI');
    setIsConfigured(false);
    setUri('');
    setOpen(false);
    
    toast({
      title: "Success",
      description: "MongoDB URI cleared",
    });
    
    // Refresh the page
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isConfigured ? "outline" : "default"}
          className="gap-2 transition-all duration-300"
        >
          <DatabaseIcon className="h-4 w-4" />
          {isConfigured ? "MongoDB Connected" : "Connect MongoDB"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isConfigured ? "Update MongoDB Connection" : "Connect to MongoDB"}</DialogTitle>
          <DialogDescription>
            Enter your MongoDB connection URI to store your todos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mongodb-uri" className="text-right">
              URI
            </Label>
            <Input
              id="mongodb-uri"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="mongodb://username:password@host:port/database"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          {isConfigured && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleClear}
            >
              Clear Connection
            </Button>
          )}
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MongoDBSetup;
