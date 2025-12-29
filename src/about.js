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
  thickness: 1, // Glass thickness
  roughness: 1, // Smooth surface
  ior: 1, // Index of refraction for glass
  attenuationDistance: 2,
  attenuationColor: 0xffffff,
});
const flatMaterial = new THREE.MeshStandardMaterial({
  color: 0x01e5c00,
  emissive: 0xffff88, // Glow color
  emissiveIntensity: 1, // Glow strength
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
const loader = new GLTFLoader();
loader.load(
  "cv-button.glb",
  function (gltf) {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh && child.name === "Cube") {
        console.log(child.name);
        // child.material = glassMaterial;
      }
    });
    model.scale.set(1, 1, 1);
    // scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, -7, 8);
light.target.position.set(0, -19, 0);
scene.add(light);

window.addEventListener("resize", (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
}
function moveCamera() {
  const t = window.scrollY;
  camera.position.y = t * -0.028;
}
document.body.onscroll = moveCamera;

animate();
