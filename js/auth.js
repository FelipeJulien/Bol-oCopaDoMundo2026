// =============================================
// auth.js — IDENTIFICAÇÃO DO USUÁRIO
// =============================================

let currentUser = null;
let currentUserName = null;

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function checkAuth() {
  const storedId = localStorage.getItem('auth_uid');
  const storedName = localStorage.getItem('auth_name');

  if (storedId && storedName) {
    currentUser = storedId;
    currentUserName = storedName;
    document.getElementById('display-user-name').textContent = currentUserName;
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('app-container').style.display = 'flex';
    
    // Dispara carregamento de dados do app.js
    if (typeof initApp === 'function') {
      initApp();
    }
  } else {
    document.getElementById('login-modal').classList.remove('hidden');
    document.getElementById('app-container').style.display = 'none';
  }
}

document.getElementById('btn-login').addEventListener('click', () => {
  const nameInput = document.getElementById('auth-name-input').value.trim();
  if (nameInput) {
    if (nameInput.length > 8) {
      alert("Máximo 8 caracteres");
      return;
    }
    const uid = slugify(nameInput);
    localStorage.setItem('auth_uid', uid);
    localStorage.setItem('auth_name', nameInput);
    
    // Save to Firestore right away to prevent anonymous bugs
    if (typeof dbAPI !== 'undefined' && dbAPI.saveUserName) {
      dbAPI.saveUserName(uid, nameInput);
    }
    
    checkAuth();
  } else {
    alert("Por favor, informe seu Nome de Guerra.");
  }
});

document.getElementById('auth-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    e.preventDefault();
    document.getElementById('btn-login').click();
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('auth_uid');
  localStorage.removeItem('auth_name');
  currentUser = null;
  currentUserName = null;
  location.reload();
});

// Inicializa verificação ao carregar a página
document.addEventListener('DOMContentLoaded', checkAuth);
