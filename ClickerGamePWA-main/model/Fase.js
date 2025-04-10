export default class Fase {
  #nome;

  constructor(nome) {
      this.#nome = nome;
  }

  getNome() {
      return this.#nome;
  }

  static FASE1 = new Fase("Porão");
  static FASE2 = new Fase("Apartamento");
  static FASE3 = new Fase("Mansão");
  static FASE4 = new Fase("Empresa");

  static listarFases() {
      return [Fase.FASE1, Fase.FASE2, Fase.FASE3, Fase.FASE4];
  }
}



