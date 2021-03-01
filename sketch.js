const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.beginPath();
    // angles are in radians, not degrees
    context.arc(width / 2, height / 2, 250, 0, Math.PI * 2, false);
    context.fillStyle = "blue";
    context.fill();

    context.beginPath();
    context.arc(width / 2, height / 2, 250, 0, Math.PI, false);
    context.fillStyle = "lightblue";
    context.fill();
    context.strokeStyle = "red";
    context.lineWidth = 10;
    context.stroke();
  };
};

canvasSketch(sketch, settings);
