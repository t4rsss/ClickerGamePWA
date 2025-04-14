// firebase-auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbd9rQZ1LwwTrMWY30txNugYsF_KVooGo",
  authDomain: "prj-crypto-clicker.firebaseapp.com",
  projectId: "prj-crypto-clicker",
  storageBucket: "prj-crypto-clicker.appspot.com",
  messagingSenderId: "1031485029809",
  appId: "1:1031485029809:web:16eb4e1f22f17a524f1190",
  measurementId: "G-5YM5FDLJF7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const senha = document.getElementById("password").value;

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
      const email = document.getElementById("email").value;
      const senha = document.getElementById("password").value;

      createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
          alert("Conta criada com sucesso!");
          window.location.href = "menu.html";
        })
        .catch((error) => {
          alert("Erro ao registrar: " + error.message);
        });
    });
  }
});


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