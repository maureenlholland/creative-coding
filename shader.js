const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
// glsl is what's really required, three.js not needed but can be used as well
// glslify is what allows us to work with this in javascript and import utilities
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
// IMPORTANT: must use webgl canvas
const settings = {
  context: "webgl",
  animate: true,
};

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  // to make circle aspect ratio correct, we need to pull in variable from js
  uniform float aspect;
  varying vec2 vUv;

  // every shader has to have a main function (decimal points are important so numbers are properly interpreted as floating point instead of integer)
  void main () {
    // color is R, G, B, Alpha
    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

    // vec4 means it has x, y, z, w coordinates
    // gl_FragColor = vec4(vec3(vUv.x), 1.0);

    // vec3 color = vec3(sin(time) * 1.0);
    vec3 colorA = sin(time) + vec3(1.0, 0.0, 0.0);
    vec3 colorB = vec3(0.0, 0.0, 1.0);

    // sets center to middle of screen
    vec2 center = vUv - 0.5;
    // squeeze center to meet aspect ratio
    center.x *= aspect;
    // length is the magnitude of the vector
    float dist =  length(center);
    // generally, you will want to smooth the edges, use built-in function
    // if at the low or high, use the hard values
    // if somewhere in between, use gradiant value
    float alpha = smoothstep(0.255, 0.25, dist);

    // mix is like lerp, allows you to return values between min and max range
    vec3 color = mix(colorA, colorB, vUv.x);
    // gl_FragColor = vec4(color, 1.0);
    // pixel in center is saying distance from center is 0 and will slowly increase as you move away from center
    // gl_FragColor = vec4(color, dist > 0.25 ? 0.0 : 1.0);
    // smooth the ternary to remove jagged edges
    gl_FragColor = vec4(color, alpha);
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    // set background transparent
    // clearColor: false,
    clearColor: "white",
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      // this where we pass value to shader function, must match variable name declared earlier!
      aspect: ({ width, height }) => width / height,
    },
  });
};

canvasSketch(sketch, settings);
