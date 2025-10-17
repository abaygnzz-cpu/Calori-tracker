// app.js - logic separated for GitHub Pages deployment

// Expanded food database (~100 items) with realistic per-100g values (calories & protein)
const foodDB = {
  "nasi putih": { cal: 130, protein: 2.7 }, "nasi goreng": { cal: 180, protein: 4.5 },
  "nasi uduk": { cal: 250, protein: 4 }, "nasi kuning": { cal: 240, protein: 4 },
  "nasi padang": { cal: 260, protein: 6 }, "nasi bakar": { cal: 210, protein: 5 },
  "ayam goreng": { cal: 260, protein: 28 }, "ayam bakar": { cal: 195, protein: 29 },
  "ayam rebus": { cal: 165, protein: 31 }, "ayam geprek": { cal: 280, protein: 27 },
  "dada ayam": { cal: 165, protein: 31 }, "paha ayam": { cal: 210, protein: 25 },
  "ikan tongkol": { cal: 132, protein: 28 }, "ikan tuna": { cal: 132, protein: 28 },
  "ikan salmon": { cal: 208, protein: 20 }, "ikan lele": { cal: 180, protein: 20 },
  "ikan nila": { cal: 100, protein: 20 }, "udang": { cal: 99, protein: 24 },
  "cumi": { cal: 92, protein: 15 }, "kepiting": { cal: 83, protein: 19 },
  "tahu goreng": { cal: 190, protein: 8 }, "tahu kukus": { cal: 76, protein: 8 },
  "tempe goreng": { cal: 200, protein: 11 }, "tempe bacem": { cal: 170, protein: 10 },
  "telur rebus": { cal: 155, protein: 13 }, "telur mata sapi": { cal: 196, protein: 13 },
  "telur dadar": { cal: 200, protein: 12 }, "sate ayam": { cal: 160, protein: 14 },
  "sate kambing": { cal: 200, protein: 18 }, "rendang": { cal: 195, protein: 18 },
  "rawon": { cal: 150, protein: 11 }, "gado-gado": { cal: 180, protein: 8 },
  "ketoprak": { cal: 180, protein: 7 }, "soto ayam": { cal: 120, protein: 9 },
  "soto daging": { cal: 140, protein: 12 }, "bakso sapi": { cal: 180, protein: 9 },
  "bakso ayam": { cal: 150, protein: 10 }, "mie goreng": { cal: 330, protein: 8 },
  "mie rebus": { cal: 280, protein: 7 }, "bakmi": { cal: 300, protein: 10 },
  "kwetiau": { cal: 290, protein: 9 }, "bihun goreng": { cal: 320, protein: 7 },
  "capcay": { cal: 90, protein: 3 }, "sayur asem": { cal: 40, protein: 1.5 },
  "sayur lodeh": { cal: 80, protein: 2 }, "sayur bayam": { cal: 23, protein: 2.9 },
  "tumis kangkung": { cal: 70, protein: 3 }, "tempe orek": { cal: 210, protein: 11 },
  "sop buntut": { cal: 220, protein: 18 }, "nugget ayam": { cal: 290, protein: 12 },
  "burger (daging)": { cal: 295, protein: 17 }, "kentang goreng": { cal: 312, protein: 3.4 },
  "pizza (keju)": { cal: 266, protein: 11 }, "spaghetti": { cal: 158, protein: 5 },
  "roti tawar": { cal: 265, protein: 9 }, "roti isi": { cal: 300, protein: 8 },
  "roti bakar": { cal: 320, protein: 8 }, "bubur ayam": { cal: 120, protein: 7 },
  "lontong": { cal: 100, protein: 2 }, "ketupat": { cal: 96, protein: 2 },
  "sate padang": { cal: 210, protein: 17 }, "pempek": { cal: 220, protein: 11 },
  "siomay": { cal: 120, protein: 10 }, "bakwan": { cal: 150, protein: 3 },
  "pisang goreng": { cal: 260, protein: 3.5 }, "pisang": { cal: 89, protein: 1.1 },
  "apel": { cal: 52, protein: 0.3 }, "jeruk": { cal: 47, protein: 0.9 },
  "alpukat": { cal: 160, protein: 2 }, "mangga": { cal: 60, protein: 0.8 },
  "semangka": { cal: 30, protein: 0.6 }, "melon": { cal: 34, protein: 0.8 },
  "kacang tanah": { cal: 567, protein: 26 }, "kacang mede": { cal: 553, protein: 18 },
  "kacang kedelai": { cal: 446, protein: 36 }, "kacang hijau": { cal: 347, protein: 23 },
  "susu sapi": { cal: 60, protein: 3.2 }, "yoghurt": { cal: 59, protein: 10 },
  "keju": { cal: 350, protein: 25 }, "es teh manis": { cal: 60, protein: 0 },
  "kopi (hitam)": { cal: 2, protein: 0.3 }, "kopi susu": { cal: 50, protein: 1.5 },
  "teh pahit": { cal: 1, protein: 0 }, "air kelapa": { cal: 19, protein: 0.7 },
  "susu kental manis": { cal: 321, protein: 7.6 }, "kue bolu": { cal: 350, protein: 6 },
  "dadar gulung": { cal: 210, protein: 4 }, "klepon": { cal: 220, protein: 1.5 },
  "onde-onde": { cal: 260, protein: 4 }, "risoles": { cal: 280, protein: 6 },
  "lokum (sekoteng)": { cal: 120, protein: 2 }, "tempe mendoan": { cal: 210, protein: 11 },
  "sop iga": { cal: 240, protein: 20 }, "ayam betutu": { cal: 230, protein: 24 },
  "coto makassar": { cal: 200, protein: 13 }, "soto mie": { cal: 250, protein: 10 }
};

