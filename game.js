
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = 'login.html';
}

async function mainGame() {
  const tebakan = parseInt(document.getElementById('tebakan').value);
  if (!tebakan || tebakan < 1 || tebakan > 10) {
    alert("Masukkan angka 1 sampai 10!");
    return;
  }

  const res = await fetch("http://localhost:5000/api/game/play", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ guess: tebakan })
  });

  const data = await res.json();
  document.getElementById("gameResult").innerText = data.msg;
}
