function showLogin() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
  
    
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
  }
  
  function showRegister() {
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
  
    
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  }
  
  function navigateToMenu() {
    window.location.href = "menu.html"; 
  }
  
 
  export { showLogin, showRegister, navigateToMenu };
  