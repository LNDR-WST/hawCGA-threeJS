// External libraries
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';

// Event function
import {updateAspectRatio} from "./eventfunctions/updateAspectRatio.js";

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
  window.renderer.shadowMap.enabled = true;
  console.log("max texture size: " + window.renderer.capabilities.maxTextureSize); // get resolution maximum for shadows (depending on gpu)

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  // Geometry
  let cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
  let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(-5, 3, 5);
  cube.castShadow = true;
  // window.scene.add(cube);

  // Sphere
  let sphereGeometry = new THREE.SphereGeometry(5, 10, 10);
  let sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0000ff, wireframe: false});
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(10, 5, -5);
  sphere.castShadow = true;
  // window.scene.add(sphere);

  // Group-Object
  let cubeSphereGroup = new THREE.Group();
  cubeSphereGroup.add(cube);
  cubeSphereGroup.add(sphere);
  window.scene.add(cubeSphereGroup);

  // Plane
  let planeGeometry = new THREE.PlaneGeometry(40, 40);
  let planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa, wireframe: false}); // CTRL+SHIFT+A -> color-picker
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0); // euler-angle in radiant
  plane.receiveShadow = true;
  window.scene.add(plane);

  // Ambient Light; does not generate shadows, has no direction/position
  let ambientlight = new THREE.AmbientLight(0xffffff);
  ambientlight.intensity = 0.5;
  window.scene.add(ambientlight);

  // spot light; position and directional vector to target, opening angle
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(15, 20, 20);
  spotLight.intensity = 0.8;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1; // contour of shadows: 0 = hard, 1 = soft
  spotLight.target = plane;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 40;
  window.scene.add(spotLight);
  window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(new THREE.CameraHelper(window.camera));

  // GUI for manipulation of values
  let gui = new DAT.GUI();
  gui.add(spotLight.position, 'x', -50, 50);
  gui.add(spotLight.position, 'y', -50, 50);
  gui.add(spotLight.position, 'z', -50, 50);
  gui.add(cubeSphereGroup.position, 'x', -50, 50).step(5);
  gui.add(cubeSphereGroup.position, 'y', -50, 50).step(5);
  gui.add(cubeSphereGroup.position, 'z', -50, 50).step(5);

  // Orbit Controls for changing the camera with mouse
  let orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
  orbitControls.target = new THREE.Vector3(0, 0, 0);


  // Main Loop
  function mainLoop() {
    window.renderer.render(window.scene, window.camera);
    requestAnimationFrame(mainLoop);
  }
  mainLoop();

  window.onresize = updateAspectRatio;
}

// execute main-method on window-load
window.onload = main;