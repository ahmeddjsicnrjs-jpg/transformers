// Simple in-memory user store for MVP.
// Replace with AsyncStorage or a real auth solution later.

let currentUser: string | null = null;

export const userStore = {
  setUser(name: string) {
    currentUser = name;
  },
  getUser(): string | null {
    return currentUser;
  },
  clear() {
    currentUser = null;
  },
};
