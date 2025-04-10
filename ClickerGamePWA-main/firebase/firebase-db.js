// firebase/firebase-db.js

import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import firebaseApp from "./firebase-config.js";

const db = getDatabase(firebaseApp);

// Função para salvar dados do jogador no banco
export function savePlayerData(userId, playerData) {
    return set(ref(db, 'players/' + userId), playerData);
}

// Função para buscar dados do jogador
export function getPlayerData(userId) {
    return get(ref(db, 'players/' + userId));
}

// Função para atualizar os dados do jogador
export function updatePlayerData(userId, newData) {
    return update(ref(db, 'players/' + userId), newData);
}

// Função para deletar um jogador
export function deletePlayer(userId) {
    return remove(ref(db, 'players/' + userId));
}
