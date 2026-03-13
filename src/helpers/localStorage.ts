//helper gor get and set local storage values
export const getLocalStorage = (key: string) => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const setLocalStorage = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key: string) => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(key);
};
