let t = 0;

function setup() {
    let cnv = createCanvas(500, 500);
    cnv.parent("canvas-container");
    noStroke();
}

function draw() {
  background(0);

  // Base white canvas
  fill(255);
  rect(50, 50, 400, 400);

  // Triangle 1: Top-left gray
  drawPulsingTriangle([50, 50, 250, 50, 50, 250], 0, color(170));

  // Triangle 2: Large black
  drawPulsingTriangle([50, 250, 250, 50, 250, 450], 1, color(0));

  // Triangle 3: Bottom-left white
  drawPulsingTriangle([50, 450, 150, 350, 250, 450], 2, color(255));

  // Triangle 4: Yellow
  drawPulsingTriangle([50, 450, 150, 350, 50, 250], 3, color('#F2CB05'));

  // Triangle 5: Right-center white
  drawPulsingTriangle([250, 50, 450, 50, 250, 230], 4, color(255));

  // Triangle 6: Top-right gray
  drawPulsingTriangle([270, 50, 450, 50, 450, 150], 5, color(170));

  // Triangle 7: Large red
  drawPulsingTriangle([250, 250, 450, 50, 450, 450], 6, color('#C0392B'));

  // Triangle 8: Bottom-right gray
  drawPulsingTriangle([250, 250, 450, 450, 250, 450], 7, color(200));

  t += 0.05;
}

function drawPulsingTriangle(coords, offset, col) {
  // Calculate centroid of triangle
  let cx = (coords[0] + coords[2] + coords[4]) / 3;
  let cy = (coords[1] + coords[3] + coords[5]) / 3;

  let scaleFactor = 1 + 0.025 * sin(t + offset); // Slight pulsation per triangle

  push();
  translate(cx, cy);
  scale(scaleFactor);
  translate(-cx, -cy);

  fill(col);
  triangle(...coords);
  pop();
}
