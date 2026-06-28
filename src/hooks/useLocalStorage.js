import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

/**
 * Custom hook to manage state that persists in localStorage.
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if key doesn't exist
 * @returns {[*, Function]} State and setter function
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storageService.get(key, initialValue);
  });

  useEffect(() => {
    storageService.set(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
