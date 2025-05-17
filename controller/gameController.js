// Firebase imports
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  get,
  set,
  push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbd9rQZ1LwwTrMWY30txNugYsF_KVooGo",
  authDomain: "prj-crypto-clicker.firebaseapp.com",
  databaseURL: "https://prj-crypto-clicker-default-rtdb.firebaseio.com",
  projectId: "prj-crypto-clicker",
  storageBucket: "prj-crypto-clicker.appspot.com",
  messagingSenderId: "1031485029809",
  appId: "1:1031485029809:web:16eb4e1f22f17a524f1190",
  measurementId: "G-5YM5FDLJF7"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Variáveis principais
let btc = 0;
let btcPorClique = 1;
let btcPorSegundo = 0;
let faseAtual = 1;

let upgrades = {
  clique: [],
  producao: [],
  ambiente: []
};

// Sons
const btnSound = new Audio('../assets/sounds/btnsound.mp3');
const tecladoSound = new Audio('../assets/sounds/tecladosound.mp3');
const buysound = new Audio('../assets/sounds/buysound.mp3');
btnSound.load(); tecladoSound.load(); buysound.load();

// Desbloqueio para mobile
document.addEventListener('touchstart', () => {
  btnSound.play().catch(() => {});
  tecladoSound.play().catch(() => {});
  buysound.play().catch(() => {});
  btnSound.pause(); tecladoSound.pause(); buysound.pause();
  btnSound.currentTime = 0;
  tecladoSound.currentTime = 0;
  buysound.currentTime = 0;
}, { once: true });

// Funções utilitárias
function abreviarPreco(preco) {
  if (preco >= 1000000) return (preco / 1000000).toFixed(1) + 'M';
  if (preco >= 1000) return (preco / 1000).toFixed(1) + 'k';
  return preco.toString();
}

function nomeDaFasePorNivel(nivel) {
  switch (nivel) {
    case 1: return "Porão";
    case 2: return "Apartamento";
    case 3: return "Empresa";
    default: return "Desconhecida";
  }
}

function atualizarDisplay() {
  document.getElementById("btc").textContent = abreviarPreco(btc) + " BTC";
  document.getElementById("btc-clique").textContent = `P/click: ${abreviarPreco(btcPorClique)}`;
  document.getElementById("btc-segundo").textContent = `P/seg: ${abreviarPreco(btcPorSegundo)}`;
}

function salvarProgresso() {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;

  update(ref(db, `jogadores/${uid}`), {
    pontuacao: btc,
    btcPorClique,
    btcPorSegundo
  });

  update(ref(db, `jogadores/${uid}/fase`), {
    nivel: faseAtual,
    nome: nomeDaFasePorNivel(faseAtual)
  });

  for (let categoria in upgrades) {
    upgrades[categoria].forEach(upg => {
      update(ref(db, `jogadores/${uid}/upgrades/${upg.nome}`), {
        nivelUpgrade: upg.nivel
      });
    });
  }
}

