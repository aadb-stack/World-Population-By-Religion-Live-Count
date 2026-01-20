// =============================================
// World Population by Religion – FINAL WORKING
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// ---------------------------------------------
// Firebase Config
// ---------------------------------------------
const firebaseConfig = {
  databaseURL: "https://world-religion-database-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const rootRef = ref(db, "/");

// ---------------------------------------------
// Constants
// ---------------------------------------------
const secondsPerYear = 365 * 24 * 60 * 60;
const WORLD_GROWTH_RATE = 0.0085;

const religionShares = {
  christian: 2380000000 / 8180000000,
  islam: 2020000000 / 8180000000,
  hindu: 1200000000 / 8180000000,
  buddhism: 520000000 / 8180000000,
  sikhism: 30000000 / 8180000000,
  judaism: 15000000 / 8180000000,
  taoism: 12000000 / 8180000000,
  confucianism: 6000000 / 8180000000,
  jainism: 4500000 / 8180000000,
  shinto: 3000000 / 8180000000,
  unaffiliated: 1900000000 / 8180000000
};

// ---------------------------------------------
// Load Firebase Anchor
// ---------------------------------------------
async function loadBase() {
  const snapshot = await get(rootRef);

  if (!snapshot.exists()) {
    console.error("No Firebase data found");
    return;
  }

  const { baseWorld, baseTimestamp } = snapshot.val();
  startCounters(baseWorld, baseTimestamp);
}

// ---------------------------------------------
// Counter Logic
// ---------------------------------------------
function startCounters(baseWorld, baseTimestamp) {
  setInterval(() => {
    const elapsed = (Date.now() - baseTimestamp) / 1000;
    const world =
      baseWorld *
      Math.exp(WORLD_GROWTH_RATE * (elapsed / secondsPerYear));

    renderWorld(world);
    renderReligions(world);
  }, 1000);
}

// ---------------------------------------------
// Render
// ---------------------------------------------
function renderWorld(val) {
  document.getElementById("world").textContent =
    Math.floor(val).toLocaleString();
}

function renderReligions(world) {
  for (const key in religionShares) {
    const el = document.getElementById(key);
    if (!el) continue;
    el.textContent = Math.floor(world * religionShares[key]).toLocaleString();
  }
}

// ---------------------------------------------
// Run
// ---------------------------------------------
loadBase();
