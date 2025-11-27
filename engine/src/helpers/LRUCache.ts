export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error("Capacity must be greater than 0");
    }

    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }

  /**
   * Get a value by key.
   * Moves the key to the "most recently used" position if found.
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Refresh the key by re-inserting it
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  /**
   * Insert or update a value by key.
   * If capacity is exceeded, evicts the least recently used item.
   */
  set(key: K, value: V): void {
    // If key exists, we delete it so that insertion order is updated
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // If over capacity, remove least recently used (first item in Map)
    if (this.cache.size > this.capacity) {
      const lruKey = this.cache.keys().next().value; // first inserted
      if (lruKey !== undefined) {
        this.cache.delete(lruKey);
      }
    }
  }

  /**
   * Check if the cache contains a key (without updating its recency).
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete a specific key from the cache.
   */
  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Current number of elements in cache.
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Returns keys from least -> most recently used.
   */
  keys(): K[] {
    return Array.from(this.cache.keys());
  }
}