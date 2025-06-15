
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

const welcomeMsg = document.getElementById('welcomeMsg');
const saldo = document.getElementById('saldo');

function loadUser() {
  fetch('http://localhost:5000/api/user/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(res => res.json())
    .then(data => {
      if (data.username) {
        welcomeMsg.innerText = '👤 ' + data.username;
        saldo.innerText = 'Rp ' + data.balance.toLocaleString();
      } else {
        window.location.href = 'login.html';
      }
    });
}

loadUser();

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

async function deposit() {
  const amount = prompt("Masukkan jumlah deposit:");
  if (!amount) return;
  const res = await fetch('http://localhost:5000/api/user/deposit', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: parseInt(amount) })
  });
  const data = await res.json();
  alert(data.msg);
  loadUser();
}

async function withdraw() {
  const amount = prompt("Masukkan jumlah withdraw:");
  if (!amount) return;
  const res = await fetch('http://localhost:5000/api/user/withdraw', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ amount: parseInt(amount) })
  });
  const data = await res.json();
  alert(data.msg);
  loadUser();
}
