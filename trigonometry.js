// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const random = require("canvas-sketch-util/random");
// another thing to try is random HSL
const palettes = require("nice-color-palettes");
// https://easings.net/
const eases = require("eases");
const BezierEasing = require("bezier-easing");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

random.setSeed(359061);

const settings = {
  // need to set specific size for gif
  dimensions: [512, 512],
  // set frames per second
  fps: 24,
  // timing, in seconds
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // smooth jagged edge
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#fff", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Setup a geometry (note: setting this up OUTSIDE the loop is best for performance)
  const box = new THREE.BoxGeometry(1, 1, 1);

  const palette = ["#a70267", "#f10c49", "#fb6b41", "#f6d86b", "#339194"];

  // Setup a mesh with geometry + material
  for (let i = 0; i < 30; i += 1) {
    // create mesh from single box geometry, don't create box geometry every time
    // need standard material to respect lighting color
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      })
    );
    // position randomly note: (0, 0, 0) is point of origin
    mesh.position.set(
      random.range(-0.5, 0.5),
      random.range(-0.5, 0.5),
      random.range(-0.5, 0.5)
    );
    // scale size down, multiplies x, y, z by same number
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.3);
    // add to canvas
    scene.add(mesh);
  }

  // any space that would be black (no light), now gets an ambient color
  scene.add(new THREE.AmbientLight(0x404040));

  // (color, intensity)
  const light = new THREE.DirectionalLight("white", 1);
  // directly on top of scene
  // light.position.set(0, 4, 0);
  // directional, from z
  light.position.set(0, 0, 4);
  // light all sides
  // light.position.set(2, 2, 4);
  scene.add(light);

  // use bezier easing
  const easeFn = BezierEasing(0.95, 0.12, 0.4, 0.92);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 1.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    // playhead is only really useful when there's a duration on your loop
    render({ playhead }) {
      // scene.rotation.y = playhead;
      // scene.rotation.x = playhead;
      const t = Math.sin(playhead * Math.PI); // create easing
      // helpful visual tool: https://cubic-bezier.com/#.17,.67,.83,.67
      // scene.rotation.z = eases.expoInOut(t);
      scene.rotation.z = easeFn(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
