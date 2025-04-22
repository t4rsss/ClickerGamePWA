document.addEventListener("DOMContentLoaded", () => {
    const menuDiv = document.querySelector(".menu-container");
    const gameDiv = document.querySelector(".game-container");
    const novoJogoBtn = document.getElementById("novo-jogo-btn");
    const continuarJogoBtn = document.getElementById("continuar-jogo-btn");
    const upgradeMenu = document.getElementById("upgrade-menu");
    const openUpgradeBtn = document.getElementById("open-upgrade-menu");
    const closeUpgradeBtn = document.getElementById("close-upgrade-btn");
    const upgradeList = document.getElementById("upgrade-list");
    const btcDisplay = document.getElementById("btc");
    const hackearBtn = document.getElementById("hackear");
    const lojaBtn = document.getElementById("loja-btn");

    let btc = 0;
    let btcPorClique = 1;
    let btcPorSegundo = 0;

    let upgrades = { 
        clique: [],
        producao: [],
        ambiente: []
    };

    function mostrarJogo() {
        menuDiv.style.display = "none";
        gameDiv.classList.remove("hidden");
        document.body.style.backgroundImage = "url('../assets/fundo.gif')";
    }

    function mostrarMenu() {
        menuDiv.style.display = "block";
        gameDiv.classList.add("hidden");
    }

    function salvarProgresso() {
        const progresso = {
            btc,
            btcPorClique,
            btcPorSegundo,
            upgrades
        };
        localStorage.setItem("progresso", JSON.stringify(progresso));
    }

    function carregarProgresso() {
        const progressoSalvo = localStorage.getItem("progresso");
        if (progressoSalvo) {
            return JSON.parse(progressoSalvo);
        } else {
            return {
                btc: 0,
                btcPorClique: 1,
                btcPorSegundo: 0,
                upgrades: {}
            };
        }
    }

    function inicializarJogo() {
        const progresso = carregarProgresso();
        btc = progresso.btc;
        btcPorClique = progresso.btcPorClique;
        btcPorSegundo = progresso.btcPorSegundo;

        let upgrades = {
            clique: [
                { nome: "Divulgar tigrinho", preco: 10, comprado: false, repetivel: true, efeito: () => btcPorClique += 1 },
                { nome: "Enviar Trojan por e-mail", preco: 50, comprado: false, repetivel: true, efeito: () => btcPorClique += 5 },
                { nome: "Clonar Whatsapp de Velinhos", preco: 200, comprado: false, repetivel: true, efeito: () => btcPorClique += 20 },
                { nome: "Divulgar golpe no instagram", preco: 300, comprado: false, repetivel: true, efeito: () => btcPorClique += 30 },
                { nome: "Enviam spam no Face", preco: 500, comprado: false, repetivel: true, efeito: () => btcPorClique += 50 },               
                { nome: "Clonar cartão da mãe", preco: 600, comprado: false, repetivel: false, efeito: () => btcPorClique += 60 },
                { nome: "Fechar contrato com casa de Aposta", preco: 1000, comprado: false, repetivel: false, efeito: () => btcPorClique += 150 },
            ],
            producao: [
                { nome: "Minerar com Máquinas Alheias", preco: 50, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 1 },
                { nome: "Melhorar Mineração", preco: 100, comprado: false, repetivel: true, efeito: () => btcPorSegundo * 1.5 },
                { nome: "Fazer gato net pra minerar", preco: 500, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 50 },
                { nome: "Fazer Overclock na placa de video", preco: 700, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 100 },
                { nome: "Turbinar Processador", preco: 1200, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 200 },
                { nome: "Placa Mãe super gamer", preco: 1500, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 300 },
                { nome: "Muito RGB bem gamer", preco: 2000, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 500 }
            ],
            ambiente: [
                { 
                    nome: "Comprar Apartamento", 
                    preco: 400000,
                    comprado: false,
                    repetivel: false,  // Não repetível porque é um upgrade único
                    efeito: () => {
                        const computerImage = document.querySelector('.computer');
                        if (computerImage) computerImage.src = "../assets/apartamento.gif";
                    }
                }
            ]
        };

        // Se upgrades salvos existirem, sobrescreve os "comprados"
        if (progresso.upgrades) {
            for (let categoria in progresso.upgrades) {
                if (upgrades[categoria]) {
                    progresso.upgrades[categoria].forEach((itemSalvo, index) => {
                        if (upgrades[categoria][index]) {
                            upgrades[categoria][index].comprado = itemSalvo.comprado;
                        }
                    });
                }
            }
        }

        openUpgradeBtn.addEventListener("click", () => {
            upgradeMenu.classList.remove("hidden");
            hackearBtn.style.display = "none";
            openUpgradeBtn.style.display = "none";
            atualizarLoja();
        });

        closeUpgradeBtn.addEventListener("click", () => {
            upgradeMenu.classList.add("hidden");
            hackearBtn.style.display = "block";
            openUpgradeBtn.style.display = "block";
        });

        function atualizarDisplay() {
            btcDisplay.innerText = `BTC: ${btc.toFixed(2)}`;
        }

        function abreviarPreco(preco) {
            if (preco >= 1000000) {
                return (preco / 1000000).toFixed(1) + 'M'; // Ex: 1.5M para 1.500.000
            } else if (preco >= 1000) {
                return (preco / 1000).toFixed(1) + 'k'; // Ex: 3.2k para 3.200
            } else {
                return preco.toString(); // Retorna o valor normal se for menor que 1000
            }
        }
        


        function atualizarLoja() {
            upgradeList.innerHTML = "";
        
            for (let categoria in upgrades) {
                const titulo = document.createElement("h4");
                titulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
                upgradeList.appendChild(titulo);
        
                upgrades[categoria].forEach((upgrade, index) => { 
                    if (upgrade.repetivel || !upgrade.comprado) {  // Mostra se for repetível ou não comprado
                        const precoAbreviado = abreviarPreco(upgrade.preco);
                        const item = document.createElement("li");
                        item.innerHTML = `<button class="upgrade-btn" data-categoria="${categoria}" data-index="${index}">
                                            ${upgrade.nome} - ${precoAbreviado} BTC
                                          </button>`;
                        upgradeList.appendChild(item);
                    }
                });
            }
        
            document.querySelectorAll('.upgrade-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const categoria = btn.dataset.categoria;
                    const index = parseInt(btn.dataset.index);
                    const upgrade = upgrades[categoria][index];
                    if (btc >= upgrade.preco) {
                        btc -= upgrade.preco;
                        upgrade.efeito();
                    
                        if (!upgrade.repetivel) {
                            upgrade.comprado = true;  // Marca como comprado só se não for repetível
                        } else {
                            upgrade.preco = Math.ceil(upgrade.preco * 1.8);  // se repetível, aumenta o preço
                        }
                    
                        atualizarLoja();
                        atualizarDisplay();
                        salvarProgresso(btc, btcPorClique, btcPorSegundo);
                        buysound.currentTime = 0;
                        buysound.play();
                    }                    
                });
            });
        }
        
      

        hackearBtn.addEventListener("click", () => {
            btc += btcPorClique;
            atualizarDisplay();
            salvarProgresso(btc, btcPorClique, btcPorSegundo);
        });

        setInterval(() => {
            btc += btcPorSegundo;
            atualizarDisplay();
            salvarProgresso(btc, btcPorClique, btcPorSegundo);
        }, 1000);

        upgradeMenu.classList.add("hidden");
        atualizarDisplay();
        atualizarLoja();
    }

    novoJogoBtn.addEventListener("click", () => {
        localStorage.clear();
        mostrarJogo();
        inicializarJogo();
    });

    continuarJogoBtn.addEventListener("click", () => {
        mostrarJogo();
        inicializarJogo();
    });

    mostrarMenu();
});

