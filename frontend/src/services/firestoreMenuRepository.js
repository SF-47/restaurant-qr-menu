import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "menuItems";
const BATCH_LIMIT = 450; // Firestore allows 500 writes per batch.

// Same interface as memoryMenuRepository, backed by the live database.
export const firestoreMenuRepository = {
  async list() {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async add(data) {
    const ref = await addDoc(collection(db, COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  },

  async update(id, data) {
    await updateDoc(doc(db, COLLECTION, String(id)), { ...data, updatedAt: serverTimestamp() });
  },

  // Atomic per batch, so a category rename can't half-apply.
  async updateMany(ids, data) {
    for (let i = 0; i < ids.length; i += BATCH_LIMIT) {
      const batch = writeBatch(db);
      ids.slice(i, i + BATCH_LIMIT).forEach((id) => {
        batch.update(doc(db, COLLECTION, String(id)), { ...data, updatedAt: serverTimestamp() });
      });
      await batch.commit();
    }
  },

  async remove(id) {
    await deleteDoc(doc(db, COLLECTION, String(id)));
  },
};
