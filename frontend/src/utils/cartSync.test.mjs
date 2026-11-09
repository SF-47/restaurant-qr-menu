import test from "node:test";
import assert from "node:assert/strict";
import { syncCartWithMenu } from "./cartSync.js";

const burger = { id: "b1", name: { en: "Burger" }, price: 400000, available: true };
const fries = { id: "f1", name: { en: "Fries" }, price: 150000 };

test("refreshes stored items with current menu data (new price)", () => {
  const stored = [{ item: { ...burger, price: 300000 }, quantity: 2 }];
  const result = syncCartWithMenu(stored, [burger, fries]);

  assert.deepEqual(result, [{ item: burger, quantity: 2 }]);
});

test("drops items that no longer exist in the menu", () => {
  const stored = [
    { item: burger, quantity: 1 },
    { item: { id: "gone", price: 1 }, quantity: 3 },
  ];

  assert.deepEqual(syncCartWithMenu(stored, [burger]), [{ item: burger, quantity: 1 }]);
});

test("drops items marked unavailable", () => {
  const stored = [{ item: burger, quantity: 1 }];
  const menu = [{ ...burger, available: false }];

  assert.deepEqual(syncCartWithMenu(stored, menu), []);
});

test("drops malformed entries and non-positive quantities", () => {
  const stored = [
    null,
    { item: null, quantity: 1 },
    { item: fries, quantity: 0 },
    { item: fries, quantity: "2" },
    { item: burger, quantity: 1 },
  ];

  assert.deepEqual(syncCartWithMenu(stored, [burger, fries]), [{ item: burger, quantity: 1 }]);
});

test("returns the same array reference when nothing changed", () => {
  const stored = [{ item: burger, quantity: 1 }];

  assert.equal(syncCartWithMenu(stored, [burger]), stored);
});
