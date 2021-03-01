const canvasSketch = require("canvas-sketch");
// function for linear interpretation, you pass in min and max bound and "t" value
const { lerp } = require("canvas-sketch-util/math");
// deterministic randomness, to persist a random output
const random = require("canvas-sketch-util/random");
// preset color palettes in array
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  // can add a restriction to the number of random colors selected
  const colorCount = random.rangeFloor(1, 11); // note, min is inclusive, max is exclusive
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  createGrid = () => {
    const points = [];
    const count = 25;
    for (let x = 0; x < count; x += 1) {
      for (let y = 0; y < count; y += 1) {
        const u = x / (count - 1); // gives roughly value between 0 and 1, depending on how close we are to either side
        const v = y / (count - 1); // same, for top bottom
        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius: Math.abs(0.01 + random.gaussian() * 0.01), // cannot have negative gaussian value
        });
      }
    }
    return points;
  };

  random.setSeed(101);
  // introduce randomness by filtering some grid points out
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color } = data;
      const [u, v] = position;
      // allow margin at edges
      const x = lerp(margin, width - margin, u); // scale pixel size
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      // use dynamic sizing, relative to width
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
