// Animation state
let currentAnimation = "grid";
let isDark = true;
let isTopbarVisible = true;

// FPS calculation variables
let frameRateValue = 0;
let lastFpsUpdateTime = 0;

// Animation objects
let ball = {
  x: 200,
  y: 200,
  vx: 3,
  vy: 0,
  radius: 30,
  gravity: 0.3,
  damping: 0.92,
  color: { h: 220, s: 70, b: 100, a: 0.9 },
};

let particles = [];
const MAX_PARTICLES = 50;

let wave = {
  angle: 0,
  amplitude: 75,
  period: 500,
  speed: 0.02,
};

// Animation descriptions for info panel
const animationInfo = {
  grid: {
    title: "Grid Pattern",
    description:
      "A minimalist grid layout that responds to window size changes.",
  },
  ball: {
    title: "Bouncing Ball",
    description: "Physics simulation with gravity and dampening effects.",
  },
  particles: {
    title: "Particle System",
    description: "Dynamic particles that respond to cursor movement.",
  },
  wave: {
    title: "Wave Animation",
    description: "A sine wave visualization with adjustable parameters.",
  },
};

function setup() {
  // Create canvas and place it in container
  const canvas = createCanvas(
    windowWidth,
    windowHeight - (isTopbarVisible ? 64 : 0)
  );
  canvas.parent("canvasContainer");

  // Use HSB color mode for more intuitive color control
  colorMode(HSB, 360, 100, 100, 1.0);

  frameRate(120);

  // Initialize particles
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(createParticle());
  }

  // Set up event listeners
  setupEventListeners();

  // Start with grid animation (static)
  if (currentAnimation === "grid") noLoop();
  else loop();

  // Show initial animation info
  showInfoPanel(currentAnimation);
}

function setupEventListeners() {
  // Animation selector
  document
    .getElementById("animationSelector")
    .addEventListener("change", (e) => {
      currentAnimation = e.target.value;

      // Start or stop the loop based on animation type
      if (currentAnimation === "grid") {
        noLoop();
        redraw(); // Draw once for the static content
      } else {
        loop();
      }

      // Show info about the selected animation
      showInfoPanel(currentAnimation);
    });

  // Dark mode toggle
  document.getElementById("toggleDark").addEventListener("click", () => {
    isDark = !isDark;
    document.documentElement.classList.toggle("dark", isDark);
    redraw();
  });

  // Topbar visibility toggle
  document.getElementById("toggleTopbar").addEventListener("click", () => {
    isTopbarVisible = false;

    // Hide topbar with animation
    const topbar = document.getElementById("topbar");
    topbar.style.transform = "translateY(-100%)";

    // Show the minimized controls
    const hiddenControls = document.getElementById("hiddenControls");
    hiddenControls.classList.remove("hidden");
    setTimeout(() => {
      hiddenControls.style.opacity = "1";
    }, 10);

    // Adjust canvas size
    document.getElementById("canvasContainer").style.paddingTop = "0";
    resizeCanvas(windowWidth, windowHeight);
    redraw();
  });

  // Show topbar button
  document.getElementById("showTopbar").addEventListener("click", () => {
    isTopbarVisible = true;

    // Show topbar with animation
    const topbar = document.getElementById("topbar");
    topbar.style.transform = "translateY(0)";

    // Hide the minimized controls
    const hiddenControls = document.getElementById("hiddenControls");
    hiddenControls.style.opacity = "0";
    setTimeout(() => {
      hiddenControls.classList.add("hidden");
    }, 300);

    // Adjust canvas size
    document.getElementById("canvasContainer").style.paddingTop = "64px";
    resizeCanvas(windowWidth, windowHeight - 64);
    redraw();
  });
}

function showInfoPanel(animationType) {
  const info = animationInfo[animationType];
  if (!info) return;

  const infoPanel = document.getElementById("infoPanel");
  document.getElementById("infoPanelTitle").textContent = info.title;
  document.getElementById("infoPanelDesc").textContent = info.description;

  // Show the panel with animation
  infoPanel.style.opacity = "1";
  infoPanel.classList.add("animate-slide-up");

  // Hide after delay
  setTimeout(() => {
    infoPanel.style.opacity = "0";
  }, 3000);
}

