import * as THREE from "../node_modules/three/build/three.module.js";
let camera, scene, renderer;
const originalBoxSize = 3;
let gameStarted = false;
let stack = [];
let overhangs = [];
const boxHeight = 1;

function addLayer(x, z, width, depth, direction = "x") {
  const y = boxHeight * stack.length;
  const layer = generateBox(x, y, z, width, depth);
  layer.direction = direction;
  stack.push(layer);
}
function generateBox(x, y, z, width, depth) {
  // ThreeJS
  const geometry = new THREE.BoxGeometry(width, boxHeight, depth);
  const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);
  const material = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);
  return { threejs: mesh, width, depth };
}
function addOverhang(x, z, width, depth) {
  const y = boxHeight * (stack.length - 1);
  const overhang = generateBox(x, y, z, width, depth);
  overhangs.push(overhang);
}
window.addEventListener("click", () => {
  if (!gameStarted) {
    renderer.setAnimationLoop(animation);
    gameStarted = true;
  } else {
    const topLayer = stack[stack.length - 1];
    const previousLayer = stack[stack.length - 2];

    const direction = topLayer.direction;

    const delta =
      topLayer.threejs.position[direction] -
      previousLayer.threejs.position[direction];

    const overhangSize = Math.abs(delta);

    const size = direction == "x" ? topLayer.width : topLayer.depth;

    const overlap = size - overhangSize;

    if (overlap > 0) {
      //Cut Layer
      const newWidth = direction == "x" ? overlap : topLayer.width;
      const newDepth = direction == "z" ? overlap : topLayer.depth;
      //Update metadata
      topLayer.width = newWidth;
      topLayer.depth = newDepth;
      //Update Threejs Model
      topLayer.threejs.scale[direction] = overlap / size;
      topLayer.threejs.position[direction] -= delta / 2;

      //Overhang
      const overhangShift = (overlap / 2 + overhangSize / 2) * Math.sign(delta);
      const overhangX =
        direction == "x"
          ? topLayer.threejs.position.x + overhangShift
          : topLayer.threejs.position.x;
      const overhangZ =
        direction == "z"
          ? topLayer.threejs.position.z + overhangShift
          : topLayer.threejs.position.z;

      const overhangWidth = direction == "x" ? overhangSize : newWidth;
      const overhangDepth = direction == "z" ? overhangSize : newDepth;

      addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);

      //Next Layer
      const nextX = direction == "x" ? topLayer.threejs.position.x : -10;
      const nextZ = direction == "z" ? topLayer.threejs.position.z : -10;
      const nextDirection = direction == "x" ? "z" : "x";

      addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
    }
  }
});
// window.addEventListener("click", () => {
//   if (!gameStarted) {
//     renderer.setAnimationLoop(animation);
//     gameStarted = true;
//   } else {
//     const topLayer = stack[stack.length - 1];
//     const direction = topLayer.direction;
//     const nextX = direction == "x" ? 0 : -10;
//     const nextZ = direction == "z" ? 0 : -10;
//     const newWidth = originalBoxSize;
//     const newDepth = originalBoxSize;
//     const nextDirection = direction == "x" ? "z" : "x";
//     addLayer(nextX, nextZ, newWidth, newDepth, nextDirection);
//   }
// });
function animation() {
  const speed = 0.15;
  const topLayer = stack[stack.length - 1];
  topLayer.threejs.position[topLayer.direction] += speed;

  if (camera.position < boxHeight * (stack.length - 2) + 4) {
    camera.position.y += speed;
  }

  renderer.render(scene, camera);
}
function init() {
  //Scene
  scene = new THREE.Scene();
  // Foundation
  addLayer(0, 0, originalBoxSize, originalBoxSize);

  //First Layer
  addLayer(-10, 0, originalBoxSize, originalBoxSize, "x");

  //Setup lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 20, 0);
  scene.add(directionalLight);

  //Camera
  const width = 10;
  const heigth = width * (window.innerHeight / window.innerWidth);
  camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    heigth / 2,
    heigth / -2,
    1,
    100
  );
  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0);

  //Render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  //Add to HTML
  document.body.appendChild(renderer.domElement);
}
init();
