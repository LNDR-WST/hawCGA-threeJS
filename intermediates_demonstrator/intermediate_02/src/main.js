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

    // -----------------------------------------------
    const listener = new THREE.AudioListener();
    window.camera.add(listener);

    // const sound = new THREE.PositionalAudio(listener);
    // const audioLoader = new THREE.AudioLoader();
    // audioLoader.load( 'src/music/music.mp3', function( buffer ) {
    //     sound.setBuffer( buffer );
    //     sound.setRefDistance(20);
    //     sound.setDirectionalCone( 180, 230, 0.1 );
    //     sound.setLoop(true);
    //     sound.setVolume(1);
    //     //sound.play();
    // });
    // const sphere = new THREE.SphereGeometry( 20, 32, 16 );
    // const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );
    // const mesh = new THREE.Mesh( sphere, material );
    // window.scene.add( mesh );
    // mesh.add( sound ); // needs to be added to mesh?
    // -----------------------------------------------

    window.renderer = new THREE.WebGLRenderer({antialias: true}); // rendert die Szene
    window.renderer.setSize(window.innerWidth, window.innerHeight);         // Größe Framebuffer
    window.renderer.setClearColor(0xb47d49);                                // Hintergrundfarbe
    window.renderer.shadowMap.enabled = true;                               // Schattenrendering aktivieren
    window.renderer.outputEncoding = THREE.sRGBEncoding;

    window.physics = new Physics(false);
    window.physics.setup(0, -200, 0, 1/500, true); // Gravity X, Y, Z; Zeitschrittweite (Integrationsschritte); Boden

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

    const audioLoaderT = new THREE.AudioLoader();
    const audioLoaderTFF = new THREE.AudioLoader();
    const coneInnerAngle = 180;
    const coneOuterAngle = 230;
    const coneOuterGain = 0.1;
    audioLoaderT.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntable_L.setBuffer( buffer );
        soundTurntable_L.setRefDistance(20);
        soundTurntable_L.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        soundTurntable_L.setLoop(false);
        soundTurntable_L.setVolume(1);
    });
    audioLoaderT.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntable_R.setBuffer( buffer );
        soundTurntable_R.setRefDistance(20);
        soundTurntable_R.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        soundTurntable_R.setLoop(false);
        soundTurntable_R.setVolume(1);
    });
    audioLoaderT.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingT_L.setBuffer( buffer );
        cracklingT_L.setRefDistance(20);
        cracklingT_L.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        cracklingT_L.setLoop(true);
        cracklingT_L.setVolume(0.5);
    });
    audioLoaderT.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingT_R.setBuffer( buffer );
        cracklingT_R.setRefDistance(20);
        cracklingT_R.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        cracklingT_R.setLoop(true);
        cracklingT_R.setVolume(0.5);
    });

    audioLoaderTFF.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntableFF_L.setBuffer( buffer );
        soundTurntableFF_L.setRefDistance(20);
        soundTurntableFF_L.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        soundTurntableFF_L.setLoop(false);
        soundTurntableFF_L.setVolume(1);
    });
    audioLoaderTFF.load( 'src/music/music.mp3', function( buffer ) {
        soundTurntableFF_R.setBuffer( buffer );
        soundTurntableFF_R.setRefDistance(20);
        soundTurntableFF_R.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        soundTurntableFF_R.setLoop(false);
        soundTurntableFF_R.setVolume(1);
    });
    audioLoaderTFF.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingTFF_L.setBuffer( buffer );
        cracklingTFF_L.setRefDistance(20);
        cracklingTFF_L.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        cracklingTFF_L.setLoop(true);
        cracklingTFF_L.setVolume(0.5);
    });
    audioLoaderTFF.load( 'src/music/crackling.mp3', function( buffer ) {
        cracklingTFF_R.setBuffer( buffer );
        cracklingTFF_R.setRefDistance(20);
        cracklingTFF_R.setDirectionalCone( coneInnerAngle, coneOuterAngle, coneOuterGain);
        cracklingTFF_R.setLoop(true);
        cracklingTFF_R.setVolume(0.5);
    });

    const speakerLeft = new SpeakerFromFile(soundTurntable_L, soundTurntableFF_L, cracklingT_L, cracklingTFF_L);
    speakerLeft.scale.set(20, 20, 20);
    speakerLeft.rotateY(105*Math.PI/180);
    speakerLeft.position.set(-93, 92.1, 0);
    speakerLeft.addPhysics();
    window.scene.add(speakerLeft);

    const speakerRight = new SpeakerFromFile(soundTurntable_R, soundTurntableFF_R, cracklingT_R, cracklingTFF_R);
    speakerRight.scale.set(20, 20, 20);
    speakerRight.rotateY(75*Math.PI/180);
    speakerRight.position.set(88, 92.1, 0);
    speakerRight.addPhysics();
    window.scene.add(speakerRight);

    // TurntableFromFile
    let turntableFromFile = new TurntableFromFile(speakerLeft, speakerRight);
    turntableFromFile.name = 'turntableFromFile';
    turntableFromFile.position.set(-33, 67.2, 0);
    //turntableFromFile.rotation.set();
    turntableFromFile.addPhysics();
    window.scene.add(turntableFromFile);

    // Turntable
    const turntable = new Turntable(speakerLeft, speakerRight);
    turntable.name = 'turntable';
    turntable.position.set(33, 68, 0);
    turntable.addPhysics();
    window.scene.add(turntable);

    //const positionalAudio = new THREE.Audio(window.audioListener);
    //positionalAudio.setMediaElementSource(turntable.music);
    //positionalAudio.setRefDistance(1);
    //positionalAudio.setDirectionalCone(180, 230, 0.1);

    //const posAudioHelper = new PositionalAudioHelper(window.positionalAudio, 0.1 );
    //positionalAudio.add( window.posAudioHelper );

    // Cabinet
    const cabinet = new CabinetFromFile();
    cabinet.name = 'cabinet';
    cabinet.scale.set(0.8, 0.8, 0.8);
    cabinet.position.set(-6, 0,5);
    cabinet.addPhysics();
    //cabinet.rotateY(180*Math.PI/180);
    window.scene.add(cabinet);


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


