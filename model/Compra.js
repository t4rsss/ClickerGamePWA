class Compra {
    constructor(dataCompra, valorPonto) {
        this.dataCompra = dataCompra; 
        this.valorPonto = valorPonto; 
        this.upgrades = []; 
    }

    
    adicionarUpgrade(upgrade) {
        this.upgrades.push(upgrade);
    }

    
    detalhesCompra() {
        console.log(`Data da Compra: ${this.dataCompra}`);
        console.log(`Valor em Pontos: ${this.valorPonto}`);
        console.log(`Upgrades adquiridos:`);
        this.upgrades.forEach((upgrade, index) => {
            console.log(`${index + 1}. ${upgrade.nome} - Preço: ${upgrade.preco} - Efeito: ${upgrade.efeito}`);
        });
    }
}

