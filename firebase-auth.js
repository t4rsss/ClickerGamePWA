// firebase-auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbd9rQZ1LwwTrMWY30txNugYsF_KVooGo",
  authDomain: "prj-crypto-clicker.firebaseapp.com",
  databaseURL: "https://prj-crypto-clicker-default-rtdb.firebaseio.com/",
  projectId: "prj-crypto-clicker",
  storageBucket: "prj-crypto-clicker.appspot.com",
  messagingSenderId: "1031485029809",
  appId: "1:1031485029809:web:16eb4e1f22f17a524f1190",
  measurementId: "G-5YM5FDLJF7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("email")?.value.trim();
      const senha = document.getElementById("password")?.value.trim();

      if (!email || !senha) {
        alert("Preencha o e-mail e a senha!");
        return;
      }

      signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
          window.location.href = "menu.html";
        })
        .catch((error) => {
          alert("Erro ao logar: " + error.message);
        });
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const email = document.getElementById("register-email")?.value.trim();
      const senha = document.getElementById("register-password")?.value.trim();

      if (!email || !senha) {
        alert("Preencha o e-mail e a senha!");
        return;
      }

      createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
          // Espera o Firebase autenticar totalmente o usuário antes de salvar
          onAuthStateChanged(auth, (user) => {
            if (user) {
              const uid = user.uid;

              const jogadorInicial = {
                nome: email,
                pontuacao: 0,
                btcPorClique: 1,
                btcPorSegundo: 0,
                upgrades: {},
                listaDeCompras: {},
                fase: {
                  nivel: 1,
                  nome: "Porão"
                }
              };

              const usuarioRef = ref(db, 'usuarios/' + uid);
              const jogadorRef = ref(db, 'jogadores/' + uid);

              Promise.all([
                set(usuarioRef, { email: email }),
                set(jogadorRef, jogadorInicial)
              ])
              .then(() => {
                alert("Conta criada com sucesso!");
                window.location.href = "menu.html";
              })
              .catch((error) => {
                alert("Erro ao salvar dados no banco: " + error.message);
                console.error(error);
              });

            } else {
              alert("Erro: usuário não autenticado após registro.");
            }
          });
        })
        .catch((error) => {
          alert("Erro ao registrar: " + error.message);
        });
    });
  }
});

// Alternar entre login e registro
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');

document.getElementById('show-register').onclick = () => {
  loginContainer.style.display = 'none';
  registerContainer.style.display = 'block';
};

document.getElementById('show-login').onclick = () => {
  registerContainer.style.display = 'none';
  loginContainer.style.display = 'block';
};
