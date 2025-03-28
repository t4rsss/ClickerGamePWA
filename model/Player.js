import ModelError from "/ModelError.js";

export default class Player {
    
  //-----------------------------------------------------------------------------------------//

  constructor(nome, score, nivel, senha) {
    this.setScore(score);
    this.setNome(nome);
    this.setNivel(nivel);
    this.setSenha(senha);      
  }
  
  //-----------------------------------------------------------------------------------------//
 
  getNome() {
    return this.nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Player.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getSenha() {
    return this.senha;
  }
  
  //-----------------------------------------------------------------------------------------//

  setSenha(senha) {
    if(!Player.validarSenha(senha))
      throw new ModelError("Senha inválido");
    this.senha = senha;
  }
  
  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      return false;
    if (nome.length > 20) 
        return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarSenha(senha) {
    if(senha == null || senha == "" || senha == undefined)
      return false;
    if (senha.length < 8) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
}