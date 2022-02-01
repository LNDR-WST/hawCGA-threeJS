// Library import
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';
import * as TWEEN from '../../../lib/tween.js-18.6.4/dist/tween.esm.js';
import * as STATS from '../../../lib/three.js-r134/examples/jsm/libs/stats.module.js';
import { PositionalAudioHelper } from '../../../lib/three.js-r134/examples/jsm/helpers/PositionalAudioHelper.js';

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
    //window.scene.add(new THREE.AxesHelper(50)); // show axes
    //window.scene.fog = new THREE.Fog(0xa0a0a0, 400, 1000);

    window.camera = new THREE.PerspectiveCamera(
        45,                                       // Öffnungswinkel Kamera
        window.innerWidth / window.innerHeight, // Seitenverhältnis (wie Fenster)
        0.1,                                     // Near-Plane-Abstand
        2000                                      // Far-Plane-Abstand
    );
    window.camera.position.set(0, 180, 350);
    window.camera.lookAt(0, 60, 0);
    window.camera.focalLength = 50;
    const listener = new THREE.AudioListener();
    window.camera.add(listener);

    window.renderer = new THREE.WebGLRenderer({antialias: true}); // rendert die Szene
    window.renderer.setSize(window.innerWidth, window.innerHeight);         // Größe Framebuffer
    window.renderer.setClearColor(0xb47d49);                                // Hintergrundfarbe
    window.renderer.shadowMap.enabled = true;                               // Schattenrendering aktivieren
    window.renderer.outputEncoding = THREE.sRGBEncoding;

    window.physics = new Physics(false);
    window.physics.setup(0, -240, 0, 1/256, true); // Gravity X, Y, Z; Zeitschrittweite (Integrationsschritte); Boden

    document.getElementById('3d_content').appendChild(window.renderer.domElement);

    // Objects, Lights
    // ---

    // Floor
    const floor = new Floor();
    window.scene.add(floor);

    // Speaker
    const soundTurntable_R = new THREE.PositionalAudio(listener);
    const soundTurntable_L = new THREE.PositionalAudio(listener);
    const cracklingT_R = new THREE.PositionalAudio(listener);
    const cracklingT_L = new THREE.PositionalAudio(listener);

    const soundTurntableFF_R = new THREE.PositionalAudio(listener);
    const soundTurntableFF_L = new THREE.PositionalAudio(listener);
    const cracklingTFF_R = new THREE.PositionalAudio(listener);
    const cracklingTFF_L = new THREE.PositionalAudio(listener);

    const positionalAudioList = [
        soundTurntable_R,
        soundTurntable_L,
        cracklingT_R,
        cracklingT_L,
        soundTurntableFF_R,
        soundTurntableFF_L,
        cracklingTFF_R,
        cracklingTFF_L];

    for (const audio of positionalAudioList) {
        audio.setDirectionalCone(160, 180, 0.1);
        audio.rotateY(-Math.PI/2);

        //const helper = new PositionalAudioHelper(audio, 2 );
        //audio.add(helper);
    }

    const audioLoaderT = new THREE.AudioLoader();
    const audioLoaderTFF = new THREE.AudioLoader();

    audioLoaderT.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntable_L.setBuffer( buffer );
        soundTurntable_L.setRefDistance(20);
        soundTurntable_L.setLoop(false);
        soundTurntable_L.setVolume(1);
    });
    audioLoaderT.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntable_R.setBuffer( buffer );
        soundTurntable_R.setRefDistance(20);
        soundTurntable_R.setLoop(false);
        soundTurntable_R.setVolume(1);
    });
    audioLoaderT.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingT_L.setBuffer( buffer );
        cracklingT_L.setRefDistance(20);
        cracklingT_L.setLoop(true);
        cracklingT_L.setVolume(0.5);
    });
    audioLoaderT.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingT_R.setBuffer( buffer );
        cracklingT_R.setRefDistance(20);
        cracklingT_R.setLoop(true);
        cracklingT_R.setVolume(0.5);
    });

    audioLoaderTFF.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntableFF_L.setBuffer( buffer );
        soundTurntableFF_L.setRefDistance(20);
        soundTurntableFF_L.setLoop(false);
        soundTurntableFF_L.setVolume(1);
    });
    audioLoaderTFF.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntableFF_R.setBuffer( buffer );
        soundTurntableFF_R.setRefDistance(20);
        soundTurntableFF_R.setLoop(false);
        soundTurntableFF_R.setVolume(1);
    });
    audioLoaderTFF.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingTFF_L.setBuffer( buffer );
        cracklingTFF_L.setRefDistance(20);
        cracklingTFF_L.setLoop(true);
        cracklingTFF_L.setVolume(0.5);
    });
    audioLoaderTFF.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingTFF_R.setBuffer( buffer );
        cracklingTFF_R.setRefDistance(20);
        cracklingTFF_R.setLoop(true);
        cracklingTFF_R.setVolume(0.5);
    });

    const speakerLeft = new SpeakerFromFile(soundTurntable_L, soundTurntableFF_L, cracklingT_L, cracklingTFF_L);
    speakerLeft.scale.set(20, 20, 20);
    speakerLeft.rotateY(105*Math.PI/180);
    speakerLeft.position.set(-91, 91.7, 0);
    speakerLeft.addPhysics();
    window.scene.add(speakerLeft);

    const speakerRight = new SpeakerFromFile(soundTurntable_R, soundTurntableFF_R, cracklingT_R, cracklingTFF_R);
    speakerRight.scale.set(20, 20, 20);
    speakerRight.rotateY(75*Math.PI/180);
    speakerRight.position.set(90, 91.7, 0);
    speakerRight.addPhysics();
    window.scene.add(speakerRight);

    // TurntableFromFile
    let turntableFromFile = new TurntableFromFile(speakerLeft, speakerRight);
    turntableFromFile.name = 'turntableFromFile';
    turntableFromFile.position.set(-33, 66.8, 0);
    //turntableFromFile.rotation.set();
    turntableFromFile.addPhysics();
    window.scene.add(turntableFromFile);

    // Turntable
    const turntable = new Turntable(speakerLeft, speakerRight);
    turntable.name = 'turntable';
    turntable.position.set(33, 66.8, 0);
    turntable.addPhysics();
    window.scene.add(turntable);

    // Cabinet
    const cabinet = new CabinetFromFile();
    cabinet.name = 'cabinet';
    cabinet.scale.set(0.8, 0.8, 0.8);
    cabinet.position.set(-4, 0,5);
    cabinet.addPhysics();
    window.scene.add(cabinet);


    // Lights
    //
    let pointLight = new THREE.PointLight(0xfff8d3, 0.3, 0, 0);
    pointLight.castShadow = false;
    pointLight.shadow.mapSize.set(2048, 2048);
    pointLight.position.set(0, 320, 0);
    window.scene.add(pointLight);

    let spotLight = new THREE.SpotLight(0xfff8d3, 0.3, 0, THREE.MathUtils.degToRad(45), 1, 2);
    spotLight.position.set(-100, 200, 100);
    spotLight.target = turntable;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.shadow.camera.aspect = 1;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 600;
    spotLight.shadow.radius = 5; // Smooth shadow
    window.scene.add(spotLight);

    const spotLight2 = spotLight.clone();
    spotLight2.position.set(100, 200, 100);
    spotLight2.target = turntableFromFile;
    window.scene.add(spotLight2);

    const spotLight3 = spotLight.clone();
    spotLight3.position.set(0, 200, -200);
    spotLight3.target = cabinet;
    window.scene.add(spotLight3);

    //window.scene.add(new THREE.CameraHelper(spotLight.shadow.camera), new THREE.CameraHelper(spotLight2.shadow.camera),  new THREE.CameraHelper(spotLight3.shadow.camera)); // Visualisierung des Shadow-Frustum


    // Controls, Stats, DAT-GUI
    // ------------------------
    window.balls = [];
    window.ballBodies = [];

    const API_LIGHT = {
        r: spotLight.color.r,
        g: spotLight.color.g,
        b: spotLight.color.b,
        intensitySpot: spotLight.intensity,
        intensityPoint: pointLight.intensity
    };

    const API_GENERAL = {
        dispose: function (){
            for (const ballbody of window.physics.ballbodies) {
                window.physics.world.removeBody(ballbody);
            }
            for (const ball of window.physics.balls) {
                window.scene.remove(ball);
            }
            window.physics.ballbodies = [];
            window.physics.balls = [];
        }
    };

    const gui = new DAT.GUI();
    const lightGUI = gui.addFolder("Light Color");
    lightGUI.open();

    lightGUI.add(API_LIGHT, 'r', 0, 1).step(1/255).name("R").onChange((value) => {
        pointLight.color.setRGB(value, API_LIGHT.g, API_LIGHT.b);
        spotLight.color.setRGB(value, API_LIGHT.g, API_LIGHT.b);
        spotLight2.color.setRGB(value, API_LIGHT.g, API_LIGHT.b);
        spotLight3.color.setRGB(value, API_LIGHT.g, API_LIGHT.b);
    });
    lightGUI.add(API_LIGHT, 'g', 0, 1).step(1/255).name("G").onChange((value) => {
        pointLight.color.setRGB(API_LIGHT.r, value, API_LIGHT.b);
        spotLight.color.setRGB(API_LIGHT.r, value, API_LIGHT.b);
        spotLight2.color.setRGB(API_LIGHT.r, value, API_LIGHT.b);
        spotLight3.color.setRGB(API_LIGHT.r, value, API_LIGHT.b);
    });
    lightGUI.add(API_LIGHT, 'b', 0, 1).step(1/255).name("B").onChange((value) => {
        pointLight.color.setRGB(API_LIGHT.r, API_LIGHT.g, value);
        spotLight.color.setRGB(API_LIGHT.r, API_LIGHT.g, value);
        spotLight2.color.setRGB(API_LIGHT.r, API_LIGHT.g, value);
        spotLight3.color.setRGB(API_LIGHT.r, API_LIGHT.g, value);
    });

    const spotlightGUI = gui.addFolder("Light Intensity");
    spotlightGUI.open();
    spotlightGUI.add(API_LIGHT, 'intensitySpot', 0, 1).step(0.05).name("Spotlights").onChange((value) => {
        spotLight.intensity = value;
        spotLight2.intensity = value;
        spotLight3.intensity = value;
    });
    spotlightGUI.add(API_LIGHT, 'intensityPoint', 0, 1).step(0.05).name("Pointlight").onChange((value) => {
        pointLight.intensity = value;
    });

    const generalGUI = gui.addFolder("General");
    generalGUI.open();
    generalGUI.add(API_GENERAL, 'dispose').name('Remove Balls');

    const orbitControls = new CONTROLS.OrbitControls(window.camera, window.renderer.domElement);
    orbitControls.target = new THREE.Vector3(0, 0, 0);
    orbitControls.minDistance = 0.5;
    orbitControls.maxDistance = 1000;
    orbitControls.update();


    const stats = new STATS.default();
    document.body.appendChild(stats.dom);
    stats.showPanel(0);
    stats.name = 'stats';

    // Camera Tweens

    window.camera.tween1 = new TWEEN.Tween(window.camera.position)
        .to(new THREE.Vector3(0, 180, 350), 250)
        .onUpdate(() => {
            orbitControls.update();
            window.camera.lookAt(0, 60, 0);
    })
        .onComplete(() => {
            orbitControls.update();
            window.camera.position.set(0, 180, 350);
            window.camera.lookAt(0, 60, 0);
        });

    window.camera.tween2 = new TWEEN.Tween(window.camera.position)
        .to(new THREE.Vector3(37, 125, 50), 250)
        .onUpdate(() => {
            orbitControls.update();
            window.camera.lookAt(turntable.position);
        })
        .onComplete(() => {
            orbitControls.update();
            window.camera.position.set(37, 125, 50);
            window.camera.lookAt(turntable.position);
        });

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

window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
window.onkeydown = keyDownAction;
window.onkeyup = keyUpAction;


