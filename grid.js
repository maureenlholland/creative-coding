const canvasSketch = require("canvas-sketch");
// function for linear interpretation, you pass in min and max bound and "t" value
const { lerp } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  createGrid = () => {
    const points = [];
    const count = 5;
    for (let x = 0; x < count; x += 1) {
      for (let y = 0; y < count; y += 1) {
        const u = x / (count - 1); // gives roughly value between 0 and 1, depending on how close we are to either side
        const v = y / (count - 1); // same, for top bottom
        points.push([u, v]);
      }
    }
    return points;
  };

  const points = createGrid();
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach(([u, v]) => {
      // allow margin at edges
      const x = lerp(margin, width - margin, u); // scale pixel size
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 100, 0, Math.PI * 2, false);
      context.strokeStyle = "black";
      context.lineWidth = 40;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
