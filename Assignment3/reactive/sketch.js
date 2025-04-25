let rotationStep = 0; // 0, 1, 2, 3 → corresponds to 0°, 90°, 180°, 270°
let triangles = [];

function setup() {
  let cnv = createCanvas(500, 500);
  cnv.parent("canvas-container");
  noStroke();

  // Define triangles (same as your layout)
  triangles = [
    { coords: [50, 50, 250, 50, 50, 250], color: color(170) },
    { coords: [50, 250, 250, 50, 250, 450], color: color(0) },
    { coords: [50, 450, 150, 350, 250, 450], color: color(255) },
    { coords: [50, 450, 150, 350, 50, 250], color: color('#F2CB05') },
    { coords: [250, 50, 450, 50, 250, 230], color: color(255) },
    { coords: [270, 50, 450, 50, 450, 150], color: color(170) },
    { coords: [250, 250, 450, 50, 450, 450], color: color('#C0392B') },
    { coords: [250, 250, 450, 450, 250, 450], color: color(200) }
  ];
}

function draw() {
  background(0);

  // Rotate the entire canvas around center
  push();
  translate(width / 2, height / 2);
  rotate(HALF_PI * rotationStep); // 90°, 180°, etc
  translate(-width / 2, -height / 2);

  // White canvas
  fill(255);
  rect(50, 50, 400, 400);

  // Draw triangles
  for (let tri of triangles) {
    fill(tri.color);
    triangle(...tri.coords);
  }

  pop();
}

// Handle mouse wheel event for rotating
function mouseWheel(event) {
  // If scrolling down, rotate clockwise (increase rotationStep)
  if (event.delta > 0) {
    rotationStep = (rotationStep + 1) % 4; // Loop through 0 → 3
  }
  // If scrolling up, rotate counterclockwise (decrease rotationStep)
  else {
    rotationStep = (rotationStep - 1 + 4) % 4; // Loop through 3 → 0
  }
}
