const halfLife = 144; // seconds
const initialMass = 1000; // grams

// Launch time (persistent)
let decayStart = localStorage.getItem("decayLaunchTime");
if (!decayStart) {
  decayStart = new Date().toISOString();
  localStorage.setItem("decayLaunchTime", decayStart);
}
const launchTime = new Date(decayStart);

// Added mass timestamps
let addedMasses = JSON.parse(localStorage.getItem("addedMasses")) || [];

function saveAddedMass(time) {
  addedMasses.push(time);
  localStorage.setItem("addedMasses", JSON.stringify(addedMasses));
}

function calculateDecay(secondsElapsed, baseMass) {
  return baseMass * Math.pow(0.5, secondsElapsed / halfLife);
}

function update() {
  const now = new Date();
  const secondsElapsed = Math.floor((now - launchTime) / 1000);

  // Original decay
  const decayedOriginal = calculateDecay(secondsElapsed, initialMass);

  // Decay of added grams
  let decayedAdded = 0;
  for (let i = 0; i < addedMasses.length; i++) {
    const addedTime = new Date(addedMasses[i]);
    const elapsed = (now - addedTime) / 1000;
    decayedAdded += calculateDecay(elapsed, 1);
  }

  const totalRemaining = decayedOriginal + decayedAdded;
  const totalDecayed = (initialMass + addedMasses.length) - totalRemaining;

  // Update DOM
  document.getElementById('time').textContent = secondsElapsed;
  document.getElementById('mass').textContent = totalRemaining.toFixed(8);
  document.getElementById('decayed').textContent = totalDecayed.toFixed(8);
  document.getElementById('added-count').textContent = addedMasses.length;
}

// +1 gram button
document.getElementById('add-gram').addEventListener('click', () => {
  const now = new Date().toISOString();
  saveAddedMass(now);
});

// Update every second
setInterval(update, 1000);
update();


// 🌌 Starfield Background
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
const starCount = 100;
const speed = 0.05;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createStars() {
  stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * speed,
      dy: (Math.random() - 0.5) * speed
    });
  }
}
createStars();

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.x += star.dx;
    star.y += star.dy;

    // Wrap around edges
    if (star.x < 0) star.x = canvas.width;
    if (star.x > canvas.width) star.x = 0;
    if (star.y < 0) star.y = canvas.height;
    if (star.y > canvas.height) star.y = 0;
  }
  requestAnimationFrame(drawStars);
}
drawStars();
