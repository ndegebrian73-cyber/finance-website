// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 PASTE YOUR FIREBASE CONFIG BELOW (replace the example values)
const firebaseConfig = {
  apiKey: "PASTE_YOURS_HERE",
  authDomain: "PASTE_YOURS_HERE",
  projectId: "PASTE_YOURS_HERE",
  storageBucket: "PASTE_YOURS_HERE",
  messagingSenderId: "PASTE_YOURS_HERE",
  appId: "PASTE_YOURS_HERE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let balance = 0;
let currentUser = null;


// 🔐 REGISTER
window.register = async function () {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    currentUser = userCred.user;

    await setDoc(doc(db, "users", currentUser.uid), {
      balance: 100
    });

    alert("Account created!");
  } catch (error) {
    alert(error.message);
  }
};


// 🔐 LOGIN
window.login = async function () {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    currentUser = userCred.user;

    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    balance = userDoc.data().balance;

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("appPage").style.display = "block";

    updateUI();
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};


// 🚪 LOGOUT
window.logout = async function () {
  await signOut(auth);
  location.reload();
};


// 💰 DEPOSIT
window.deposit = async function () {
  const amount = parseFloat(document.getElementById("depositAmount").value);
  if (!amount || amount <= 0) return;

  balance += amount;

  await updateDoc(doc(db, "users", currentUser.uid), {
    balance: balance
  });

  document.getElementById("depositAmount").value = "";
  updateUI();
};


// 💸 WITHDRAW
window.withdraw = async function () {
  if (balance <= 0) return;

  alert("Withdrawal request sent (demo mode)");
};


// 🖥 UPDATE UI
function updateUI() {
  document.getElementById("balance").innerText = balance.toFixed(2);
}
