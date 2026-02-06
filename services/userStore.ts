import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'user_email';

let currentUser: string | null = null;

export const userStore = {
  async setUser(name: string) {
    currentUser = name;
    await AsyncStorage.setItem(USER_KEY, name);
  },
  getUser(): string | null {
    return currentUser;
  },
  async loadUser(): Promise<string | null> {
    const saved = await AsyncStorage.getItem(USER_KEY);
    if (saved) {
      currentUser = saved;
    }
    return currentUser;
  },
  async clear() {
    currentUser = null;
    await AsyncStorage.removeItem(USER_KEY);
  },
};
