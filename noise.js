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

// keep track of the random seed for what styles you like
// random.setSeed(random.getRandomSeed());
// console.log(random.getSeed());

random.setSeed(136384);

const sketch = () => {
  // can add a restriction to the number of random colors selected
  const palette = random.pick(palettes).slice(0, 2);
  createGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x += 1) {
      for (let y = 0; y < count; y += 1) {
        const u = x / (count - 1); // gives roughly value between 0 and 1, depending on how close we are to either side
        const v = y / (count - 1); // same, for top bottom
        const radius = Math.abs(random.noise2D(u, v)) * 0.2; // multiply by smaller value to see more content
        points.push({
          color: random.pick(palette),
          position: [u, v],
          radius,
          rotation: Math.abs(random.noise2D(u, v)),
        });
      }
    }
    return points;
  };

  // introduce randomness by filtering some grid points out
  const points = createGrid().filter(() => random.value() > 0.3);
  const margin = 200;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;
      // allow margin at edges
      const x = lerp(margin, width - margin, u); // scale pixel size
      const y = lerp(margin, height - margin, v);

      // text drawings
      // save initial state so you can return to it after doing stuff
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px Times New Roman`;
      // default rotates from top left, we move "top left" to mean point of text drawing
      context.translate(x, y);
      // then rotate
      context.rotate(rotation);
      // can use 0, 0 here because we are already at point of coordinates
      context.fillText("?", 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
