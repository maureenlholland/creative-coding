const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
const glsl = require("glslify");

// shader is a small program meant to do a single task really well
// uses GLSL (a bit more like C, need to specify variable types)
// shader runs on every single pixel to decide how to color each square
// always starts with float
// then inputs: varying (coordinate or value from webgl, changes)
//    - vec2 (2 vectors)
//    - vUv (like x, y coordinates)
// then variables from js: uniform (always the same)
// then function to create shader
// NOTE: in webgl, top is 1 instead of 0 on coordinate system

// Setup our sketch
const settings = {
  context: "webgl",
  animate: true,
};

// Your glsl code
const frag = glsl(`
  precision highp float;

  uniform float time;
  varying vec2 vUv;

  void main () {
    vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
    gl_FragColor = vec4(color, 1.0);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
    },
  });
};

canvasSketch(sketch, settings);
