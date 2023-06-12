

/* Interactive 3D Model Animation */

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting to the scene
const light = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(light);
const pointLight = new THREE.PointLight(0xff0000, 1, 100); // Point light
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Load the 3D model
let face = '';

async function loadModel() {
const loader = new THREE.GLTFLoader();
const data = await loader.loadAsync('angry_octopus.glb');

// Remove loading text once the model is loaded
document.getElementById('loading').innerHTML = '';

// Add the model to the scene
face = data.scene.children[0];
scene.add(face);
}

loadModel();

// Set camera position
camera.position.z = 5;

// Animate the scene
function animate() {
requestAnimationFrame(animate);
renderer.render(scene, camera);
}
animate();

// Handle mouse movement
function onMouseMove(event) {
const mousePosition = {
x: (event.clientX / window.innerWidth) * 2 - 1,
y: -(event.clientY / window.innerHeight) * 2 + 1,
};

// Rotate the model based on mouse position
face.rotation.x = -mousePosition.y + 5;
face.rotation.z = mousePosition.x;
}
document.addEventListener('mousemove', onMouseMove);
