// Library import
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';
import * as TWEEN from '../../../lib/tween.js-18.6.4/dist/tween.esm.js';

// Eventfunction import
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';

// Module import
import Floor from './objects/Floor.js';
import TurntableFromFile from './objects/TurntableFromFile.js';
import Turntable from './objects/Turntable.js';
//import {MathUtil} from "../../../lib/three.js-r134/examples/jsm/libs/OimoPhysics";

function main() {

    // Scene, Camera, Renderer
    // ---
    window.scene = new THREE.Scene();
    window.scene.add(new THREE.AxesHelper(50)); // show axes

    window.camera = new THREE.PerspectiveCamera(
        45,                                       // Öffnungswinkel Kamera
        window.innerWidth / window.innerHeight, // Seitenverhältnis (wie Fenster)
        0.1,                                     // Near-Plane-Abstand
        2000                                      // Far-Plane-Abstand
    );
    // Orthographische Kamera für Abmessungen
    //window.camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 2000);
    //window.camera.position.set(-524.3720692354602, 4.927865225327892, -4.243226393111859);

    window.camera.position.set(-25, 10, 500);
    window.camera.lookAt(0, 4.927865225327892, -4.243226393111859);

    window.renderer = new THREE.WebGLRenderer({antialias: true}); // rendert die Szene
    window.renderer.setSize(window.innerWidth, window.innerHeight);         // Größe Framebuffer
    window.renderer.setClearColor(0xffffff);                                // Hintergrundfarbe
    window.renderer.shadowMap.enabled = true;                               // Schattenrendering aktivieren
    document.getElementById('3d_content').appendChild(window.renderer.domElement);

    // Controls, DAT-GUI
    // ---

    const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 0, 0);
    orbitControls.update();



    // Objects, Lights
    // ---

    // Floor
    const floor = new Floor();
    window.scene.add(floor);

    // TurntableFromFile
    let turntableFromFile = new TurntableFromFile();
    turntableFromFile.position.set(-50, 0, 0);
    //turntableFromFile.rotation.set();
    //turntableFromFile.addPhysics(); // TODO: enable when physics implemented
    window.scene.add(turntableFromFile);

    // Turntable
    const turntable = new Turntable();
    turntable.position.set(15, 0, 0);
    window.scene.add(turntable);


    //let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    //window.scene.add(ambientLight);

    // PointLight
    let pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 0);
    pointLight.castShadow = false;
    pointLight.shadow.mapSize.set(1024, 1024);
    pointLight.position.set(0, 220, -300);
    window.scene.add(pointLight);

    let spotLight = new THREE.SpotLight(0xffffff, 0.2, 0, THREE.MathUtils.degToRad(45), 1, 2);
    spotLight.position.set(-200, 200, -200);
    spotLight.target = turntableFromFile; // TODO: Set target
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.camera.aspect = 1;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 600;
    spotLight.shadow.radius = 5; // Smooth shadow
    //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera)); // Visualisierung des Shadow-Frustum
    window.scene.add(spotLight);

    const spotLight2 = spotLight.clone();
    spotLight2.position.set(-200, 200, 200);
    window.scene.add(spotLight2);

    const spotLight3 = spotLight.clone();
    spotLight3.position.set(200, 200, -200);
    window.scene.add(spotLight3);

    const spotLight4 = spotLight.clone();
    spotLight4.position.set(200, 200, 200);
    window.scene.add(spotLight4);


    const gui1 = new DAT.GUI();
    gui1.add(turntable.position, 'x', -200, 200).step(0.1);
    gui1.add(turntable.position, 'y', -200, 200).step(0.1);
    gui1.add(turntable.position, 'z', -200, 200).step(0.1);


    // Functions
    // ---
    function mainLoop() {

        window.renderer.render(window.scene, window.camera); // Rendern der Szene
        requestAnimationFrame(mainLoop); // Anfrage nächstmögliche Ausführung mainLoop(); pausiert bei Minimierung; Sync zu refresh rate Monitor
    }

    mainLoop();
}

window.onload = main; // Führt main() aus beim Laden des Fensters
window.onresize = updateAspectRatio;

