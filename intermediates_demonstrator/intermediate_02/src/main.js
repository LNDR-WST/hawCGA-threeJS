// Library import
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';
import * as TWEEN from '../../../lib/tween.js-18.6.4/dist/tween.esm.js';
import * as STATS from '../../../lib/three.js-r134/examples/jsm/libs/stats.module.js';



// Eventfunction import
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';
import {calculateMousePosition} from './eventfunctions/calculateMousePosition.js';
import {executeRaycast} from './eventfunctions/executeRaycast.js';
import {keyDownAction, keyUpAction} from './eventfunctions/executeKeyAction.js';

// Module import
import Floor from './objects/Floor.js';
import TurntableFromFile from './objects/TurntableFromFile.js';
import Turntable from './objects/Turntable.js';
import CabinetFromFile from "./objects/CabinetFromFile.js";
import SpeakerFromFile from "./objects/SpeakerFromFile.js";
import Physics from './physics/Physics.js';


function main() {

    // Scene, Camera, Renderer
    // ---
    window.scene = new THREE.Scene();
    window.scene.add(new THREE.AxesHelper(50)); // show axes
    //window.scene.fog = new THREE.Fog(0xa0a0a0, 400, 1000);

    window.camera = new THREE.PerspectiveCamera(
        45,                                       // Öffnungswinkel Kamera
        window.innerWidth / window.innerHeight, // Seitenverhältnis (wie Fenster)
        0.1,                                     // Near-Plane-Abstand
        2000                                      // Far-Plane-Abstand
    );

    window.camera.position.set(-16, 240, 175);
    window.camera.lookAt(0, 4.927865225327892, -4.243226393111859);

    window.renderer = new THREE.WebGLRenderer({antialias: true}); // rendert die Szene
    window.renderer.setSize(window.innerWidth, window.innerHeight);         // Größe Framebuffer
    window.renderer.setClearColor(0xb47d49);                                // Hintergrundfarbe
    window.renderer.shadowMap.enabled = true;                               // Schattenrendering aktivieren
    window.renderer.outputEncoding = THREE.sRGBEncoding;

    window.physics = new Physics(true);
    window.physics.setup(0, -200, 0, 1/120, true); // Gravity X, Y, Z; Zeitschrittweite; Boden

    document.getElementById('3d_content').appendChild(window.renderer.domElement);


    // Objects, Lights
    // ---

    // Floor
    const floor = new Floor();
    window.scene.add(floor);

    // TurntableFromFile
    let turntableFromFile = new TurntableFromFile();
    turntableFromFile.name = 'turntableFromFile';
    turntableFromFile.position.set(-33, 67.2, 0);
    //turntableFromFile.rotation.set();
    //turntableFromFile.addPhysics(); // TODO: enable when physics implemented
    window.scene.add(turntableFromFile);

    // Turntable
    const turntable = new Turntable();
    turntable.name = 'turntable';
    turntable.position.set(33, 67.2, 0);
    window.scene.add(turntable);

    // Cabinet
    const cabinet = new CabinetFromFile();
    cabinet.scale.set(1.6, 1.6, 1.6);
    cabinet.rotateY(180*Math.PI/180);
    cabinet.position.set(0, 33.112442475226764,34);
    window.scene.add(cabinet);

    // Speaker
    const speakerLeft = new SpeakerFromFile();
    speakerLeft.scale.set(20, 20, 20);
    speakerLeft.rotateY(105*Math.PI/180);
    speakerLeft.position.set(-93, 92.1, 0);
    //speakerLeft.add(positionalAudio);
    window.scene.add(speakerLeft);

    const speakerRight = speakerLeft.clone();
    speakerRight.rotateY(-30*Math.PI/180);
    speakerRight.position.set(88, 92.1, 0);
    //speakerRight.add(positionalAudio);
    window.scene.add(speakerRight);

    // Lights

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    window.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.2);
    hemiLight.position.set( 0, 200, 0 );
    window.scene.add( hemiLight );

    let pointLight = new THREE.PointLight(0xffffff, 0.4, 0, 0);
    pointLight.castShadow = false;
    pointLight.shadow.mapSize.set(2048, 2048);
    pointLight.position.set(0, 220, -300);
    window.scene.add(pointLight);

    let spotLight = new THREE.SpotLight(0xddddff, 0.2, 0, THREE.MathUtils.degToRad(45), 1, 2);
    spotLight.position.set(-200, 200, -200);
    spotLight.target = turntable; // TODO: Set target
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.shadow.camera.aspect = 1;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 600;
    spotLight.shadow.radius = 5; // Smooth shadow
    //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera)); // Visualisierung des Shadow-Frustum
    //window.scene.add(spotLight);

    const spotLight2 = spotLight.clone();
    spotLight2.position.set(-200, 200, 200);
    window.scene.add(spotLight2);

    const spotLight3 = spotLight.clone();
    spotLight3.position.set(200, 200, -200);
    window.scene.add(spotLight3);

    const spotLight4 = spotLight.clone();
    spotLight4.position.set(200, 200, 200);
    window.scene.add(spotLight4);

    // const spotLight5 = spotLight.clone();
    // spotLight5.position.set(0, 200, 200);
    // window.scene.add(spotLight5);
    //
    // const spotLight6 = spotLight.clone();
    // spotLight6.position.set(0, 200, -200);
    // window.scene.add(spotLight6);
    //
    // const spotLight7 = spotLight.clone();
    // spotLight7.position.set(-200, 200, 0);
    // window.scene.add(spotLight7);
    //
    // const spotLight8 = spotLight.clone();
    // spotLight8.position.set(200, 200, 0);
    // window.scene.add(spotLight8);


    // Controls, Stats, DAT-GUI
    // ------------------------

    const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 0, 0);
    orbitControls.minDistance = 0.5;
    orbitControls.maxDistance = 1000;
    orbitControls.update();

    const gui1 = new DAT.GUI();
    gui1.add(spotLight.shadow.camera, 'near', 0, 100).step(1);
    gui1.add(spotLight.shadow.camera, 'far', 0, 1000).step(1);

    const stats = new STATS.default();
    document.body.appendChild(stats.dom);
    stats.showPanel(0);
    stats.name = 'stats';


    const clock = new THREE.Clock();

    // Functions
    // ---
    function mainLoop() {

        const delta = clock.getDelta();

        TWEEN.update();
        if (turntableFromFile.animationMixer !== null) {
            turntableFromFile.animationMixer.update(delta);
        }

        stats.update();

        window.physics.update(delta);

        window.renderer.render(window.scene, window.camera); // Rendern der Szene
        requestAnimationFrame(mainLoop); // Anfrage nächstmögliche Ausführung mainLoop(); pausiert bei Minimierung; Sync zu refresh rate Monitor
    }

    mainLoop();

}
window.stopAllTweens = function() {
    const tweens = TWEEN.getAll();
    if (tweens.length > 0) {
        for (const tween of tweens) {
            tween.stop();
        }
    }
};
window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
window.onkeydown = keyDownAction;
window.onkeyup = keyUpAction;


