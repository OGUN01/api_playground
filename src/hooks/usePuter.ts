import { useState, useEffect } from 'react';

declare global {
  interface Window {
    puter: any;
  }
}

export function usePuter() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Puter is already loaded
    if (window.puter) {
      setIsLoaded(true);
      return;
    }

    // Create a promise that resolves when Puter is loaded
    const puterLoadPromise = new Promise<void>((resolve, reject) => {
      // Set a timeout to reject if loading takes too long
      const timeoutId = setTimeout(() => {
        reject(new Error('Puter.js load timeout'));
      }, 10000); // 10 second timeout

      // Check periodically if Puter is loaded
      const checkInterval = setInterval(() => {
        if (window.puter) {
          clearTimeout(timeoutId);
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });

    puterLoadPromise
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        console.error('Failed to load Puter.js:', err);
      });

    return () => {
      // Cleanup will be handled by the promise timeout
    };
  }, []);

  return { isLoaded, error };
}