async function carregarProgressoFirebase() {
  const user = auth.currentUser;
  if (!user) return null;
  const uid = user.uid;
  const snapshot = await get(ref(db, `jogadores/${uid}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    btc = data.pontuacao || 0;
    btcPorClique = data.btcPorClique || 1;
    btcPorSegundo = data.btcPorSegundo || 0;
  }

  const faseSnap = await get(ref(db, `jogadores/${uid}/fase`));
  if (faseSnap.exists()) {
    const fase = faseSnap.val();
    faseAtual = fase.nivel || 1;
  }
}

async function carregarUpgradesFirebase() {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;
  const snapshot = await get(ref(db, `jogadores/${uid}/upgrades`));
  if (!snapshot.exists()) return;
  const upgradesDoBanco = snapshot.val();
  for (let categoria in upgrades) {
    upgrades[categoria].forEach(upg => {
      const salvo = upgradesDoBanco[upg.nome];
      if (salvo && salvo.nivelUpgrade) {
        const nivel = salvo.nivelUpgrade;
        upg.nivel = nivel;
        for (let i = 1; i < nivel; i++) upg.efeito();
        upg.preco = Math.floor(upg.preco * Math.pow(1.5, nivel - 1));
      }
    });
  }
}

async function resetarFirebaseDoJogador() {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;
  await set(ref(db, `jogadores/${uid}`), {
    nome: user.email,
    pontuacao: 0,
    nivel: 1,
    faseAtual: 1,
    btcPorClique: 1,
    btcPorSegundo: 0,
    listaDeCompras: {}
  });
  await set(ref(db, `compras/${uid}`), null);
  await set(ref(db, `jogadores/${uid}/upgrades`), null);
  await set(ref(db, `jogadores/${uid}/fase`), {
    nivel: 1,
    nome: "Porão"
  });
}

function inicializarUpgrades() {
  upgrades = {
    clique: [
      { nome: "Melhorar processador", preco: 10, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += this.nivel; } },
      { nome: "Melhorar CPU", preco: 50, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 5 * this.nivel; } },
      { nome: "Melhorar memória RAM", preco: 200, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 20 * this.nivel; } },
      { nome: "Melhorar placa mãe", preco: 300, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 30 * this.nivel; } },
      { nome: "Melhorar conexão", preco: 500, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 50 * this.nivel; } }
    ],
    producao: [
      { nome: "Melhorar Mineração", preco: 100, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorSegundo += 2 * this.nivel; } }
    ],
    ambiente: [
     {
        nome: "Melhorar Casa",
        preco: 400000,
        comprado: false,
        nivel: 1,
        repetivel: true,
        efeito: function () {
            if (faseAtual < 3) {
            faseAtual++;
            this.nivel++;
            this.preco = Math.floor(this.preco * 1.5);
            }
            const computerImage = document.querySelector('.computer');
            if (computerImage) {
            if (faseAtual === 2) computerImage.src = "../assets/apartamento.gif";
            else if (faseAtual === 3) computerImage.src = "../assets/empresa.gif";
            else computerImage.src = "../assets/Porao.gif";
            }
        }
        }
    ]
  };
}

function atualizarLoja() {
  const upgradeList = document.getElementById("upgrade-list");
  upgradeList.innerHTML = "";
  for (let categoria in upgrades) {
    const titulo = document.createElement("h4");
    titulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    upgradeList.appendChild(titulo);

    upgrades[categoria].forEach((upgrade, index) => {
      if (!upgrade.comprado || upgrade.repetivel) {
        const item = document.createElement("li");
        const podeComprar = btc >= upgrade.preco;
        item.innerHTML = `
          <button class="upgrade-btn ${!podeComprar ? 'locked' : ''}" data-categoria="${categoria}" data-index="${index}">
            ${upgrade.nome}<br>
            ${abreviarPreco(upgrade.preco)} BTC<br>
            ${upgrade.nivel ? '(Nível ' + upgrade.nivel + ')' : ''}
          </button>
        `;
        upgradeList.appendChild(item);
      }
    });
  }

  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const categoria = btn.dataset.categoria;
      const index = parseInt(btn.dataset.index);
      const upgrade = upgrades[categoria][index];

      if (btc >= upgrade.preco) {
        btc -= upgrade.preco;
        upgrade.efeito();

        if (upgrade.repetivel) {
          upgrade.nivel++;
          upgrade.efeito();
          upgrade.preco = Math.floor(upgrade.preco * 1.5);
        } else {
          upgrade.comprado = true;
        }

        atualizarLoja();
        atualizarDisplay();
        salvarProgresso();

        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          const compraRef = push(ref(db, `compras/${uid}`));
          await set(compraRef, {
            nomeUpgrade: upgrade.nome,
            valor: upgrade.preco,
            dataCompra: new Date().toISOString()
          });
        }

        buysound.currentTime = 0;
        buysound.play();
      }
    });
  });
}

function inicializarJogo() {
  atualizarDisplay();
  atualizarLoja();

  const openUpgradeBtn = document.getElementById("open-upgrade-menu");
  const hackearBtn = document.getElementById("hackear");

  openUpgradeBtn.addEventListener("click", () => {
    document.getElementById("upgrade-menu").classList.remove("hidden");
    hackearBtn.style.display = "none";
    openUpgradeBtn.style.display = "none";
  });

  document.getElementById("close-upgrade-btn").addEventListener("click", () => {
    document.getElementById("upgrade-menu").classList.add("hidden");
    hackearBtn.style.display = "block";
    openUpgradeBtn.style.display = "block";
  });

  hackearBtn.addEventListener("click", () => {
    btc += btcPorClique;
    atualizarDisplay();
    salvarProgresso();
  });

  setInterval(() => {
    btc += btcPorSegundo;
    atualizarDisplay();
    salvarProgresso();
  }, 1000);

  // Aplica imagem de fundo correta com base na fase
  const computerImage = document.querySelector('.computer');
  if (computerImage) {
    if (faseAtual === 2) computerImage.src = "../assets/apartamento.gif";
    else if (faseAtual === 3) computerImage.src = "../assets/empresa.gif";
    else computerImage.src = "../assets/Porao.gif";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("novo-jogo-btn").addEventListener("click", async () => {
    await resetarFirebaseDoJogador();
    btc = 0;
    btcPorClique = 1;
    btcPorSegundo = 0;
    faseAtual = 1;
    document.querySelector(".menu-container").style.display = "none";
    document.querySelector(".game-container").classList.remove("hidden");
    inicializarUpgrades();
    inicializarJogo();
  });

  document.getElementById("continuar-jogo-btn").addEventListener("click", async () => {
    inicializarUpgrades();
    await carregarUpgradesFirebase();
    await carregarProgressoFirebase();
    document.querySelector(".menu-container").style.display = "none";
    document.querySelector(".game-container").classList.remove("hidden");
    inicializarJogo();
  });

  document.querySelector(".menu-container").style.display = "block";
  document.querySelector(".game-container").classList.add("hidden");
});
