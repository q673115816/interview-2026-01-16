import { SQLiteStorage } from '../storage';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
  })),
}));

describe('SQLiteStorage', () => {
  let mockDb: any;

  beforeAll(() => {
    // Get the mock db instance that was returned by openDatabaseSync
    const mockOpenDatabaseSync = require('expo-sqlite').openDatabaseSync;
    mockDb = mockOpenDatabaseSync.mock.results[0].value;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.execSync.mockClear();
    mockDb.runSync.mockClear();
    mockDb.getFirstSync.mockClear();
  });

  it('should set item', () => {
    SQLiteStorage.setItem('key', 'value');
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR REPLACE'),
      ['key', 'value']
    );
  });

  it('should get item', () => {
    mockDb.getFirstSync.mockReturnValue({ value: 'stored-value' });
    const result = SQLiteStorage.getItem('key');
    expect(result).toBe('stored-value');
    expect(mockDb.getFirstSync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT value'),
      ['key']
    );
  });

  it('should return null if item not found', () => {
    mockDb.getFirstSync.mockReturnValue(null);
    const result = SQLiteStorage.getItem('non-existent');
    expect(result).toBeNull();
  });

  it('should remove item', () => {
    SQLiteStorage.removeItem('key');
    expect(mockDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE'),
      ['key']
    );
  });
});