// State - synced with localStorage
let totalCalories = +localStorage.getItem('totalCalories') || 0;
let totalProtein = +localStorage.getItem('totalProtein') || 0;
let dailyNeed = +localStorage.getItem('dailyNeed') || 0;
let proteinNeed = +localStorage.getItem('proteinNeed') || 0;
let foodList = JSON.parse(localStorage.getItem('foodList')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

const el = id => document.getElementById(id);
let calorieChart, proteinChart;

// Init
window.addEventListener('load', () => {
  renderList();
  updateDisplay();
  initCharts();
  // attach events
  el('addBtn').addEventListener('click', addFood);
  el('calcBtn').addEventListener('click', calculateNeeds);
  el('resetBtn').addEventListener('click', resetAll);
});

function calculateNeeds() {
  const g = el('gender').value;
  const a = +el('age').value; const w = +el('weight').value; const h = +el('height').value;
  const act = +el('activity').value; const goal = el('goal').value;
  if (!g || !a || !w || !h || !act || !goal) return alert('Lengkapi semua data!');

  const bmr = g === 'pria'
    ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
    : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);

  let tdee = bmr * act;
  if (goal === 'defisit') tdee -= 500;
  if (goal === 'surplus') tdee += 500;

  dailyNeed = Math.round(tdee);
  proteinNeed = Math.round(w * 1.6);
  localStorage.setItem('dailyNeed', dailyNeed);
  localStorage.setItem('proteinNeed', proteinNeed);
  updateDisplay();
}

function addFood() {
  const name = el('foodName').value.toLowerCase().trim();
  const gram = +el('foodGram').value; if (!name || !gram || gram <= 0) return alert('Masukkan nama & gram valid!');
  if (!foodDB[name]) return alert('Makanan tidak ada di database! Coba ejaan yang lain.');

  const cal = (foodDB[name].cal / 100) * gram;
  const pro = (foodDB[name].protein / 100) * gram;
  totalCalories += cal; totalProtein += pro; foodList.push({ name, gram, cal, pro });
  saveData(); renderList(); updateDisplay(); updateCharts();
  el('foodName').value = ''; el('foodGram').value = '';
}

function renderList() {
  el('foodList').innerHTML = foodList.map(f =>
    `<li>${capitalize(f.name)} - ${f.gram}g = ${f.cal.toFixed(1)} kcal / ${f.pro.toFixed(1)} g protein</li>`
  ).join('');
}

function updateDisplay() {
  el('totalCalories').textContent = totalCalories.toFixed(1);
  el('totalProtein').textContent = totalProtein.toFixed(1);
  el('dailyNeed').textContent = dailyNeed ? `Kebutuhan kalori: ${dailyNeed} kcal` : '';
  el('proteinNeed').textContent = proteinNeed ? `Kebutuhan protein: ${proteinNeed} g` : '';
  const diff = totalCalories - dailyNeed;
  el('status').textContent = !dailyNeed ? '' : diff < -100 ? '🔥 Masih defisit kalori.' : diff > 100 ? '⚠️ Surplus kalori.' : '✅ Kalori seimbang.';
}

function saveData() {
  localStorage.setItem('foodList', JSON.stringify(foodList));
  localStorage.setItem('totalCalories', totalCalories);
  localStorage.setItem('totalProtein', totalProtein);
}

function resetAll() {
  if (!confirm('Yakin reset semua data?')) return; totalCalories = 0; totalProtein = 0; dailyNeed = 0; proteinNeed = 0; foodList = []; history = []; localStorage.clear(); renderList(); updateDisplay(); updateCharts(true);
}

function initCharts() {
  const today = new Date().toLocaleDateString();
  const last = history[history.length - 1];
  if (!last || last.date !== today) history.push({ date: today, calories: totalCalories, protein: totalProtein });

  const ctxC = el('calorieChart').getContext('2d');
  calorieChart = new Chart(ctxC, { type: 'line', data: { labels: history.map(d=>d.date), datasets: [{ label: 'Kalori', data: history.map(d=>d.calories), borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.2)', fill: true, tension: 0.3 }]}, options: { responsive: true, scales: { y: { beginAtZero: true } } } });

  const ctxP = el('proteinChart').getContext('2d');
  proteinChart = new Chart(ctxP, { type: 'line', data: { labels: history.map(d=>d.date), datasets: [{ label: 'Protein (g)', data: history.map(d=>d.protein), borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.2)', fill: true, tension: 0.3 }]}, options: { responsive: true, scales: { y: { beginAtZero: true } } } });
}

function updateCharts(reset=false) {
  const today = new Date().toLocaleDateString();
  if (reset) history = []; else { const idx = history.findIndex(d=>d.date===today); if (idx>=0) history[idx] = { date: today, calories: totalCalories, protein: totalProtein }; else history.push({ date: today, calories: totalCalories, protein: totalProtein }); }
  localStorage.setItem('history', JSON.stringify(history));
  if (calorieChart && proteinChart) { calorieChart.data.labels = history.map(d=>d.date); calorieChart.data.datasets[0].data = history.map(d=>d.calories); proteinChart.data.labels = history.map(d=>d.date); proteinChart.data.datasets[0].data = history.map(d=>d.protein); calorieChart.update(); proteinChart.update(); }
}

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
