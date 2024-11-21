import "./style.css";

import * as THREE from "three";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
const loader = new RGBELoader();
loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_clear_night_1k.hdr",
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture; // Set the environment map
    // Optional: Set the background to the HDRI
  }
);

// Create the renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Set device pixel ratio

// ... existing code ...

// Load HDRI environment map

// ... existing code ...
const radius = 1.5;
const segmanet = 64;
const orbitRadius = 3;

const textures = [
  "./csilla/color.png",
  "./earth/map.jpg",
  "./venus/map.jpg",
  "./volcanic/color.png",
];
const spheres = new THREE.Group();

const bigSphereRadius = 10; // Set the radius for the big sphere
const starTextureLoader = new THREE.TextureLoader();
const starTexture = starTextureLoader.load("./stars.jpg"); // Load your star texture

const bigSphereGeometry = new THREE.SphereGeometry(bigSphereRadius, 64, 64); // Create a sphere geometry
const bigSphereMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,
  opacity: 0.3,
  side: THREE.BackSide,
}); // Create a material with the star texture
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial); // Create a mesh with geometry and material

// Position the big sphere
bigSphere.position.set(0, 0, 0); // Center it in the scene
scene.add(bigSphere); // Add the big sphere to the scene

const sphereMesh =[]

for (let i = 0; i < 4; i++) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;

  const geometry = new THREE.SphereGeometry(radius, segmanet, segmanet); // Create a sphere geometry
  const material = new THREE.MeshStandardMaterial({ map: texture }); // Create a basic material
  const sphere = new THREE.Mesh(geometry, material); // Create a mesh with geometry and material
  // Add the sphere to the scene
sphereMesh.push(sphere)

  // Create a texture loader

  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);
  spheres.add(sphere);
}
spheres.rotation.x = 0.1;
spheres.position.y = -0.8;
scene.add(spheres);


window.addEventListener("resize", () => {
  // Update camera aspect ratio and renderer size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
camera.position.z = 9;


let lastWheelTime = 0;
const thorttelDelay = 2000;
let scrollCount = 0;

function throttelWheelHandler(e) {
  const currenTime = Date.now();
  if (currenTime - lastWheelTime >= thorttelDelay) {
    lastWheelTime = currenTime;
    const direction = e.deltaY > 0 ? "down" : "up";
    const heading = document.querySelectorAll(".headings");
    scrollCount = (scrollCount + 1) % 4;

    gsap.to(heading, {
      duration: 1,
      y: `-=${100}%`,
      ease: "power2.inOut",
    });
    gsap.to(spheres.rotation,{
      duration:1,
      y:`-=${Math.PI/2}%`,
      ease:"power2.inOut"


    })
    if (scrollCount===0){
      gsap.to(heading, {
        duration:1,
        y:`0`,
        ease:"power2.inOut"
      })
    }
  }
}
window.addEventListener("wheel", throttelWheelHandler);

// ... existing code ...

// Animation loop
const clock = new THREE.Clock()


function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i< sphereMesh.length; i++){
    const sphere = sphereMesh[i];
    sphere.rotation.y = clock.getElapsedTime()*0.01;
  }

  renderer.render(scene, camera);
}
animate();

// ... existing code ...
