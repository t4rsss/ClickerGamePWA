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

    function salvarUpgrades() {
        const upgradesSalvos = JSON.stringify(upgrades);
        localStorage.setItem("upgradesSalvos", upgradesSalvos);
    }
    
    function carregarUpgrades() {
        const dadosSalvos = localStorage.getItem("upgradesSalvos");
        if (dadosSalvos) {
            const upgradesCarregados = JSON.parse(dadosSalvos);
    
            for (let categoria in upgradesCarregados) {
                upgrades[categoria] = upgradesCarregados[categoria].map((upgrade, i) => {
                    // Reassocia a função "efeito" após o parse
                    let original = upgrades[categoria][i];
                    return {
                        ...upgrade,
                        efeito: original.efeito
                    };
                });
            }
        }
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
        carregarUpgrades();

        let upgrades = {
            clique: [
                { nome: "Divulgar tigrinho", preco: 10, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += this.nivel; } },
                { nome: "Enviar Trojan por e-mail", preco: 50, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 5 * this.nivel; } },
                { nome: "Clonar Whatsapp de Velinhos", preco: 200, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 20 * this.nivel; } },
                { nome: "Divulgar golpe no instagram", preco: 300, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 30 * this.nivel; } },
                { nome: "Enviam spam no Face", preco: 500, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorClique += 50 * this.nivel; } },               
                { nome: "Clonar cartão da mãe", preco: 600, comprado: false, repetivel: false, efeito: () => btcPorClique += 60 },
                { nome: "Fechar contrato com casa de Aposta", preco: 1000, comprado: false, repetivel: false, efeito: () => btcPorClique += 150 },
            ],
            producao: [
                { nome: "Minerar com Máquinas Alheias", preco: 50, comprado: false, repetivel: false, efeito: () => btcPorSegundo += 1 },
                { nome: "Melhorar Mineração", preco: 100, comprado: false, repetivel: true, nivel: 1, efeito: function () { btcPorSegundo += 2 * this.nivel; } },
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
                    repetivel: false,
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


        function abreviarPreco(preco) {
            if (preco >= 1000000) {
                return (preco / 1000000).toFixed(1) + 'M'; // Ex: 1.5M para 1.500.000
            } else if (preco >= 1000) {
                return (preco / 1000).toFixed(1) + 'k'; // Ex: 3.2k para 3.200
            } else {
                return preco.toString(); // Retorna o valor normal se for menor que 1000
            }
        }
        
        function atualizarDisplay() {
            document.getElementById("btc").textContent = abreviarPreco(btc) + " BTC";
            document.getElementById('btc-clique').textContent = `P/click: ${abreviarPreco(btcPorClique)}`;
            document.getElementById('btc-segundo').textContent = `P/seg: ${abreviarPreco(btcPorSegundo)}`;
        }
        

        function atualizarLoja() {
            upgradeList.innerHTML = "";
        
            for (let categoria in upgrades) {
                const titulo = document.createElement("h4");
                titulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
                upgradeList.appendChild(titulo);
        
                upgrades[categoria].forEach((upgrade, index) => {
                    // Só mostra upgrade se ele não foi comprado OU se ele é repetível
                    if (!upgrade.comprado || upgrade.repetivel) {
                        const precoAbreviado = abreviarPreco(upgrade.preco);
                        
                        const item = document.createElement("li");
                        const podeComprar = btc >= upgrade.preco;
        
                        item.innerHTML = `
                        <button class="upgrade-btn ${!podeComprar ? 'locked' : ''}" data-categoria="${categoria}" data-index="${index}">
                          ${upgrade.nome}<br>
                          ${abreviarPreco(upgrade.preco)} BTC <br>
                          ${upgrade.nivel ? ' (Nível ' + upgrade.nivel + ')' : ''}
                        </button>
                      `;                      
                        upgradeList.appendChild(item);
                    }
                });
            }
        
            // Adiciona os eventos de clique depois de atualizar a lista
            document.querySelectorAll('.upgrade-btn').forEach(btn => {
                btn.addEventListener('click', () => {
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
                            upgrade.efeito();
                        }
                        salvarUpgrades();
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
