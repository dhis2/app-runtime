import { LRUCache } from "./LRUCache";

describe("LRUCache", () => {
  describe("constructor", () => {
    it("creates an instance with positive capacity", () => {
      const cache = new LRUCache<string, number>(3);
      expect(cache).toBeInstanceOf(LRUCache);
      expect(cache.size).toBe(0);
    });

    it("throws if capacity is 0 or negative", () => {
      expect(() => new LRUCache<string, number>(0)).toThrow(
        "Capacity must be greater than 0"
      );
      expect(() => new LRUCache<string, number>(-1)).toThrow(
        "Capacity must be greater than 0"
      );
    });
  });

  describe("set and get basics", () => {
    it("stores and retrieves values", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);
      cache.set("b", 2);

      expect(cache.get("a")).toBe(1);
      expect(cache.get("b")).toBe(2);
    });

    it("returns undefined for missing keys", () => {
      const cache = new LRUCache<string, number>(2);
      expect(cache.get("missing")).toBeUndefined();
    });
  });

  describe("recency and ordering", () => {
    it("moves key to most recently used on get", () => {
      const cache = new LRUCache<string, number>(3);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // Initial order: a (LRU), b, c (MRU)
      expect(cache.keys()).toEqual(["a", "b", "c"]);

      // Access "a", now a should be MRU
      expect(cache.get("a")).toBe(1);
      expect(cache.keys()).toEqual(["b", "c", "a"]);

      // Access "c", now c should be MRU
      cache.get("c");
      expect(cache.keys()).toEqual(["b", "a", "c"]);
    });

    it("updates recency on set for existing key", () => {
      const cache = new LRUCache<string, number>(3);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      // Initial: a, b, c
      expect(cache.keys()).toEqual(["a", "b", "c"]);

      // Set "b" again with new value
      cache.set("b", 20);

      // "b" should become MRU, but keys stay same set
      expect(cache.keys()).toEqual(["a", "c", "b"]);
      expect(cache.get("b")).toBe(20);
    });
  });

  describe("eviction behavior", () => {
    it("evicts least recently used when capacity exceeded", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);
      cache.set("b", 2);
      // At this point: a (LRU), b (MRU)

      cache.set("c", 3); // should evict "a"

      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.get("c")).toBe(3);
      expect(cache.keys()).toEqual(["b", "c"]);
    });

    it("evicts after recency changes caused by get", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);
      cache.set("b", 2);
      // Order: a (LRU), b (MRU)

      // Access "a" -> now b (LRU), a (MRU)
      cache.get("a");

      cache.set("c", 3); // should evict "b"

      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("a")).toBe(1);
      expect(cache.get("c")).toBe(3);
      expect(cache.keys()).toEqual(["a", "c"]);
    });

    it("evicts after recency changes caused by set(existing key)", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);
      cache.set("b", 2);
      // Order: a (LRU), b (MRU)

      cache.set("a", 10); // a becomes MRU, order: b (LRU), a (MRU)
      expect(cache.keys()).toEqual(["b", "a"]);

      cache.set("c", 3); // should evict "b"
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("a")).toBe(10);
      expect(cache.get("c")).toBe(3);
      expect(cache.keys()).toEqual(["a", "c"]);
    });

    it("works when capacity is 1 (always evicts previous)", () => {
      const cache = new LRUCache<string, number>(1);

      cache.set("a", 1);
      expect(cache.keys()).toEqual(["a"]);

      cache.set("b", 2); // evicts "a"
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBe(2);
      expect(cache.keys()).toEqual(["b"]);

      cache.set("b", 3); // update existing, no eviction
      expect(cache.get("b")).toBe(3);
      expect(cache.keys()).toEqual(["b"]);
    });
  });

  describe("has", () => {
    it("returns true if key exists, false otherwise", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);

      expect(cache.has("a")).toBe(true);
      expect(cache.has("b")).toBe(false);
    });

    it("does not change recency when checking has()", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);
      cache.set("b", 2);
      // Order: a (LRU), b (MRU)

      expect(cache.has("a")).toBe(true);
      // Order should remain unchanged
      expect(cache.keys()).toEqual(["a", "b"]);
    });
  });

  describe("delete", () => {
    it("removes a key and returns true if it existed", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);
      cache.set("b", 2);

      const result = cache.delete("a");
      expect(result).toBe(true);
      expect(cache.has("a")).toBe(false);
      expect(cache.size).toBe(1);
      expect(cache.keys()).toEqual(["b"]);
    });

    it("returns false when deleting a non-existent key", () => {
      const cache = new LRUCache<string, number>(2);
      cache.set("a", 1);

      const result = cache.delete("b");
      expect(result).toBe(false);
      expect(cache.size).toBe(1);
      expect(cache.keys()).toEqual(["a"]);
    });
  });

  describe("clear", () => {
    it("removes all entries", () => {
      const cache = new LRUCache<string, number>(3);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.size).toBe(3);
      cache.clear();
      expect(cache.size).toBe(0);
      expect(cache.keys()).toEqual([]);
      expect(cache.get("a")).toBeUndefined();
      expect(cache.get("b")).toBeUndefined();
      expect(cache.get("c")).toBeUndefined();
    });
  });

  describe("size", () => {
    it("reflects the current number of elements", () => {
      const cache = new LRUCache<string, number>(2);
      expect(cache.size).toBe(0);

      cache.set("a", 1);
      expect(cache.size).toBe(1);

      cache.set("b", 2);
      expect(cache.size).toBe(2);

      // exceeds capacity -> eviction, but size stays at capacity
      cache.set("c", 3);
      expect(cache.size).toBe(2);

      cache.delete("c");
      expect(cache.size).toBe(1);
    });
  });

  describe("keys()", () => {
    it("returns keys from least to most recently used", () => {
      const cache = new LRUCache<string, number>(3);
      cache.set("a", 1);
      cache.set("b", 2);
      cache.set("c", 3);

      expect(cache.keys()).toEqual(["a", "b", "c"]);

      cache.get("a"); // recency: b, c, a
      expect(cache.keys()).toEqual(["b", "c", "a"]);

      cache.set("b", 20); // recency: c, a, b
      expect(cache.keys()).toEqual(["c", "a", "b"]);
    });
  });

  describe("non-primitive keys and generic types", () => {
    it("handles object keys correctly", () => {
      type Key = { id: number };
      const k1: Key = { id: 1 };
      const k2: Key = { id: 2 };
      const k3: Key = { id: 3 };

      const cache = new LRUCache<Key, string>(2);
      cache.set(k1, "one");
      cache.set(k2, "two");

      expect(cache.get(k1)).toBe("one");
      expect(cache.get(k2)).toBe("two");

      // Using a different object with same shape should not match
      expect(cache.get({ id: 1 })).toBeUndefined();

      // Trigger eviction
      cache.set(k3, "three");
      // k1 is LRU at this point? Let's check:
      // insertion: k1, k2; order: k1 (LRU), k2 (MRU)
      // haven't touched recency, so k1 should be evicted
      expect(cache.get(k1)).toBeUndefined();
      expect(cache.get(k2)).toBe("two");
      expect(cache.get(k3)).toBe("three");
    });

    it("supports complex value types", () => {
      interface User {
        id: number;
        name: string;
      }

      const cache = new LRUCache<string, User>(2);
      cache.set("u1", { id: 1, name: "Alice" });
      cache.set("u2", { id: 2, name: "Bob" });

      expect(cache.get("u1")).toEqual({ id: 1, name: "Alice" });
      expect(cache.get("u2")).toEqual({ id: 2, name: "Bob" });
    });
  });
});