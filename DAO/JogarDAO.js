// pontosController.js
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const db = getDatabase();
const auth = getAuth();

export function ganharPorClique(estado, atualizar, salvar) {
  estado.btc += estado.btcPorClique;
  atualizar();
  salvar();
}

export function ganharPorSegundo(estado, atualizar, salvar) {
  estado.btc += estado.btcPorSegundo;
  atualizar();
  salvar();
}
