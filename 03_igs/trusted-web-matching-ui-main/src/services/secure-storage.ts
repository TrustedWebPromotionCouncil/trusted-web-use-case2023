import SecureLS from 'secure-ls';

const secureLs = new SecureLS();

// Custom storage by secure-ls
class SecureStorage<T> {
  getItem(key: string): T | null {
    const data = secureLs.get(key);
    // Delete data when it expires
    if (data !== null && data.ttl !== undefined && data.ttl < Date.now()) {
      secureLs.remove(key);
      return null;
    }
    return data !== null ? data : null;
  }

  setItem(key: string, value: T, ttl?: number): void {
    // Save data by specifying ttl
    if (ttl !== undefined && ttl > 0) {
      const expiration = Date.now() + ttl;
      secureLs.set(key, { value, ttl: expiration });
    } else {
      secureLs.set(key, value);
    }
  }

  removeItem(key: string): void {
    secureLs.remove(key);
  }
}

export const secureStorage = new SecureStorage<any>();
