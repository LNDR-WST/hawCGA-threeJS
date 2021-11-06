// External libraries
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';

function main() {
  // Scene
  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(20));

  // Camera
  window.camera = new THREE.PerspectiveCamera( // global variable of window-object
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
  window.camera.position.set(30, 40, 50);
  window.camera.lookAt(0, 0, 0);

  // Renderer
  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  // Geometry
  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-5, 3, 5);
  window.scene.add(cube);

  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: false});
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(10, 5, -5);
  window.scene.add(sphere);

  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa, wireframe: false}); // CTRL+SHIFT+A -> color-picker
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0); // euler-angle in radiant
  window.scene.add(plane);

  // ambient light; does not throw shadows, has no direction/position
  let ambientlight = new THREE.AmbientLight(0xffffff);
  ambientlight.intensity = 0.5;
  window.scene.add(ambientlight);

  // directional light; position and directional vector to target
  let directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(15, 20, 20);
  directionalLight.intensity = 0.5;
  directionalLight.target = plane;
  window.scene.add(directionalLight);

  let gui = new DAT.GUI();
  gui.add(directionalLight.position, 'x', -50, 50);
  gui.add(directionalLight.position, 'y', -50, 50);
  gui.add(directionalLight.position, 'z', -50, 50);



  // Main Loop
  function mainLoop() {
    window.renderer.render(window.scene, window.camera);

    requestAnimationFrame(mainLoop);
  }
  mainLoop();
}

// execute main-method on window-load
window.onload = main;