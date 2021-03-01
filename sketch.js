const canvasSketch = require("canvas-sketch");

const settings = {
  // default unit is pixels
  dimensions: [2048, 2048],
  // dimensions: "postcard",
  // dimensions: "A4",
  // default resolution is 72, not good for printed art
  // pixelsPerInch: 300,
  // units: 'cm',
  // orientation: "portrait",
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.beginPath();
    // angles are in radians, not degrees
    context.arc(width / 2, height / 2, width * 0.2, 0, Math.PI * 2, false);
    context.fillStyle = "blue";
    context.fill();

    context.beginPath();
    context.arc(width / 2, height / 2, width * 0.2, 0, Math.PI, false);
    context.fillStyle = "lightblue";
    context.fill();
    context.strokeStyle = "red";
    context.lineWidth = 10;
    context.stroke();
  };
};

canvasSketch(sketch, settings);
