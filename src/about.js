// ? Imports
import "./index.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 10; // Controls zoom level
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2, // left
  (frustumSize * aspect) / 2, // right
  frustumSize / 2, // top
  frustumSize / -2, // bottom
  41, // near
  1000 // far
);
const Maploader = new THREE.CubeTextureLoader(); // Folder containing 6 images

const envMap = Maploader.load(
  "public/qwantani_sunrise_puresky.jpg" // +X
);
camera.zoom = 0.85;
camera.position.setZ(50);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color(0x121212);
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1, // Fully transmissive
  thickness: 0.5, // Glass thickness
  roughness: 0.5, // Smooth surface
  ior: 1, // Index of refraction for glass
  attenuationDistance: 2,
  attenuationColor: 0xffffff,
  envMap: envMap,
  envMapIntensity: 1.0,
});
const flatMaterial = new THREE.MeshStandardMaterial({
  color: 0x01e5c00,
  emissive: 0xffff88, // Glow color
  emissiveIntensity: 1, // Glow strength
  wireframe: true,
});
var starsMaterial = new THREE.PointsMaterial({
  size: 2,
  sizeAttenuation: true,
  transparent: true,
});
for (var i = 0; i < 20; i++) {
  var dome = new THREE.Points(
    new THREE.IcosahedronGeometry(50, 7),
    starsMaterial
  );
  dome.rotation.set(6 * Math.random(), 6 * Math.random(), 6 * Math.random());
  scene.add(dome);
}

let model;
let text;
let stones = [];
const loader = new GLTFLoader();
loader.load(
  "crystal.glb",
  function (gltf) {
    model = gltf.scene;
    model.material = glassMaterial;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = flatMaterial;
        console.log(child.name);
        stones.push(child);
      }
    });
    model.scale.set(1, 1, 1);
    stones[0].scale.set(2, 2, 2);
    stones[0].position.set(1.5, 1, -10);
    stones[0].rotation.y = 0.4;
    stones[2].scale.set(2, 2, 2);
    stones[2].position.set(8, 1 - 6);
    stones[2].rotation.y = -0.3;
    stones[1].scale.set(1.5, 1.5, 1.5);
    stones[1].position.set(1.5, 1 - 7);
    stones[1].rotation.y = -0.3;
    scene.add(stones[0], stones[1], stones[2]);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
// const light = new THREE.DirectionalLight(0xffffff, 11);
// light.position.set(1.5, 1, -5);
// light.target.position.set(0, 1, -5);
// scene.add(light, light.target);
window.addEventListener("resize", (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stones[0].rotation.z = stones[0].rotation.z + 0.008;
  stones[2].rotation.z = stones[2].rotation.z + -0.003;
  stones[1].rotation.z = stones[1].rotation.z + 0.01;
}
function moveCamera() {
  const t = window.scrollY;
  camera.position.y = t * -0.006;
  stones[0].position.y = 1 + t * 0.008;
  stones[1].position.y = -6 + t * 0.006;
  stones[2].position.y = -5 + t * 0.007;
  // light.position.set(camera.position.x, camera.position.y, camera.position.z);
}
document.body.onscroll = moveCamera;

animate();
