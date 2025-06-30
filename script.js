// Half-life data (in seconds) for demonstration
const halfLives = {
  Rutherfordium: 78, // example values
  Dubnium: 32,
  Seaborgium: 360,
  Bohrium: 61,
  Hassium: 480,
  Meitnerium: 10,
  Darmstadtium: 20,
  Roentgenium: 26,
  Copernicium: 230,
  Nihonium: 20,
  Flerovium: 250,
  Moscovium: 220,
  Livermorium: 60,
  Tennessine: 20,
  Oganesson: 0.89
};

const intro = document.getElementById('intro-screen');
const decay = document.getElementById('decay-screen');
const done = document.getElementById('done-screen');

const elementName = document.getElementById('element-name');
const startingMass = document.getElementById('starting-mass');
const timeSpan = document.getElementById('time');
const massRemaining = document.getElementById('mass-remaining');
const massDecayed = document.getElementById('mass-decayed');
const doneTime = document.getElementById('done-time');

let interval;

function toGrams(value, unit) {
  if (unit === 'kg') return value * 1000;
  if (unit === 'ton') return value * 1_000_000;
  return value;
}

function formatMass(grams) {
  if (grams >= 1_000_000) return (grams / 1_000_000).toFixed(3) + ' tons';
  if (grams >= 1000) return (grams / 1000).toFixed(3) + ' kg';
  return grams.toFixed(6) + ' g';
}

function startSimulation(data) {
  localStorage.setItem('decaySim', JSON.stringify(data));
  runSimulation();
}

function runSimulation() {
  const data = JSON.parse(localStorage.getItem('decaySim'));
  if (!data) return;

  const halfLife = halfLives[data.element] || 60;
  const decayConstant = Math.LN2 / halfLife;
  const now = Date.now();
  const elapsed = (now - data.startTime) / 1000;
  const remaining = data.initialMass * Math.exp(-decayConstant * elapsed);
  const decayed = data.initialMass - remaining;

  if (remaining < 0.000000001) {
    clearInterval(interval);
    localStorage.removeItem('decaySim');
    decay.classList.add('hidden');
    done.classList.remove('hidden');
    doneTime.textContent = elapsed.toFixed(2);
    return;
  }

  intro.classList.add('hidden');
  decay.classList.remove('hidden');

  elementName.textContent = data.element;
  startingMass.textContent = formatMass(data.initialMass);
  timeSpan.textContent = elapsed.toFixed(2);
  massRemaining.textContent = formatMass(remaining);
  massDecayed.textContent = formatMass(decayed);
}

interval = setInterval(runSimulation, 100);

// Start button
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  const element = document.getElementById('element').value;
  const unit = document.getElementById('unit').value;
  const mass = parseFloat(document.getElementById('mass').value);
  if (!element || !mass || mass <= 0) return;

  const massInGrams = toGrams(mass, unit);
  const data = {
    element,
    initialMass: massInGrams,
    startTime: Date.now()
  };
  startSimulation(data);
});

// Restart button
const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', () => {
  localStorage.removeItem('decaySim');
  location.reload();
});

// Starfield animation
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2
  }));
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.x += s.dx;
    s.y += s.dy;
    if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
    if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
  });
  requestAnimationFrame(animate);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
animate();

