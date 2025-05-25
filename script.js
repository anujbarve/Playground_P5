// Animation state
let currentAnimation = "cnn";
let isDark = true;
let isTopbarVisible = true;

// FPS calculation variables
let frameRateValue = 0;
let lastFpsUpdateTime = 0;

const colorObject = {
  brightBlue: { h: 220, s: 80, b: 90, a: 1.0 },
  vibrantMagenta: { h: 330, s: 70, b: 100, a: 1.0 },
  warmYellow: { h: 50, s: 100, b: 90, a: 1.0 },
  springGreen: { h: 120, s: 60, b: 80, a: 1.0 },
  redOrange: { h: 20, s: 90, b: 100, a: 1.0 },
  brightCyan: { h: 180, s: 60, b: 100, a: 1.0 },
  deepPurple: { h: 280, s: 70, b: 85, a: 1.0 },
  limeGreen: { h: 90, s: 70, b: 100, a: 1.0 },
  lightGray: { h: 0, s: 0, b: 90, a: 1.0 },
  sunsetOrange: { h: 30, s: 100, b: 100, a: 1.0 },
};

// Animation descriptions for info panel
const animationInfo = {
  cnn: {
    title: "CNN",
    description: "Convolutional Neural Network",
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
    case "cnn":
      drawCNN();
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
  textAlign(RIGHT, BOTTOM);

  const fpsText = `${frameRateValue.toFixed(1)} FPS`;
  const coordsText = `(${mouseX}, ${mouseY})`;

  // Draw FPS at bottom right with some padding from right edge
  text(fpsText, width - 10, height - 10);

  // Draw mouse coordinates left of the FPS text, with some spacing
  const fpsWidth = textWidth(fpsText);
  textAlign(RIGHT, BOTTOM);
  text(coordsText, width - 20 - fpsWidth, height - 10);
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

function drawCNN() {
  setGradientBackground();

  rectMode(CENTER);

  stroke(
    colorObject.brightCyan.h,
    colorObject.brightCyan.s,
    colorObject.brightCyan.b,
    colorObject.brightCyan.a
  );

  fill(
    colorObject.brightCyan.h,
    colorObject.brightCyan.s,
    colorObject.brightCyan.b,
    colorObject.brightCyan.a
  );

  line(100, 400, 300, 400);

  rect(100, 400, 100, 100);

  fill("white");
  text("Input Image",50,500);

  fill(
    colorObject.deepPurple.h,
    colorObject.deepPurple.s,
    colorObject.deepPurple.b,
    colorObject.deepPurple.a
  );

  line(300, 400, 500, 400);

  rect(290, 390, 100, 100);
  rect(300, 400, 100, 100);
  rect(310, 410, 100, 100);

  fill("white");
  text("Convolution \n + Activation",250,500);

  fill(
    colorObject.brightBlue.h,
    colorObject.brightBlue.s,
    colorObject.brightBlue.b,
    colorObject.brightBlue.a
  );

  line(500, 400, 800, 100);
  line(500, 400, 800, 300);
  line(500, 400, 800, 500);
  line(500, 400, 800, 700);

  rect(490, 390, 100, 100);
  rect(500, 400, 100, 100);
  rect(510, 410, 100, 100);

  fill("white");
  text("Pooling",450,500);

  fill(
    colorObject.lightGray.h,
    colorObject.lightGray.s,
    colorObject.lightGray.b,
    colorObject.lightGray.a
  );

  line(800, 100, 1000, 200);
  line(800, 100, 1000, 400);
  line(800, 100, 1000, 600);

  line(800, 300, 1000, 200);
  line(800, 300, 1000, 400);
  line(800, 300, 1000, 600);

  line(800, 500, 1000, 200);
  line(800, 500, 1000, 400);
  line(800, 500, 1000, 600);

  line(800, 700, 1000, 200);
  line(800, 700, 1000, 400);
  line(800, 700, 1000, 600);

  ellipse(800, 100, 100);
  ellipse(800, 300, 100);
  ellipse(800, 500, 100);
  ellipse(800, 700, 100);

  fill("white");
  text("Flatten",800,800);

  fill(
    colorObject.limeGreen.h,
    colorObject.limeGreen.s,
    colorObject.limeGreen.b,
    colorObject.limeGreen.a
  );

  line(1000, 200, 1200, 400);
  line(1000, 400, 1200, 400);
  line(1000, 600, 1200, 400);

  ellipse(1000, 200, 100);
  ellipse(1000, 400, 100);
  ellipse(1000, 600, 100);

  fill("white");
  text("Fully Connected",1000,700);

  fill(
    colorObject.lightGray.h,
    colorObject.lightGray.s,
    colorObject.lightGray.b,
    colorObject.lightGray.a
  );

  ellipse(1200, 400, 100);
    fill("white");
  text("Output",1200,500);
  
}

function movingLine(x1,y1,x2,y2)
{
  
  const interval = 10;

  for(let i = 100; i < 1000; i = i + 10)
  {
    strokeWeight(2);
    point(i,200);
  }

  for(let i = 100; i < 1000; i = i + 10)
  {
    strokeWeight(2);
    point(i,200);
  }


  line(x1,y1,x2,y2);
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
  const gridSize = 50;
  for (let x = 0; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSize) {
    line(0, y, width, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - (isTopbarVisible ? 64 : 0));
  redraw();
}
