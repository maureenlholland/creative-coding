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

  // a way to import the noise module
  #pragma glslify: noise = require('glsl-noise/simplex/3d'); 
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb'); 

  // every shader has to have a main function (decimal points are important so numbers are properly interpreted as floating point instead of integer)
  void main () {
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

    // add noise
    float n = noise(vec3(vUv.xy * 1.0, time * 0.2));
    // add color
    vec3 color = hsl2rgb(
      0.8 + n * 0.2,
      0.5,
      0.5
    );
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
