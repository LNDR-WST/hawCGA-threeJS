// Library import
import * as THREE from '../../../lib/three.js-r134/build/three.module.js';
import * as CONTROLS from '../../../lib/three.js-r134/examples/jsm/controls/OrbitControls.js';
import * as DAT from '../../../lib/dat.gui-0.7.7/build/dat.gui.module.js';
import * as TWEEN from '../../../lib/tween.js-18.6.4/dist/tween.esm.js';

// Eventfunction import
import {updateAspectRatio} from './eventfunctions/updateAspectRatio.js';
import {calculateMousePosition} from './eventfunctions/calculateMousePosition.js';
import {executeRaycast} from './eventfunctions/executeRaycast.js';
//import {keyDownAction, keyUpAction} from './eventfunctions/executeKeyAction.js';

// Module import
import Floor from './objects/Floor.js';
import TurntableFromFile from './objects/TurntableFromFile.js';
import Turntable from './objects/Turntable.js';


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

    window.camera.position.set(-16, 240, 175);
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

    // ------------------------------------------------------------------------
    // -------------------------MEASUREMENT-SCRIPT-----------------------------
    // ------------------------------------------------------------------------
    /*let scene = window.scene;
    let camera = window.camera;
    let canvas = window.renderer.domElement;
    document.body.appendChild(canvas);

    //let light = new THREE.DirectionalLight(0xffffff, 0.5);
    //light.position.setScalar(10);
    //scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    document.addEventListener("mousedown", onDocumentMouseDown, false);

    let points = [
        new THREE.Vector3(),
        new THREE.Vector3()
    ];
    let clicks = 0;

    let markerA = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 20),
        new THREE.MeshBasicMaterial({
            color: 0xff5555
        })
    );
    let markerB = markerA.clone();
    let markers = [
        markerA, markerB
    ];
    scene.add(markerA);
    scene.add(markerB);

    let lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    let lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff5555
    });
    let line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    function getIntersections(event) {
        let vector = new THREE.Vector2();

        vector.set(
            event.clientX / window.innerWidth * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(vector, camera);

        let intersects = raycaster.intersectObjects(scene.children);

        return intersects;
    }

    function setLine(vectorA, vectorB) {
        line.geometry.attributes.position.setXYZ(0, vectorA.x, vectorA.y, vectorA.z);
        line.geometry.attributes.position.setXYZ(1, vectorB.x, vectorB.y, vectorB.z);
        line.geometry.attributes.position.needsUpdate = true;
    }

    function onDocumentMouseDown(event) {
        let intersects = getIntersections(event);

        if (intersects.length > 0) {

            points[clicks].copy(intersects[0].point);
            markers[clicks].position.copy(intersects[0].point);
            setLine(intersects[0].point, intersects[0].point);
            clicks++;
            if (clicks > 1){
                let distance = points[0].distanceTo(points[1]);
                document.getElementById('3d_content').innerText = distance;
                setLine(points[0], points[1]);
                clicks = 0;
            }
        }
    }

    window.renderer.setAnimationLoop(function() {
        if (resize(window.renderer)) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        window.renderer.render(scene, camera);
    });

    function resize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }*/
    // ------------------------------------------------------------------------
    // -------------------------MEASUREMENT-SCRIPT-----------------------------
    // ------------------------------------------------------------------------


    // Objects, Lights
    // ---

    // Floor
    const floor = new Floor();
    window.scene.add(floor);

    // TurntableFromFile
//    let turntableFromFile = new TurntableFromFile();
//    turntableFromFile.position.set(-50, 0, 0);
    //turntableFromFile.rotation.set();
    //turntableFromFile.addPhysics(); // TODO: enable when physics implemented
//    window.scene.add(turntableFromFile);

    // Turntable
    const turntable = new Turntable();
    turntable.position.set(15, 0, 0);
    window.scene.add(turntable);

    // PointLight
    let pointLight = new THREE.PointLight(0xffffff, 0.5, 0, 0);
    pointLight.castShadow = false;
    pointLight.shadow.mapSize.set(1024, 1024);
    pointLight.position.set(0, 220, -300);
    window.scene.add(pointLight);

    let spotLight = new THREE.SpotLight(0xddddff, 0.2, 0, THREE.MathUtils.degToRad(45), 1, 2);
    spotLight.position.set(-200, 200, -200);
    spotLight.target = turntable; // TODO: Set target
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

    const spotLight5 = spotLight.clone();
    spotLight5.position.set(0, 200, 200);
    window.scene.add(spotLight5);

    const spotLight6 = spotLight.clone();
    spotLight6.position.set(0, 200, -200);
    window.scene.add(spotLight6);

    const spotLight7 = spotLight.clone();
    spotLight7.position.set(-200, 200, 0);
    window.scene.add(spotLight7);

    const spotLight8 = spotLight.clone();
    spotLight8.position.set(200, 200, 0);
    window.scene.add(spotLight8);


    const gui1 = new DAT.GUI();
    gui1.add(turntable.position, 'x', -200, 200).step(0.1);
    gui1.add(turntable.position, 'y', -200, 200).step(0.1);
    gui1.add(turntable.position, 'z', -200, 200).step(0.1);

    // Functions
    // ---
    function mainLoop() {

        TWEEN.update();

        window.renderer.render(window.scene, window.camera); // Rendern der Szene
        requestAnimationFrame(mainLoop); // Anfrage nächstmögliche Ausführung mainLoop(); pausiert bei Minimierung; Sync zu refresh rate Monitor
    }

    mainLoop();

}
window.onload = main;
window.onresize = updateAspectRatio;
window.onmousemove = calculateMousePosition;
window.onclick = executeRaycast;
//window.onkeydown = keyDownAction;
//window.onkeyup = keyUpAction;


