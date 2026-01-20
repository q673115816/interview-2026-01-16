import { SQLiteStorage } from '../storage';
import { db } from '../../db/client';

// Mock dependencies
jest.mock('../../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../db/schema', () => ({
  authKv: {
    key: { name: 'key' },
    value: { name: 'value' },
  },
}));

jest.mock('../../../drizzle/migrations', () => ({
  journal: {},
  migrations: {},
}));

jest.mock('drizzle-orm/expo-sqlite/migrator', () => ({
  migrate: jest.fn(),
}));

describe('SQLiteStorage', () => {
  const mockGet = jest.fn();
  const mockRun = jest.fn();
  const mockFrom = jest.fn();
  const mockWhere = jest.fn();
  const mockValues = jest.fn();
  const mockOnConflictDoUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup chain mocks
    const mockQueryBuilder = {
      from: mockFrom,
      where: mockWhere,
      get: mockGet,
      values: mockValues,
      onConflictDoUpdate: mockOnConflictDoUpdate,
      run: mockRun,
    };

    mockFrom.mockReturnValue(mockQueryBuilder);
    mockWhere.mockReturnValue(mockQueryBuilder);
    mockValues.mockReturnValue(mockQueryBuilder);
    mockOnConflictDoUpdate.mockReturnValue(mockQueryBuilder);

    (db.select as jest.Mock).mockReturnValue(mockQueryBuilder);
    (db.insert as jest.Mock).mockReturnValue(mockQueryBuilder);
    (db.delete as jest.Mock).mockReturnValue(mockQueryBuilder);
  });

  it('should set item', () => {
    SQLiteStorage.setItem('key', 'value');
    expect(db.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalledWith({ key: 'key', value: 'value' });
    expect(mockRun).toHaveBeenCalled();
  });

  it('should get item', () => {
    mockGet.mockReturnValue({ value: 'stored-value' });
    const result = SQLiteStorage.getItem('key');
    expect(result).toBe('stored-value');
    expect(db.select).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalled();
  });

  it('should return null if item not found', () => {
    mockGet.mockReturnValue(undefined);
    const result = SQLiteStorage.getItem('non-existent');
    expect(result).toBeNull();
  });

  it('should remove item', () => {
    SQLiteStorage.removeItem('key');
    expect(db.delete).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });
});
