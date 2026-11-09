import test from "node:test";
import assert from "node:assert/strict";
import { createMemoryMenuRepository } from "./memoryMenuRepository.js";

const seed = [
  { id: "a", name: { en: "Fries", ar: "بطاطا" }, price: 150000, available: true },
  { id: "b", name: { en: "Cola", ar: "كولا" }, price: 80000, available: true },
];

test("list returns copies of the seed, not the seed objects", async () => {
  const repo = createMemoryMenuRepository(seed);
  const items = await repo.list();

  assert.deepEqual(items, seed);
  items[0].price = 1;
  assert.equal((await repo.list())[0].price, 150000);
  assert.equal(seed[0].price, 150000);
});

test("add creates an item with a new id", async () => {
  const repo = createMemoryMenuRepository(seed);
  const id = await repo.add({ name: { en: "Tea", ar: "شاي" }, price: 50000 });

  const items = await repo.list();
  assert.equal(items.length, 3);
  assert.equal(items.find((item) => item.id === id).name.en, "Tea");
  assert.ok(!seed.some((item) => item.id === id));
});

test("update merges fields into one item", async () => {
  const repo = createMemoryMenuRepository(seed);
  await repo.update("a", { available: false });

  const [a, b] = await repo.list();
  assert.equal(a.available, false);
  assert.equal(a.price, 150000);
  assert.equal(b.available, true);
});

test("updateMany updates several items at once", async () => {
  const repo = createMemoryMenuRepository(seed);
  await repo.updateMany(["a", "b"], { category: { en: "Sides", ar: "" } });

  assert.ok((await repo.list()).every((item) => item.category.en === "Sides"));
});

test("remove deletes one item", async () => {
  const repo = createMemoryMenuRepository(seed);
  await repo.remove("a");

  assert.deepEqual((await repo.list()).map((item) => item.id), ["b"]);
});

test("update and remove reject unknown ids, like Firestore", async () => {
  const repo = createMemoryMenuRepository(seed);

  await assert.rejects(repo.update("nope", { price: 1 }));
  await assert.rejects(repo.remove("nope"));
});
