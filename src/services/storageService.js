/**
 * Storage service for localStorage interactions.
 */

const storageService = {
  /**
   * Retrieves an item from localStorage and parses it.
   * @param {string} key - The localStorage key
   * @param {*} defaultValue - Value to return if key doesn't exist
   * @returns {*} The parsed value or defaultValue
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Serializes and stores an item in localStorage.
   * @param {string} key - The localStorage key
   * @param {*} value - The value to store
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Removes an item from localStorage.
   * @param {string} key - The localStorage key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clears all items from localStorage.
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export default storageService;