const botao = document.getElementById("hackear");

botao.addEventListener("touchstart", () => {
    botao.style.transform = "scale(0.95)";
});

botao.addEventListener("touchend", () => {
    botao.style.transform = "scale(1)";
});

const btnSound = new Audio('../assets/sounds/btnsound.mp3');
btnSound.load();

const tecladoSound = new Audio('../assets/sounds/tecladosound.mp3');
tecladoSound.load();

const buysound = new Audio('../assets/sounds/buysound.mp3');
buysound.load();

// Função para desbloquear o áudio no primeiro toque
function desbloquearAudio() {
    btnSound.play().catch(() => {});
    tecladoSound.play().catch(() => {});
    buysound.play().catch(() => {});

    btnSound.pause();
    tecladoSound.pause();
    buysound.pause();

    btnSound.currentTime = 0;
    tecladoSound.currentTime = 0;
    buysound.currentTime = 0;

    document.removeEventListener('touchstart', desbloquearAudio);
}

// Adiciona o desbloqueio para mobile
document.addEventListener('touchstart', desbloquearAudio, { once: true });

// Sons para botões normais
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        if (button.id !== 'hackear') {
            btnSound.currentTime = 0;
            btnSound.play();
        }
    });
});

// Som especial para o botão hackear
const hackearBtn = document.getElementById('hackear');
if (hackearBtn) {
    hackearBtn.addEventListener('click', () => {
        tecladoSound.currentTime = 0;
        tecladoSound.play();
    });
}