function draw() {
  // Calculate and update FPS every 500ms
  if (millis() - lastFpsUpdateTime > 500) {
    frameRateValue = frameRate();
    lastFpsUpdateTime = millis();
  }

  // Draw the current animation
  switch (currentAnimation) {
    case "grid":
      drawGrid(40);
      break;
    case "ball":
      drawBouncingBall();
      break;
    case "particles":
      drawParticles();
      break;
    case "wave":
      drawWave();
      break;
  }

  // Draw FPS counter
  drawFpsCounter();
}

function drawFpsCounter() {
  push();
  colorMode(RGB);
  fill(isDark ? 200 : 50, 150);
  noStroke();
  textSize(10);
  textAlign(LEFT, BOTTOM);
  text(`${frameRateValue.toFixed(1)} FPS`, 10, height - 10);
  pop();
}

function drawGrid(size) {
  // Background
  background(isDark ? color(230, 15, 10) : color(0, 0, 100));

  // Grid
  stroke(isDark ? color(210, 30, 60, 0.4) : color(210, 30, 70, 0.3));
  strokeWeight(0.5);

  // Draw vertical lines
  for (let x = 0; x < width; x += size) {
    line(x, 0, x, height);
  }

  // Draw horizontal lines
  for (let y = 0; y < height; y += size) {
    line(0, y, width, y);
  }
}

function drawBouncingBall() {
  // Background with subtle gradient
  setGradientBackground();

  // Shadow
  noStroke();
  fill(0, 0, 0, 0.1);
  ellipse(ball.x, height - 10, ball.radius * 1.5, ball.radius * 0.5);

  // Ball with shading
  drawShadedBall();

  // Physics update
  updateBallPhysics();

  // Subtle trail effect
  drawBallTrail();
}

function setGradientBackground() {
  // Create a subtle gradient background
  const c1 = isDark ? color(230, 10, 15) : color(210, 10, 100);
  const c2 = isDark ? color(250, 20, 10) : color(190, 5, 98);

  for (let y = 0; y < height; y++) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Add subtle grid
  stroke(isDark ? color(0, 0, 60, 0.05) : color(0, 0, 40, 0.05));
  strokeWeight(0.5);
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }
}

function drawShadedBall() {
  // Main ball
  fill(ball.color.h, ball.color.s, ball.color.b, ball.color.a);
  noStroke();
  ellipse(ball.x, ball.y, ball.radius * 2);

  // Highlight
  fill(ball.color.h, ball.color.s * 0.5, ball.color.b * 1.2, 0.4);
  ellipse(
    ball.x - ball.radius * 0.3,
    ball.y - ball.radius * 0.3,
    ball.radius * 0.8
  );
}

function updateBallPhysics() {
  // Apply gravity
  ball.vy += ball.gravity;

  // Update position
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Floor collision
  if (ball.y + ball.radius > height - 10) {
    ball.y = height - 10 - ball.radius;
    ball.vy *= -ball.damping;

    // Only add horizontal friction when touching the ground
    ball.vx *= 0.98;
  }

  // Wall collision
  if (ball.x + ball.radius > width) {
    ball.x = width - ball.radius;
    ball.vx *= -ball.damping;
  } else if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx *= -ball.damping;
  }
}

function drawBallTrail() {
  // Simple motion trail
  if (abs(ball.vy) > 1 || abs(ball.vx) > 1) {
    noStroke();
    for (let i = 1; i <= 5; i++) {
      const size = map(i, 1, 5, ball.radius * 1.8, ball.radius * 0.5);
      const alpha = map(i, 1, 5, 0.05, 0.01);
      fill(ball.color.h, ball.color.s, ball.color.b, alpha);
      ellipse(ball.x - ball.vx * i * 1.5, ball.y - ball.vy * i * 1.5, size * 2);
    }
  }
}

function createParticle() {
  return {
    x: random(width),
    y: random(height),
    size: random(3, 8),
    speedX: random(-1, 1),
    speedY: random(-1, 1),
    hue: random(0, 360),
    life: 255,
    lifeReduction: random(0.5, 1.5),
  };
}

