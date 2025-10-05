export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
    return false;
  }
};

export const clearLocalStorage = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
    return false;
  }
};
