// ? Imports
import "./index.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
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
// const envMap = Maploader.load(
//   "public/qwantani_sunrise_puresky.jpg" // +X
// );
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
});
const metalMaterial = new THREE.MeshPhongMaterial({
  color: 0xa2a2a2, // Base gray color
  specular: 0xffffff, // White specular highlights
  shininess: 300, // High shininess for sharp reflections
  reflectivity: 2.0, // Strong reflection effect
});
const pointLight1 = new THREE.PointLight(0xffffff, 3);
const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1); // size = 1
pointLight1.position.set(2, 0, 11);
const pointLight2 = new THREE.PointLight(0xffffff, 3);
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1); // size = 1
pointLight2.position.set(8, 0, 11);
scene.add(pointLight1, pointLight2, pointLightHelper1, pointLightHelper2);

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
const mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  // Normalize mouse coordinates to range [-1, 1]
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const loader = new GLTFLoader();
let model;
loader.load(
  "rings.glb",
  function (gltf) {
    model = gltf.scene.getObjectByName("path378");
    model.scale.set(17, 17, 17);
    model.material = metalMaterial;
    model.rotateZ(Math.PI / 2);
    model.position.y = 0;
    model.position.x = 5.5;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

window.addEventListener("resize", (event) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate() {
  requestAnimationFrame(animate);

  // Target rotation based on mouse position
  const targetRotX = mouse.y * 0.1; // tilt up/down
  const targetRotY = mouse.x * 0.1; // tilt left/right

  // Smooth interpolation (lerp)
  model.rotation.z += (-targetRotY - model.rotation.z) * 0.5;
  model.rotation.x += (-targetRotX - model.rotation.x + Math.PI / 2) * 0.1;
  // model.rotateZ(Math.PI / 2);
  renderer.render(scene, camera);
}
function moveCamera() {
  const t = window.scrollY;
  camera.position.y = t * -0.006;
}
document.body.onscroll = moveCamera;

animate();
