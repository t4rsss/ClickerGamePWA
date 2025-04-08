import ModelError from "/ModelError.js";

export default class Player {
    #uid;
    #nome;
    #score;
    #nivel;

    constructor(uid, nome, score = 0, nivel = 1) {
        this.setUid(uid);
        this.setNome(nome);
        this.setScore(score);
        this.setNivel(nivel);
    }

    getUid() {
        return this.#uid;
    }

    setUid(uid) {
        if (typeof uid !== "string" || uid.trim().length === 0) {
            throw new ModelError("UID inválido");
        }
        this.#uid = uid;
    }

    getNome() {
        return this.#nome;
    }

    setNome(nome) {
        if (!Player.validarNome(nome)) {
            throw new ModelError("Nome inválido: " + nome);
        }
        this.#nome = nome;
    }

    getScore() {
        return this.#score;
    }

    setScore(score) {
        if (!Number.isInteger(score) || score < 0) {
            throw new ModelError("Score inválido: " + score);
        }
        this.#score = score;
    }

    getNivel() {
        return this.#nivel;
    }

    setNivel(nivel) {
        if (!Number.isInteger(nivel) || nivel < 1) {
            throw new ModelError("Nível inválido: " + nivel);
        }
        this.#nivel = nivel;
    }

    static validarNome(nome) {
        return typeof nome === "string" && nome.trim().length > 0 && nome.length <= 20;
    }

    toString() {
        return `Player: ${this.#nome} | Score: ${this.#score} | Nível: ${this.#nivel} | UID: ${this.#uid}`;
    }
}

import { auth } from "./firebaseConfig.js";

auth.onAuthStateChanged(user => {
    if (user) {
        const jogador = new Player(user.uid, "HackerX", 500, 3);
        console.log(jogador.toString());
    }
});
