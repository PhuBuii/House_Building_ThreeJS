import * as THREE from "../node_modules/three/build/three.module.js";
let s, l, h;
s = Math.floor(Math.random() * 50) + 25;
l = Math.floor(Math.random() * 50) + 30;
h = Math.floor(Math.random() * 100) + 1;
let block_width = 3;
let depth =3;
const heightBase = 0.4;
const heightMiddle = 0.2;
const heightTop = 0.4;
let basemove = -0.01;
let topmove =0.01;
//Scene
const scene = new THREE.Scene();

// Add a cube to the scene
// const geometry = new THREE.BoxGeometry(3, 1, 3); //(D,C,R)
// const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00 });
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(0, 0, 0);

const color = new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
var baseCakeGeo = new THREE.BoxGeometry(block_width, heightBase, depth); //Add base for cake mesh
var baseCakeMat = new THREE.MeshLambertMaterial({ color: 0xab6f23 }); //Add material
var baseCake = new THREE.Mesh(baseCakeGeo, baseCakeMat); //Create Mesh
baseCake.castShadow = true; //Cast shadows
baseCake.position.y = 0; //Postion base on top of plane

var midLayerCakeGeo = new THREE.BoxGeometry(block_width, heightMiddle, depth); //Add middle layer for cake mesh
var midLayerCakeMat = new THREE.MeshLambertMaterial({ color: 0xffffff }); //Add material
var midLayerCake = new THREE.Mesh(midLayerCakeGeo, midLayerCakeMat); //Create Mesh
midLayerCake.position.y = 0.3; //Postion layer on top of base

let flavourColour = color;
var topLayerCakeGeo = new THREE.BoxGeometry(block_width, heightTop, depth); //Add top layer for cake mesh
var topLayerCakeMat = new THREE.MeshLambertMaterial({ color: flavourColour }); //Add material
var topLayerCake = new THREE.Mesh(topLayerCakeGeo, topLayerCakeMat); //Create Mesh
topLayerCake.receiveShadow = true; //Receive shadows
topLayerCake.position.y = 0.6; //Postion layer on top of middle layer

var Cake = new THREE.Group();
Cake.add(baseCake, midLayerCake, topLayerCake);
Cake.position.set(0, 0, 0);

scene.add(Cake);

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

  Cake.rotation.y -= 0.005;
  baseCake.position.y +=basemove;
  if(baseCake.position.y <= -0.5){
    basemove = 0.01;
    baseCake.position.y +=basemove;
  }
  if(baseCake.position.y >=0){
    basemove = -0.01;
    baseCake.position.y +=basemove;
  }

  topLayerCake.position.y +=topmove;
  if(topLayerCake.position.y>= 1.5){
    topmove = -0.01;
    topLayerCake.position.y +=topmove;
  }
  if(topLayerCake.position.y <= 0.6){
    topmove = 0.01;
    topLayerCake.position.y +=topmove;
  }

  renderer.render(scene, camera);
}
animate();
