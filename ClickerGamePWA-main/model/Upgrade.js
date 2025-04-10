

export default class Upgrade {
  constructor(nome, preco = 0, efeito = "Sem efeito") {
      this.nome = nome;
      this.preco = preco;
      this.efeito = efeito;
  }

 
  detalhes() {
      return `Upgrade: ${this.nome} | Preço: ${this.preco} | Efeito: ${this.efeito}`;
  }

  
  static EFEITO1 = new Upgrade("Melhorar CPU", 100, "Aumenta a velocidade de processamento");
  static EFEITO2 = new Upgrade("Melhorar Memória", 80, "Aumenta a RAM disponível");
  static EFEITO3 = new Upgrade("Melhorar Disco", 60, "Melhora a velocidade de leitura e gravação");
  static EFEITO4 = new Upgrade("Melhorar Placa de Vídeo", 200, "Aumenta o desempenho gráfico");
  static EFEITO5 = new Upgrade("Melhorar Placa Mãe", 150, "Permite melhorias gerais no sistema");

 
  static listarUpgrades() {
      return [
          Upgrade.EFEITO1,
          Upgrade.EFEITO2,
          Upgrade.EFEITO3,
          Upgrade.EFEITO4,
          Upgrade.EFEITO5
      ];
  }
}



