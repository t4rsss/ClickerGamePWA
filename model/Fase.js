

export default class Fase {
    
    #nome;
  
  static FASE1 = new Upgrade('Porão');
  static FASE2 = new Upgrade('Apartamento');  
  static FASE3 = new Upgrade('Mansão');  
  static FASE4 = new Upgrade('Empresa');


    constructor(nome) {
    this.#nome = nome;
  } 

  }
  
