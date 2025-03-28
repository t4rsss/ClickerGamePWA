

export default class Upgrade {
    
    #nome;
  
  static EFEITO1 = new Upgrade('Melhorar CPU');
  static EFEITO2 = new Upgrade('Melhorar Memoria');  
  static EFEITO3 = new Upgrade('Melhorar Disco');  
  static EFEITO4 = new Upgrade('Melhorar Placa de Video');
  static EFEITO5 = new Upgrade('Melhorar Placa Mae');   

  
    constructor(nome) {
    this.#nome = nome;
  } 

  }
  
