// Kept dependency-free so it can be unit tested with `node --test`.

/**
 * Reconciles a cart restored from localStorage with the live menu:
 * replaces each stored item with its current Firestore data (so prices
 * are fresh) and drops entries that were removed, made unavailable,
 * or are malformed. Returns the original array when nothing changed.
 */
export function syncCartWithMenu(cart, menuItems) {
  if (!Array.isArray(cart)) return [];

  const menuById = new Map((menuItems || []).map((item) => [item.id, item]));
  let changed = false;

  const next = cart.reduce((result, entry) => {
    const current = entry?.item ? menuById.get(entry.item.id) : undefined;
    const quantity = entry?.quantity;
    const valid =
      current &&
      current.available !== false &&
      Number.isInteger(quantity) &&
      quantity > 0;

    if (!valid) {
      changed = true;
      return result;
    }

    if (current !== entry.item) changed = true;
    result.push(current === entry.item ? entry : { item: current, quantity });
    return result;
  }, []);

  return changed ? next : cart;
}
