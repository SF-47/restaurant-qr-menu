import test from "node:test";
import assert from "node:assert/strict";
import { findItemProblems, needsFixing, validateItemDraft } from "./adminValidation.js";

const valid = {
  name: { en: "Chicken Sub", ar: "تشيكن ساب" },
  category: { en: "Offers", ar: "عروض" },
  price: 450000,
};

test("a complete bilingual draft has no errors or warnings", () => {
  assert.deepEqual(validateItemDraft(valid), { errors: {}, warnings: {} });
});

test("requires both names and an English category", () => {
  const { errors } = validateItemDraft({
    name: { en: "  ", ar: "" },
    category: { en: "", ar: "" },
    price: 1000,
  });

  assert.deepEqual(Object.keys(errors).sort(), ["category", "nameAr", "nameEn"]);
});

test("rejects Arabic text typed into the English name field", () => {
  const { errors } = validateItemDraft({ ...valid, name: { en: "تشيكن ساب", ar: "تشيكن ساب" } });

  assert.equal(errors.nameEn, "nameEnHasArabic");
});

test("rejects an Arabic name with no Arabic letters", () => {
  const { errors } = validateItemDraft({ ...valid, name: { en: "Chicken Sub", ar: "Chicken Sub" } });

  assert.equal(errors.nameAr, "nameArNotArabic");
});

test("allows digits and symbols in the Arabic name if it has Arabic letters", () => {
  const { errors } = validateItemDraft({ ...valid, name: { en: "2 Burgers + Pepsi", ar: "برغر عدد 2 + بيبسي" } });

  assert.deepEqual(errors, {});
});

test("requires a positive price", () => {
  assert.equal(validateItemDraft({ ...valid, price: "" }).errors.price, "priceRequired");
  assert.equal(validateItemDraft({ ...valid, price: 0 }).errors.price, "priceRequired");
});

test("warns (but does not block) when the price looks entered in thousands", () => {
  const result = validateItemDraft({ ...valid, price: 350 });

  assert.deepEqual(result.errors, {});
  assert.equal(result.warnings.price, "priceLooksLow");
});

test("findItemProblems flags stored items the same way, for the list view", () => {
  const item = { name: { en: "وجبة كريسبي", ar: "" }, category: { en: "Offers" }, price: 500000 };

  assert.deepEqual(findItemProblems(item).sort(), ["nameAr", "nameEn"]);
  assert.deepEqual(findItemProblems({ ...valid }), []);
});

test("needsFixing ignores hidden items, since customers never see them", () => {
  const lowPrice = { ...valid, price: 100 };

  assert.equal(needsFixing({ ...lowPrice, available: false }), false);
  assert.equal(needsFixing({ ...lowPrice, available: true }), true);
  assert.equal(needsFixing({ ...lowPrice }), true); // missing flag means visible
  assert.equal(needsFixing({ ...valid, available: true }), false);
});
