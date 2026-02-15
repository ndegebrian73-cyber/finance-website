let balance = 100;
let invested = 0;
let history = [];

let profitTimer;
let countdownTimer;
let timeLeft = 10;

function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";
  } else {
    alert("Invalid login");
  }
}

function logout() {
  location.reload();
}

function updateUI() {
  document.getElementById("balance").innerText = balance.toFixed(2);
  document.getElementById("invested").innerText = invested.toFixed(2);
  document.getElementById("countdown").innerText =
    invested > 0 ? timeLeft + "s" : "--";
  renderHistory();
}

function startInvestment() {
  if (invested > 0 || balance <= 0) return;

  invested = balance;
  balance = 0;
  timeLeft = 10;
  updateUI();

  countdownTimer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) timeLeft = 10;
    updateUI();
  }, 1000);

  profitTimer = setInterval(() => {
    let profit = invested * 0.05;
    invested += profit;

    history.push({
      time: new Date().toLocaleTimeString(),
      profit: profit.toFixed(2)
    });

    timeLeft = 10;
    updateUI();
  }, 10000);
}

function withdraw() {
  clearInterval(profitTimer);
  clearInterval(countdownTimer);

  balance += invested;
  invested = 0;
  updateUI();
}

function deposit() {
  let amount = parseFloat(document.getElementById("depositAmount").value);
  if (!amount || amount <= 0) return;

  balance += amount;
  document.getElementById("depositAmount").value = "";
  updateUI();
}

function renderHistory() {
  let table = document.getElementById("historyBody");
  table.innerHTML = "";

  history.slice().reverse().forEach(entry => {
    table.innerHTML += `
      <tr>
        <td>${entry.time}</td>
        <td>${entry.profit}</td>
      </tr>
    `;
  });
}
