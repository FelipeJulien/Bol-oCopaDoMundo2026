let currentUser = null;
let currentUserName = null;
let pendingAuthUid = null;
let pendingAuthName = null;

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function checkPasswordFlow(uid, nameInput) {
  pendingAuthUid = uid;
  pendingAuthName = nameInput;

  document.getElementById('login-modal').classList.add('hidden');
  
  try {
    const res = await fetch('/api/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid })
    });
    const data = await res.json();
    
    if (data.exists && data.hasPin) {
      document.getElementById('pin-verify-modal').classList.remove('hidden');
      document.getElementById('pin-verify-input').value = '';
      document.getElementById('pin-verify-error').style.display = 'none';
      document.getElementById('pin-verify-input').focus();
    } else {
      document.getElementById('pin-create-modal').classList.remove('hidden');
      document.getElementById('pin-create-input').value = '';
      document.getElementById('pin-create-error').style.display = 'none';
      document.getElementById('pin-create-input').focus();
    }
  } catch (err) {
    console.error('Erro ao verificar usuário:', err);
    alert("Erro ao conectar com o servidor. Tente novamente.");
    document.getElementById('login-modal').classList.remove('hidden');
  }
}

function grantAccess() {
  localStorage.setItem('auth_uid', pendingAuthUid);
  localStorage.setItem('auth_name', pendingAuthName);
  sessionStorage.setItem('pin_verified', 'true');
  
  currentUser = pendingAuthUid;
  currentUserName = pendingAuthName;
  
  document.getElementById('display-user-name').textContent = currentUserName;
  document.getElementById('pin-create-modal').classList.add('hidden');
  document.getElementById('pin-verify-modal').classList.add('hidden');
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('app-container').style.display = 'flex';
  
  if (typeof dbAPI !== 'undefined' && dbAPI.saveUserName) {
    dbAPI.saveUserName(currentUser, currentUserName);
  }

  if (typeof initApp === 'function') {
    initApp();
  }
}

function checkAuth() {
  const storedId = localStorage.getItem('auth_uid');
  const storedName = localStorage.getItem('auth_name');
  const isPinVerified = sessionStorage.getItem('pin_verified');

  if (storedId && storedName) {
    if (isPinVerified) {
      pendingAuthUid = storedId;
      pendingAuthName = storedName;
      grantAccess();
    } else {
      checkPasswordFlow(storedId, storedName);
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
    checkPasswordFlow(uid, nameInput);
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

document.getElementById('btn-pin-create').addEventListener('click', async () => {
  const pin = document.getElementById('pin-create-input').value;
  const errorEl = document.getElementById('pin-create-error');
  
  if (pin.length < 4) {
    errorEl.textContent = 'A senha deve ter pelo menos 4 caracteres.';
    errorEl.style.display = 'block';
    return;
  }
  
  const btn = document.getElementById('btn-pin-create');
  btn.disabled = true;
  btn.textContent = 'SALVANDO...';
  
  try {
    const res = await fetch('/api/set-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: pendingAuthUid, name: pendingAuthName, pin })
    });
    
    if (res.ok) {
      grantAccess();
    } else {
      const data = await res.json();
      errorEl.textContent = data.error || 'Erro ao salvar senha.';
      errorEl.style.display = 'block';
    }
  } catch (err) {
    errorEl.textContent = 'Erro de conexão.';
    errorEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'SALVAR SENHA';
  }
});

document.getElementById('btn-pin-verify').addEventListener('click', async () => {
  const pin = document.getElementById('pin-verify-input').value;
  const errorEl = document.getElementById('pin-verify-error');
  
  if (!pin) {
    errorEl.textContent = 'Digite sua senha.';
    errorEl.style.display = 'block';
    return;
  }
  
  const btn = document.getElementById('btn-pin-verify');
  btn.disabled = true;
  btn.textContent = 'VERIFICANDO...';
  
  try {
    const res = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: pendingAuthUid, pin })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        grantAccess();
      } else {
        errorEl.textContent = 'Senha incorreta.';
        errorEl.style.display = 'block';
      }
    } else {
      errorEl.textContent = 'Senha incorreta.';
      errorEl.style.display = 'block';
    }
  } catch (err) {
    errorEl.textContent = 'Erro de conexão.';
    errorEl.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'ENTRAR';
  }
});

document.getElementById('btn-pin-change-user').addEventListener('click', () => {
  localStorage.removeItem('auth_uid');
  localStorage.removeItem('auth_name');
  sessionStorage.removeItem('pin_verified');
  document.getElementById('pin-verify-modal').classList.add('hidden');
  document.getElementById('login-modal').classList.remove('hidden');
});

document.getElementById('pin-create-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-pin-create').click();
});
document.getElementById('pin-verify-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-pin-verify').click();
});

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('auth_uid');
  localStorage.removeItem('auth_name');
  sessionStorage.removeItem('pin_verified');
  currentUser = null;
  currentUserName = null;
  location.reload();
});

document.addEventListener('DOMContentLoaded', checkAuth);

