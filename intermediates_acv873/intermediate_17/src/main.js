// External libraries
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';

// Own modules
import Television from './objects/Television.js';

// Event function
import {updateAspectRatio} from "./eventfunctions/updateAspectRatio.js";
import {calculateMousePosition} from "./eventfunctions/calculateMousePosition.js";
import {executeRaycast} from "./eventfunctions/executeRaycast.js";

function main() {
  // Scene
  window.scene = new THREE.Scene();
  window.scene.add(new THREE.AxesHelper(50));

  // Camera
  window.camera = new THREE.PerspectiveCamera( // global variable of window-object
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000);
  window.camera.position.set(-100, 100, 100); // left, up, depth
  window.camera.lookAt(0, 0, 0);

  // Renderer
  window.renderer = new THREE.WebGLRenderer({antialias: true});
  window.renderer.setSize(window.innerWidth, window.innerHeight);
  window.renderer.setClearColor(0xffffff);
  window.renderer.shadowMap.enabled = true;
  //console.log("max texture size: " + window.renderer.capabilities.maxTextureSize); // get resolution maximum for shadows (depending on gpu)

  document.getElementById("3d_content").appendChild(window.renderer.domElement);

  const television = new Television();
  television.position.set(0, 16.8, 0);
  window.scene.add(television);

  // Plane
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshLambertMaterial({color: 0xaaaaaa, wireframe: false}); // CTRL+SHIFT+A -> color-picker
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0); // euler-angle in radiant
  plane.receiveShadow = true;
  window.scene.add(plane);

  // Ambient Light; does not generate shadows, has no direction/position
  const ambientlight = new THREE.AmbientLight(0xffffff);
  ambientlight.intensity = 0.5;
  window.scene.add(ambientlight);

  // spot light; position and directional vector to target, opening angle
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 100, 100);
  spotLight.intensity = 0.8;
  spotLight.angle = THREE.MathUtils.degToRad(30);
  spotLight.penumbra = 1; // contour of shadows: 0 = hard, 1 = soft
  spotLight.target = plane;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(2048, 2048);
  spotLight.shadow.camera.aspect = 1;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 500;
  window.scene.add(spotLight);
  //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
  window.scene.add(new THREE.CameraHelper(window.camera));

  // GUI for manipulation of values
  const gui = new DAT.GUI();
  gui.add(spotLight.position, 'x', 0, 200).step(5);
  gui.add(spotLight.position, 'y', 0, 200).step(5);
  gui.add(spotLight.position, 'z', 0, 200).step(5);

  // Orbit Controls for changing the camera with mouse
  const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
  orbitControls.target = new THREE.Vector3(0, 0, 0);


  // Main Loop
  function mainLoop() {
    window.renderer.render(window.scene, window.camera);
    requestAnimationFrame(mainLoop);
  }
  mainLoop();

}
// execute main-method on window-load
window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
