function setup() {
  let cnv = createCanvas(500, 500);
  cnv.parent("canvas-container");
  noLoop();
  noStroke();

  // Black background
  background(0);

  // White canvas square
  fill(255);
  rect(50, 50, 400, 400);

  // Top-left gray triangle
  fill(170);
  triangle(50, 50, 250, 50, 50, 250);

  // Large black triangle 
  fill(0);
  triangle(50, 250, 250, 50, 250, 450);

  // Bottom left white triangle
  fill(255);
  triangle(50, 450, 150, 350, 250, 450);

  // Yellow triangle
  fill('#F2CB05');
  triangle(50, 450, 150, 350, 50, 250);

  // Right-center white triangle 
  fill(255);
  triangle(250, 50, 450, 50, 250, 230);

  // Top-right gray triangle 
  fill(170);
  triangle(270, 50, 450, 50, 450, 150); 

  // Large red triangle
  fill('#C0392B');
  triangle(250, 250, 450, 50, 450, 450);

  // Bottom-right gray triangle
  fill(200);
  triangle(250, 250, 450, 450, 250, 450);
}

