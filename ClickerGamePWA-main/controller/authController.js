// authController.js

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { app } from "../firebase/firebase-config.js";

const auth = getAuth(app);

// Função para registrar um novo usuário
export function registerUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Usuário registrado:", userCredential.user);
            return userCredential.user;
        })
        .catch((error) => {
            console.error("Erro ao registrar:", error.message);
            throw error;
        });
}

// Função para login
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Usuário logado:", userCredential.user);
            return userCredential.user;
        })
        .catch((error) => {
            console.error("Erro ao fazer login:", error.message);
            throw error;
        });
}

// Função para logout
export function logoutUser() {
    return signOut(auth)
        .then(() => {
            console.log("Usuário deslogado");
        })
        .catch((error) => {
            console.error("Erro ao deslogar:", error.message);
            throw error;
        });
}
