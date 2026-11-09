// In-memory menu store for the public admin demo.
// Must never import Firebase: demo changes live only in this browser tab.

const clone = (value) => structuredClone(value);
const pause = () => new Promise((resolve) => setTimeout(resolve, 150)); // feel like a network call

export function createMemoryMenuRepository(seed = []) {
  let items = clone(seed);
  let nextId = 1;

  function indexOf(id) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`No menu item with id "${id}"`);
    return index;
  }

  return {
    async list() {
      await pause();
      return clone(items);
    },

    async add(data) {
      await pause();
      const id = `demo-${nextId++}`;
      items = [...items, { ...clone(data), id }];
      return id;
    },

    async update(id, data) {
      await pause();
      const index = indexOf(id);
      items = items.map((item, i) => (i === index ? { ...item, ...clone(data) } : item));
    },

    async updateMany(ids, data) {
      await pause();
      ids.forEach(indexOf);
      const targets = new Set(ids);
      items = items.map((item) => (targets.has(item.id) ? { ...item, ...clone(data) } : item));
    },

    async remove(id) {
      await pause();
      const index = indexOf(id);
      items = items.filter((_, i) => i !== index);
    },
  };
}
