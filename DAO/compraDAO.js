import {
  getDatabase,
  ref,
  set,
  push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

export async function registrarCompra(nomeUpgrade, valor) {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const compraRef = push(ref(db, `compras/${uid}`));

  await set(compraRef, {
    nomeUpgrade,
    valor,
    dataCompra: new Date().toISOString()
  });
}