function drawParticles() {
  // Subtle background
  background(isDark ? color(230, 15, 10, 0.1) : color(0, 0, 98, 0.2));

  // Draw connecting lines
  strokeWeight(0.3);
  const connectDistance = 100;

  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];

    // Connect to nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const d = dist(p1.x, p1.y, p2.x, p2.y);

      if (d < connectDistance) {
        const alpha = map(d, 0, connectDistance, 0.5, 0);
        stroke(isDark ? color(210, 70, 80, alpha) : color(210, 70, 60, alpha));
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }

    // Draw particle
    noStroke();
    fill(p1.hue, 70, isDark ? 90 : 70, map(p1.size, 3, 8, 0.4, 0.7));
    circle(p1.x, p1.y, p1.size);

    // Move particle
    p1.x += p1.speedX;
    p1.y += p1.speedY;

    // Slightly attract to mouse when moved
    if (mouseIsPressed || frameCount % 60 === 0) {
      const mouseForce = 0.05;
      const mouseDistance = dist(p1.x, p1.y, mouseX, mouseY);
      if (mouseDistance < 200) {
        p1.speedX += ((mouseX - p1.x) * mouseForce) / 100;
        p1.speedY += ((mouseY - p1.y) * mouseForce) / 100;
      }
    }

    // Apply some friction
    p1.speedX *= 0.99;
    p1.speedY *= 0.99;

    // Add some randomness
    p1.speedX += random(-0.1, 0.1);
    p1.speedY += random(-0.1, 0.1);

    // Speed limit
    const maxSpeed = 2;
    const currentSpeed = sqrt(p1.speedX * p1.speedX + p1.speedY * p1.speedY);
    if (currentSpeed > maxSpeed) {
      p1.speedX = (p1.speedX / currentSpeed) * maxSpeed;
      p1.speedY = (p1.speedY / currentSpeed) * maxSpeed;
    }

    // Wrap around screen edges
    if (p1.x < 0) p1.x = width;
    if (p1.x > width) p1.x = 0;
    if (p1.y < 0) p1.y = height;
    if (p1.y > height) p1.y = 0;
  }
}

function drawWave() {
  // Subtle dark or light background
  background(isDark ? color(230, 15, 10) : color(0, 0, 100));

  // Draw subtle grid
  stroke(isDark ? color(210, 30, 30, 0.1) : color(210, 30, 30, 0.1));
  strokeWeight(0.5);
  const gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }

  // Update wave angle
  wave.angle += wave.speed;

  // Draw multiple wave lines
  for (let waveOffset = 0; waveOffset < 3; waveOffset++) {
    drawSingleWave(waveOffset);
  }
}

function drawSingleWave(waveOffset) {
  const hue = 180 + waveOffset * 30;
  const yOffset = height * 0.5 + waveOffset * 40;
  const waveAlpha = map(waveOffset, 0, 2, 0.8, 0.3);

  noFill();
  stroke(hue, 80, isDark ? 90 : 60, waveAlpha);
  strokeWeight(3 - waveOffset);

  beginShape();
  for (let x = 0; x < width + 10; x += 10) {
    const angle = wave.angle + x * (TWO_PI / wave.period);
    const y = yOffset + sin(angle) * wave.amplitude;
    vertex(x, y);
  }
  endShape();

  // Add some particles flowing along the wave for the main wave
  if (waveOffset === 0 && frameCount % 5 === 0) {
    const particleX = random(width);
    const angle = wave.angle + particleX * (TWO_PI / wave.period);
    const particleY = yOffset + sin(angle) * wave.amplitude;

    noStroke();
    fill(hue, 80, isDark ? 90 : 70, 0.7);
    circle(particleX, particleY, 5);

    // Echo
    fill(hue, 80, isDark ? 90 : 70, 0.3);
    circle(particleX, particleY, 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - (isTopbarVisible ? 64 : 0));
  redraw();
}

function mouseMoved() {
  // Add interactivity to specific animations
  if (currentAnimation === "particles") {
    // Add subtle attraction to cursor
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const d = dist(p.x, p.y, mouseX, mouseY);
      if (d < 100) {
        const angle = atan2(mouseY - p.y, mouseX - p.x);
        const force = map(d, 0, 100, 0.3, 0);
        p.speedX += cos(angle) * force;
        p.speedY += sin(angle) * force;
      }
    }
  } else if (currentAnimation === "wave") {
    // Make wave respond to mouse Y position
    wave.amplitude = map(mouseY, 0, height, 20, 120);
  }
}
