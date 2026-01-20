import { useStore } from '../index';
import * as SecureStore from 'expo-secure-store';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({ items: [], user: null });
    jest.clearAllMocks();
  });

  it('should add item', () => {
    const { addItem } = useStore.getState();
    addItem('test item');
    const { items } = useStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].text).toBe('test item');
  });

  it('should set user and persist to SecureStore', async () => {
    const user = { id: '1', email: 'test@example.com', app_metadata: {}, user_metadata: {}, aud: 'authenticated', created_at: '' };
    const { setUser } = useStore.getState();
    
    setUser(user);
    
    const { user: storedUser } = useStore.getState();
    expect(storedUser).toEqual(user);
    // Wait for async operation (although it's void, we can check if called)
    // Since writeStoredUser is async but called without await, we might need a small delay or just expect it to be called eventually.
    // However, in the implementation it is: void writeStoredUser(user);
    // Jest runs synchronously unless we await.
    // We can use setTimeout or just check immediately if the promise started.
    // But since we mocked setItemAsync, we can just check if it was called.
    // Wait a tick for the promise to start
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('app-user', JSON.stringify(user));
  });

  it('should clear user and remove from SecureStore', async () => {
    const { clearUser } = useStore.getState();
    clearUser();
    
    const { user } = useStore.getState();
    expect(user).toBeNull();
    
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('app-user');
  });
});
