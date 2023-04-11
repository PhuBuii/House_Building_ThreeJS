import * as THREE from "../node_modules/three/build/three.module.js";
//Scene
const scene = new THREE.Scene();

// Add a cube to the scene
const geometry = new THREE.BoxGeometry(3, 1, 3); //(D,C,R)
const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
scene.add(mesh);

//Setup lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 20, 0);
scene.add(directionalLight);

//Camera
const width = 10;
const heigth = width * (window.innerHeight / window.innerWidth);
const camera = new THREE.OrthographicCamera(
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
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

//Add to HTML
document.body.appendChild(renderer.domElement);
//Animated
function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.y -= 0.01;

  renderer.render(scene, camera);
}
animate();
