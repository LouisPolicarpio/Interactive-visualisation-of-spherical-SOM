// scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.z = 800;

//renders
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Make Canvas Responsive
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})


// add points to scene
const geometry = new THREE.BufferGeometry();
console.log(vertices);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0x888888, size: 10 });
const points = new THREE.Points(geometry, material);
scene.add(points);



const rendering = function () {
    requestAnimationFrame(rendering);
    //scene.rotation.z -= 0.005;
    //scene.rotation.x -= 0.01;
    renderer.render(scene, camera);
}
rendering();