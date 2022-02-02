import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import CSG from '../../../../lib/three-csg-2020/dist/three-csg.js';
import * as TWEEN from '../../../../lib/tween.js-18.6.4/dist/tween.esm.js';

export default class Turntable extends THREE.Group {

    constructor(speakerL, speakerR) {
        super();

        this.isPoweredOn = false;
        this.isRotating = false;
        this.armIsOnRecord = false;
        this.armIsOnEnd = false;
        this.needleLightIsOn = false;
        this.playbackRpm = 33;

        this.speakerL = speakerL;
        this.speakerR = speakerR;

        this.wireframe = false;

        this.addParts();

    }

    addParts() {

        // Materials
        // ---------

        const corpusMaterial = new THREE.MeshPhongMaterial({ // PhongMaterial: einfaches Material ohne Physik
            color: 0x111111,
            flatShading: true,
            specular: 0x111111,
            shininess: 30
        });
        corpusMaterial.color.setHex(0x111111).convertSRGBToLinear();

        const footMaterial = new THREE.MeshPhongMaterial({ // wie corpusMaterial, aber Smooth-Shading
            color: 0x111111,
            flatShading: false,
            specular: 0x111111,
            shininess: 30
        });
        footMaterial.color.setHex(0x111111).convertSRGBToLinear();

        const tabletopMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            flatShading: false,
            roughness: 0.4,
            metalness: 1,
            wireframe: false
        });
        tabletopMaterial.color.setHex(0xcccccc).convertSRGBToLinear();

        const tabletopMaterialTextured = tabletopMaterial.clone();
        const tabletopTexture = new THREE.TextureLoader().load('src/images/turntabletop.jpg');
        tabletopTexture.encoding = THREE.sRGBEncoding;
        tabletopTexture.flipY = false;
        tabletopMaterialTextured.map = tabletopTexture;

        const tabletopPowerMaterial = tabletopMaterial.clone();
        const tabletopPowerMap = new THREE.TextureLoader().load('src/images/powertext.jpg');
        tabletopPowerMaterial.map = tabletopPowerMap;
        tabletopPowerMaterial.map.encoding = THREE.sRGBEncoding;

        const tabletopWeightAdjMaterial = tabletopMaterial.clone();
        const tabletopWeightAdjMap = new THREE.TextureLoader().load('src/images/weighttext.jpg');
        tabletopWeightAdjMaterial.map = tabletopWeightAdjMap;
        tabletopWeightAdjMaterial.map.encoding = THREE.sRGBEncoding;

        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            flatShading: false,
            roughness: 0.2,
            metalness: 1,
            wireframe: false
        });
        metalMaterial.color.setHex(0xcccccc).convertSRGBToLinear();

        // Environment Map
        const envMap = new THREE.TextureLoader().load('../../lib/three.js-r134/examples/textures/2294472375_24a3b8ef46_o.jpg');
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        envMap.encoding = THREE.sRGBEncoding;
        metalMaterial.envMap = envMap;
        metalMaterial.envMapIntensity = 10.0;

        tabletopMaterialTextured.envMap = envMap;
        tabletopMaterialTextured.envMapIntensity = 10.0;

        //tabletopMaterial.envMap = envMap;
        //tabletopMaterial.envMapIntensity = 10.0;

        const rotaryRingMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            flatShading: false,
            roughness: 0.4,
            metalness: 1
        });
        rotaryRingMaterial.color.setHex(0xcccccc).convertSRGBToLinear();
        rotaryRingMaterial.map = new THREE.TextureLoader().load('src/images/rotaryRing_base.jpg');
        rotaryRingMaterial.map.encoding = THREE.sRGBEncoding;
        rotaryRingMaterial.normalMap = new THREE.TextureLoader().load('src/images/rotaryRing_normal.jpg');

        const vinylMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            flatShading: false,
            roughness: 0.5,
            metalness: 0
        });
        vinylMaterial.color.setHex(0xcccccc).convertSRGBToLinear();
        vinylMaterial.map = new THREE.TextureLoader().load('src/images/vinyl_basecolor.jpg');
        vinylMaterial.map.encoding = THREE.sRGBEncoding;
        vinylMaterial.bumpMap = new THREE.TextureLoader().load('src/images/vinyl_bumpmap.jpg');
        vinylMaterial.bumpScale = 0.2;

        const emissivePowerMaterial = new THREE.MeshStandardMaterial({
            color: 0x2f0000,
            flatShading: false,
            roughness: 0.4,
            metalness: 0,
            emissive: 0x000000
        });
        emissivePowerMaterial.color.setHex(0x2f0000).convertSRGBToLinear();

        const redPlasticMaterial = new THREE.MeshPhongMaterial({
            color: 0x8b0000,
            flatShading: false,
            specular: 0x111111,
            shininess: 35
        });
        redPlasticMaterial.color.setHex(0x8b0000).convertSRGBToLinear();

        const startButtonMaterial = metalMaterial.clone();
        startButtonMaterial.map = new THREE.TextureLoader().load('src/images/startstoptext.jpg');
        startButtonMaterial.map.flipY = false;

        const fourtyFiveButtonMaterial = metalMaterial.clone();
        fourtyFiveButtonMaterial.map = new THREE.TextureLoader().load('src/images/45.jpg');
        fourtyFiveButtonMaterial.map.flipY = false;

        const thirtyThreeButtonMaterial = metalMaterial.clone();
        thirtyThreeButtonMaterial.map = new THREE.TextureLoader().load('src/images/33.jpg');
        thirtyThreeButtonMaterial.map.flipY = false;



        // Corpus
        // ------

        // Vertices definiert durch jeweils 3 Positionen: x, y, z
        const positions = [
            // obere Ebene
            -31.75, 13.7, -24.25,     // 0
            -31.75, 13.7, 24.25,      // 1
            31.75, 13.7, -24.25,      // 2
            31.75, 13.7, 24.25,       // 3

            // mittlere Ebene
            -31.75, 7.3, -24.25,   // 4
            -31.75, 7.3, 24.25,    // 5
            31.75, 7.3, -24.25,    // 6
            31.75, 7.3, 24.25,     // 7

            // untere Ebene
            -30, 5.3, -24.25,       // 8
            -30, 5.3, 24.25,        // 9
            30, 5.3, -24.25,        // 10
            30, 5.3, 24.25,         // 11


        ];

        // 3 Indizes zu den zugehörigen Vertices, die ein Face (Dreieck) bilden
        const indices = [
            0, 1, 2,    // top face corpus 1/2
            2, 1, 3,    // top face corpus 2/2
            0, 4, 1,    // left face corpus 1/2
            1, 4, 5,    // left face corpus 2/2
            2, 3, 6,    // right face corpus 1/2
            6, 3, 7,    // right face corpus 2/2
            1, 5, 3,    // front face corpus 1/2
            3, 5, 7,    // front face corpus 2/2
            0, 2, 6,    // back face corpus 1/2
            0, 6, 4,    // back face corpus 2/2
            4, 8, 5,    // left face corpus bottom 1/2
            5, 8, 9,    // left face corpus bottom 2/2
            6, 7, 10,   // right face corpus bottom 1/2
            10, 7, 11,  // right face corpus bottom 2/2
            5, 9, 7,    // front face corpus bottom 1/2
            7, 9, 11,   // front face corpus bottom 2/2
            4, 6, 10,   // back face corpus 1/2
            4, 10, 8,   // back face corpus 2/2
            10, 9, 8,   // bottom face corpus 1/2
            11, 9, 10   // bottom face corpus 2/2
        ];

        const corpusGeometry = new THREE.BufferGeometry();
        corpusGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        corpusGeometry.setIndex(indices);
        corpusGeometry.computeVertexNormals();
        const corpus = new THREE.Mesh(corpusGeometry, corpusMaterial);
        corpus.name = 'Corpus';
        corpus.castShadow = true;
        this.add(corpus);

        // Tabletop
        // --------

        const tabletopBase = new THREE.BoxGeometry(64, 1.375,49);
        const tabletopSwitchCutout = new THREE.BoxGeometry(2.7, 0.25, 15.8).translate(27.45, 1.375/2, 9.8);
        const tabletopArmCutout = new THREE.CylinderGeometry(8.2, 8.2,1.3,32).translate(21.2, 1.375/2-0.5, -12.4);
        const tabletopCSG = CSG.subtract([tabletopBase, tabletopSwitchCutout, tabletopArmCutout]);
        const tabletopGeometry = CSG.BufferGeometry(tabletopCSG);
        const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterialTextured);
        tabletop.position.set(0, 14.3875, 0); // Oberes Face bei z = 15.075
        tabletop.name = 'Tabletop';
        tabletop.castShadow = true;
        this.add(tabletop);

        setVertexUvs(tabletopGeometry, 64, 46, ['x','z'], 0, 16, 0, 6.85);


        // Feet
        // ----

        // Komponenten für einen Fuß
        const footTopGeometry = new THREE.CylinderGeometry(4.7, 4.7, 1.06, 32, 1);
        const footTop = new THREE.Mesh(footTopGeometry, footMaterial);
        footTop.position.set(0, 4.77, 0);

        const footMiddleGeometry = new THREE.CylinderGeometry(4.2, 4.2, 0.53, 32, 1);
        const footMiddle = new THREE.Mesh(footMiddleGeometry, footMaterial);
        footMiddle.position.set(0, 3.975, 0);

        const footMetalGeometry = new THREE.CylinderGeometry(4.7, 4.7, 3.18, 32, 1);
        const footMetal = new THREE.Mesh(footMetalGeometry, tabletopMaterial);
        footMetal.position.set(0, 2.12, 0);

        const footBottomGeometry = new THREE.CylinderGeometry(4.7, 4.5, 0.53, 32, 1);
        const footBottom = new THREE.Mesh(footBottomGeometry, footMaterial);
        footBottom.position.set(0, 0.265, 0);

        // hinten links
        const footBackLeft = new THREE.Group();
        footBackLeft.add(footTop, footMiddle, footMetal, footBottom);
        footBackLeft.position.set(-25,0,-19.25);
        footBackLeft.name = 'footBackLeft';
        footBackLeft.castShadow = true;
        this.add(footBackLeft);

        // vorne links
        const footFrontLeft = footBackLeft.clone();
        footFrontLeft.position.set(-25, 0, 19.25);
        footFrontLeft.name = 'footFrontLeft';
        footFrontLeft.castShadow = true;
        this.add(footFrontLeft);

        // hinten rechts
        const footBackRight = footBackLeft.clone();
        footBackRight.position.set(25, 0, -19.25);
        footBackRight.name = 'footBackRight';
        footBackRight.castShadow = true;
        this.add(footBackRight);

        // vorne rechts
        const footFrontRight = footBackLeft.clone();
        footFrontRight.position.set(25, 0, 19.25);
        footFrontRight.name = 'footFrontRight';
        footFrontRight.castShadow = true;
        this.add(footFrontRight);


        // Single Puk
        // ----------

        const singlePukCSG = CSG.subtract([ // Constructice Solid Geometry
            new THREE.CylinderGeometry(2.8, 2.8, 0.5, 32),
            new THREE.CylinderGeometry(0.5, 0.5, 0.5, 16)
        ]);
        const singlePukGeometry = CSG.BufferGeometry(singlePukCSG);
        const singlePuk = new THREE.Mesh(singlePukGeometry, metalMaterial);
        singlePuk.position.set(-27, 15.175, -19.5);
        singlePuk.name = 'singlePuk';
        this.add(singlePuk);

        // Rotary disc
        // -----------

        const rotaryDiscGeometry = new THREE.CylinderGeometry(21.3,23.4, 1.82, 64);
        const rotaryDisc = new THREE.Mesh(rotaryDiscGeometry, [rotaryRingMaterial, vinylMaterial, vinylMaterial]);
        rotaryDisc.name = 'rotaryDiscWithRecord';

            // Record center
            const centerCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
            const centerSphere = new THREE.SphereGeometry(0.5, 32, 32).translate(0, 0.75, 0);
            const rotaryDiscCenterCSG = CSG.union([centerCylinder, centerSphere]);

            const rotaryDiscCenterGeometry = CSG.BufferGeometry(rotaryDiscCenterCSG);
            const rotaryDiscCenter = new THREE.Mesh(rotaryDiscCenterGeometry, metalMaterial);
            rotaryDisc.add(rotaryDiscCenter);
            rotaryDisc.children[0].position.set(0, 1.66, 0);

        //const tempPosition = {x: rotaryDisc.position.x, y: rotaryDisc.position.y, z: rotaryDisc.position.z};

        rotaryDisc.position.set(-6.5, 15.075 + 1.82/2, 0);
        rotaryDisc.rotateY(Math.PI/2);



        const tweenDiscRotate = new TWEEN.Tween(rotaryDisc.rotation)
            .to({x: '+0',
                y: `${-2*Math.PI}`,
                z: '+0'}, 1/this.playbackRpm * 60 * 1000)
            .easing(TWEEN.Easing.Linear.None)
            .repeat(Infinity)
            .onUpdate(() => {

            })
            .onRepeat(() => {});

        const tweenDiscStart = new TWEEN.Tween(rotaryDisc.rotation)
            .to({x: '+0',
                y: `${-Math.PI}`,
                z: '+0'}, 1/this.playbackRpm * 60 * 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .chain(tweenDiscRotate)
            .onUpdate(() => {
                if (this.armIsOnRecord) {
                    arm.userData.tweenRollingSide.start();
                }
            })
            .onComplete(() => {});

        const tweenDiscStop = new TWEEN.Tween(rotaryDisc.rotation)
            .to({x: '+0',
                y: `${-1/8*Math.PI}`,
                z: '+0'}, 1/this.playbackRpm * 60 * 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onStart(() => {
                this.isRotating = false;
                this.speakerL.cracklingT.pause();
                this.speakerR.cracklingT.pause();
            });

        rotaryDisc.userData = {tweenStart: tweenDiscStart, tweenStop: tweenDiscStop, tweenRotate: tweenDiscRotate};


        this.add(rotaryDisc);

        // Power Switch
        // -----------

        // Main Cylinder
        const powerKnobCylinderGeometry = new THREE.CylinderGeometry(2, 2, 1.75, 16);
        const powerKnobCylinder = new THREE.Mesh(powerKnobCylinderGeometry, metalMaterial);
        powerKnobCylinder.position.set(0, 1.75/2, 0);

        // Emissive Powerlight
        const emissivePowerLightGeometry = new THREE.CylinderGeometry(2.025, 2.025, 1.5, 16, 1, false, 1.5, 1.25);
        const emissivePowerLight = new THREE.Mesh(emissivePowerLightGeometry, emissivePowerMaterial);
        emissivePowerLight.position.set(0, 1.75/2, 0);
        emissivePowerLight.name = 'emissivePowerLight';

        // Switch
        const actualSwitchGeometry = new THREE.CylinderBufferGeometry(1.9, 1.9, 0.5, 16);
        const actualSwitch = new THREE.Mesh(actualSwitchGeometry, tabletopPowerMaterial);
        actualSwitch.position.set(0, 1.75 + 0.5/2, 0);
        actualSwitch.name = 'actualPowerSwitch';
        actualSwitch.userData = {
            tweenOn: new TWEEN.Tween(actualSwitch.rotation)
                .to(new THREE.Vector3(actualSwitch.rotation.x,
                    actualSwitch.rotation.y + THREE.MathUtils.degToRad(-90),
                    actualSwitch.rotation.z), 125)
                .onStart(() => {
                    actualSwitch.userData.tweenLightOff.stop();
                    actualSwitch.userData.tweenLightOn.start();
                }),
            tweenOff: new TWEEN.Tween(actualSwitch.rotation)
                .to(new THREE.Vector3(actualSwitch.rotation.x,
                    actualSwitch.rotation.y,
                    actualSwitch.rotation.z), 125)
                .onStart(() => {
                    actualSwitch.userData.tweenLightOn.stop();
                    actualSwitch.userData.tweenLightOff.start();
                }),
            tweenLightOn: new TWEEN.Tween(emissivePowerLight.material.emissive)
                .to(new THREE.Color(0x910000), 125),
            tweenLightOff: new TWEEN.Tween(emissivePowerLight.material.emissive)
                .to(new THREE.Color(0x000000), 125)
        };


        // Power Knob Group
        const powerKnob = new THREE.Group();
        powerKnob.add(powerKnobCylinder, emissivePowerLight, actualSwitch);
        powerKnob.position.set(-29.25, 15.075, 15.5);
        powerKnob.name = 'powerKnob';

        this.add(powerKnob);

        // Buttons
        // -------

        // Start/Stop Button
        const startStopFrameGeometry = new THREE.BoxGeometry(6, 0.1, 4.5);
        const startStopFrame = new THREE.Mesh(startStopFrameGeometry, corpusMaterial);
        startStopFrame.position.set(-27.5, 15.125, 21.2);
        this.add(startStopFrame);

        const startStopButtonGeometry = new THREE.BufferGeometry();
        startStopButtonGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            -2.9, 0, -2.15,     // 0
            2.9, 0, -2.15,      // 1
            -2.9, 0, 2.15,      // 2
            2.9, 0, 2.15,       // 3

            -2.9, 0.075, -2.15,   // 4
            2.9, 0.075, -2.15,    // 5
            -2.9, 0.075, 2.15,    // 6
            2.9, 0.075, 2.15,     // 7

            -2.85, 0.15, -2.1,   // 8
            2.85, 0.15, -2.1,    // 9
            -2.85, 0.15, 2.1,    // 10
            2.85, 0.15, 2.1      // 11
        ]), 3));
        startStopButtonGeometry.setIndex([
            0, 2, 1,    // bottom face 1/2
            1, 2, 3,    // bottom face 2/2
            4, 6, 5,    // middle face 1/2
            5, 6, 7,    // middle face 1/2
            8, 10, 9,   // top face 1/2
            9, 10, 11,  // top face 1/2
            2, 3, 7,    // bottom front face 1/2
            2, 7, 6,    // bottom front face 2/2
            5, 1, 0,    // bottom back face 1/2
            4, 5, 0,    // bottom back face 2/2
            0, 2, 6,    // bottom left face 1/2
            6, 4, 0,    // bottom left face 2/2
            7, 3, 5,    // bottom right face 1/2
            5, 3, 1,    // bottom right face 2/2
            6, 7, 11,   // top front face 1/2
            6, 11, 10,  // top front face 2/2
            9, 5, 4,    // top back face 1/2
            8, 9, 4,    // top back face 2/2
            4, 6, 10,   // top left face 1/2
            10, 8, 4,   // top left face 2/2
            11, 7, 9,   // top right face 1/2
            9, 7, 5     // top right face 2/2
        ]);
        startStopButtonGeometry.computeVertexNormals();
        setVertexUvs(startStopButtonGeometry, 5.8, 4.3, ['x','z'], 0, 0, 0, 0);
        const startStopButton = new THREE.Mesh(startStopButtonGeometry, startButtonMaterial);
        startStopButton.position.set(-27.5, 15.175, 21.2);
        startStopButton.name = 'startStopButton';
        startStopButton.userData = {
            tweenPush: new TWEEN.Tween(startStopButton.position)
                .to(new THREE.Vector3(startStopButton.position.x,
                    startStopButton.position.y - 0.075,
                    startStopButton.position.z), 125).repeat(1).yoyo(true)
        };
        this.add(startStopButton);

        // 45 RPM Button
        const fourtyFiveButtonFrameGeometry = new THREE.BoxGeometry(3.5, 0.1, 1.1);
        const fourtyFiveButtonFrame = new THREE.Mesh(fourtyFiveButtonFrameGeometry, corpusMaterial);
        fourtyFiveButtonFrame.position.set(-22, 15.125, 21.2 + 4.5/2 - 1.1/2);
        this.add(fourtyFiveButtonFrame);

        const fourtyFiveButtonGeometry = new THREE.BufferGeometry();
        fourtyFiveButtonGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            -1.65, 0, -0.45,     // 0
            1.65, 0, -0.45,      // 1
            -1.65, 0, 0.45,      // 2
            1.65, 0, 0.45,       // 3

            -1.65, 0.075, -0.45,   // 4
            1.65, 0.075, -0.45,    // 5
            -1.65, 0.075, 0.45,    // 6
            1.65, 0.075, 0.45,     // 7

            -1.6, 0.15, -0.4,   // 8
            1.6, 0.15, -0.4,    // 9
            -1.6, 0.15, 0.4,    // 10
            1.6, 0.15, 0.4      // 11
        ]), 3));
        fourtyFiveButtonGeometry.setIndex([
            0, 2, 1,    // bottom face 1/2
            1, 2, 3,    // bottom face 2/2
            4, 6, 5,    // middle face 1/2
            5, 6, 7,    // middle face 1/2
            8, 10, 9,   // top face 1/2
            9, 10, 11,  // top face 1/2
            2, 3, 7,    // bottom front face 1/2
            2, 7, 6,    // bottom front face 2/2
            5, 1, 0,    // bottom back face 1/2
            4, 5, 0,    // bottom back face 2/2
            0, 2, 6,    // bottom left face 1/2
            6, 4, 0,    // bottom left face 2/2
            7, 3, 5,    // bottom right face 1/2
            5, 3, 1,    // bottom right face 2/2
            6, 7, 11,   // top front face 1/2
            6, 11, 10,  // top front face 2/2
            9, 5, 4,    // top back face 1/2
            8, 9, 4,    // top back face 2/2
            4, 6, 10,   // top left face 1/2
            10, 8, 4,   // top left face 2/2
            11, 7, 9,   // top right face 1/2
            9, 7, 5     // top right face 2/2
        ]);
        fourtyFiveButtonGeometry.computeVertexNormals();
        setVertexUvs(fourtyFiveButtonGeometry, 3.3, 0.9, ['x','z'], 0, 0, 0, 0);
        const fourtyFiveButton = new THREE.Mesh(fourtyFiveButtonGeometry, fourtyFiveButtonMaterial);
        fourtyFiveButton.position.set(-22, 15.175, 21.2 + 4.5/2 - 1.1/2);
        fourtyFiveButton.name = '45rpmButton';
        fourtyFiveButton.userData = {
            tweenPush: new TWEEN.Tween(fourtyFiveButton.position)
                .to(new THREE.Vector3(fourtyFiveButton.position.x,
                    fourtyFiveButton.position.y - 0.075,
                    fourtyFiveButton.position.z
                ), 125).repeat(1).yoyo(true)
                .onStart(() => {
                    this.speakerL.soundT.setPlaybackRate(1.36);
                    this.speakerR.soundT.setPlaybackRate(1.36);
                })
        };
        this.add(fourtyFiveButton);


        // 33 RPM Button
        const thirtyThreeButtonFrameGeometry = new THREE.BoxGeometry(3.5, 0.1, 1.1);
        const thirtyThreeButtonFrame = new THREE.Mesh(thirtyThreeButtonFrameGeometry, corpusMaterial);
        thirtyThreeButtonFrame.position.set(-22 + 3.5, 15.125, 21.2 + 4.5/2 - 1.1/2);
        this.add(thirtyThreeButtonFrame);

        const thirtyThreeButton = fourtyFiveButton.clone();
        thirtyThreeButton.material = thirtyThreeButtonMaterial;
        thirtyThreeButton.position.set(-22 + 3.5, 15.175, 21.2 + 4.5/2 - 1.1/2);
        thirtyThreeButton.name = '33rpmButton';
        thirtyThreeButton.userData = {
            tweenPush: new TWEEN.Tween(thirtyThreeButton.position)
                .to(
                    new THREE.Vector3(thirtyThreeButton.position.x,
                    thirtyThreeButton.position.y - 0.075,
                    thirtyThreeButton.position.z), 125).repeat(1).yoyo(true)
                .onStart(() => {
                    this.speakerL.soundT.setPlaybackRate(1);
                    this.speakerR.soundT.setPlaybackRate(1);
                })
        };
        this.add(thirtyThreeButton);

        // Nadelbeleuchtung
        // ----------------

        // Plate Base
        const plateRectangle = new THREE.BoxGeometry(2.4, 0.25, 1.5);
        const plateCylinder = new THREE.CylinderGeometry(0.75, 0.75, 0.25, 16).translate(-1.2, 0, 0);
        const plateCylinder2 = new THREE.CylinderGeometry(0.75, 0.75, 0.25, 16).translate(1.2, 0, 0);
        const needleLightingPlateBaseCSG = CSG.union([plateRectangle, plateCylinder, plateCylinder2]);
        const needleLightingPlateBaseGeometry = CSG.BufferGeometry(needleLightingPlateBaseCSG);
        // Plate Cutout
        const needleLightingPlateCutout = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 16).translate(1.2, 0.125, 0);
        const needleLightingPlateCSG = CSG.subtract([needleLightingPlateBaseGeometry, needleLightingPlateCutout]);
        // Plate Final State
        const needleLightingPlateGeometry = CSG.BufferGeometry(needleLightingPlateCSG);
        const needleLightingPlate = new THREE.Mesh(needleLightingPlateGeometry, metalMaterial);
        needleLightingPlate.position.set(6, 15.125, 22.2);

            // Light Cylinder
            const needleLightGeometry = new THREE.CylinderGeometry(0.65, 0.65, 3.6, 16);
            const needleLight = new THREE.Mesh(needleLightGeometry, metalMaterial);
            needleLight.position.set(-1.2, 0.125 + 1.8 - 1.5, 0);
            needleLight.name = 'needleLightOffButton';
            const needleSpotLight = new THREE.SpotLight(0xf5ebb8, 0, 20, 5*Math.PI/180);
            needleSpotLight.position.set(0, 0, 0);
            needleSpotLight.target = rotaryDiscCenter;
            needleLight.add(needleSpotLight);

            needleLight.userData = {
                tweenDown: new TWEEN.Tween(needleLight.position)
                    .to(new THREE.Vector3(needleLight.position.x, needleLight.position.y, needleLight.position.z), 75)
                    .onStart(() => {
                        needleSpotLight.intensity = 0;
                        needleLightOnButton.userData.tweenDown.stop();
                        needleLightOnButton.userData.tweenUp.start();
                    }),
                tweenUp: new TWEEN.Tween(needleLight.position)
                    .to(new THREE.Vector3(needleLight.position.x, needleLight.position.y + 1.5, needleLight.position.z), 75)
                    .onComplete(() => {
                        needleSpotLight.intensity = 1;
                    })
            };
            needleLightingPlate.add(needleLight);   // child[0]

            // Light on button
            const needleLightOnButtonGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
            const needleLightOnButton = new THREE.Mesh(needleLightOnButtonGeometry, metalMaterial);
            needleLightOnButton.position.set(1.2, -0.25 + 0.5, 0);
            needleLightOnButton.name = 'needleLightOnButton';
            needleLightOnButton.userData = {
                tweenDown: new TWEEN.Tween(needleLightOnButton.position)
                    .to(new THREE.Vector3(needleLightOnButton.position.x, needleLightOnButton.position.y - 0.5, needleLightOnButton.position.z), 75)
                    .onStart(() => {
                        needleLight.userData.tweenDown.stop();
                        needleLight.userData.tweenUp.start();
                    }),
                tweenUp: new TWEEN.Tween(needleLightOnButton.position)
                    .to(new THREE.Vector3(needleLightOnButton.position.x, needleLightOnButton.position.y, needleLightOnButton.position.z), 75)
            };
            needleLightingPlate.add(needleLightOnButton);   // child[1]

        this.add(needleLightingPlate);


        // Speed Slider
        // ------------

        // Rectangle: Kante nach oben drehen, jeweils zwei Zylinder wegschneiden

        const speedSliderCSG = CSG.subtract([
            new THREE.BoxGeometry(2.675, 1.8, 1.8).rotateX(THREE.MathUtils.degToRad(45)),
            new THREE.CylinderBufferGeometry(0.9, 0.9, 2.7, 128).rotateZ(THREE.MathUtils.degToRad(90)).translate(0, 1, -1),
            new THREE.CylinderBufferGeometry(0.9, 0.9, 2.7, 128).rotateZ(THREE.MathUtils.degToRad(90)).translate(0, 1, 1),
            new THREE.CylinderGeometry(0.1, 0.1, 2.7, 16).rotateZ(THREE.MathUtils.degToRad(90)).translate(0, 1.2, 0)
        ]);
        const speedSliderGeometry = CSG.BufferGeometry(speedSliderCSG);
        const speedSlider = new THREE.Mesh(speedSliderGeometry, tabletopMaterial);
        speedSlider.position.set(27.45, 15.075, 9.8);
        speedSlider.name = 'speedSlider';
        this.add(speedSlider);

        // Arm Plates
        // ---------

        const basePlateTorus = new THREE.TorusGeometry(6.2, 3.2, 64, 32).rotateX(THREE.MathUtils.degToRad(90)).translate(0, 4.2, 0);
        const basePlateCyl = new THREE.CylinderGeometry(8.2, 8.2, 1.2, 32).translate(0, 1.2/2, 0);
        const basePlateCSG = CSG.subtract([basePlateCyl, basePlateTorus]);
        const basePlateGeometry = CSG.BufferGeometry(basePlateCSG);
        const basePlate = new THREE.Mesh(basePlateGeometry, corpusMaterial);
        basePlate.position.set(21.2, 15.075 - 1.2, -12.4);
        this.add(basePlate);

            const armPlate1Geometry = new THREE.CylinderGeometry(5, 5, 0.725, 32).translate(0, 1.2 + 0.725/2, 0);
            const armPlate1 = new THREE.Mesh(armPlate1Geometry, corpusMaterial);
            basePlate.add(armPlate1);

            const armPlate2base = new THREE.CylinderGeometry(2.6, 2.6, 0.36, 32).translate(0, 2.105, 0);
            const armPlate2extension = new THREE.BoxGeometry(4.8, 0.36, 3).translate(3, 2.105, 0);
            const armPlate2CSG = CSG.union([armPlate2base, armPlate2extension]);
            const armPlate2Geometry = CSG.BufferGeometry(armPlate2CSG);
            const armPlate2 = new THREE.Mesh(armPlate2Geometry, corpusMaterial);
            const armPlateWeightCylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.72, 16).translate(5.4, 2.285, 0);
            const armPlateWeightCylinder = new THREE.Mesh(armPlateWeightCylinderGeo, [corpusMaterial, tabletopWeightAdjMaterial, corpusMaterial]);
            armPlateWeightCylinder.name = 'armPlateWeightCylinder';
            basePlate.add(armPlate2, armPlateWeightCylinder);

            const armPlate3Base = new THREE.CylinderGeometry(2.3, 2.3, 0.3, 32).translate(0, 2.105 + 0.3, 0);
            const armPlate3Cut = new THREE.BoxGeometry(1, 0.3, 3).translate(2.3, 2.105 + 0.3, 0);
            const armPlate3CSG = CSG.subtract([armPlate3Base, armPlate3Cut]);
            const armPlate3Geometry = CSG.BufferGeometry(armPlate3CSG);
            const armPlate3 = new THREE.Mesh(armPlate3Geometry, corpusMaterial);
            basePlate.add(armPlate3);

            const armPlate4Base = new THREE.CylinderGeometry(1.3, 1.3, 0.25, 32).translate(0, 2.405 + 0.25, 0);
            const armPlate4Cut = new THREE.BoxGeometry(1, 0.25, 2).translate(1.5, 2.405 + 0.25, 0);
            const armPlate4CSG = CSG.subtract([armPlate4Base, armPlate4Cut]);
            const armPlate4Geometry = CSG.BufferGeometry(armPlate4CSG);
            const armPlate4 = new THREE.Mesh(armPlate4Geometry, corpusMaterial);
            basePlate.add(armPlate4);

        // Horizontal arm joint
        // --------------------
        const horizontalJointGeometry = new THREE.BufferGeometry();
        horizontalJointGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            // vertices z+
            -2.9, 1.5, 0.375,       // 0
            -2.9, -1.5, 0.375,      // 1
            2.9, -1.5, 0.375,       // 2
            2.9, 1.5, 0.375,        // 3

            -2.55, 1.2, 0.375,      // 4
            -2.55, -1.2, 0.375,     // 5
            2.55, -1.2, 0.375,       // 6
            2.55, 1.2, 0.375,        // 7

            -0.425, 2.2, 0.375,     // 8
            -0.425, -2.2, 0.375,    // 9
            0.425, -2.2, 0.375,     // 10
            0.425, 2.2, 0.375,      // 11

            -0.375, 1.55, 0.375,    // 12
            -0.375, -1.55, 0.375,   // 13
            0.375, -1.55, 0.375,    // 14
            0.375, 1.55, 0.375,     // 15

            // vertices z-
            -2.9, 1.5, -0.375,       // 16
            -2.9, -1.5, -0.375,      // 17
            2.9, -1.5, -0.375,       // 18
            2.9, 1.5, -0.375,        // 19

            -2.55, 1.2, -0.375,      // 20
            -2.55, -1.2, -0.375,     // 21
            2.55, -1.2, -0.375,       // 22
            2.55, 1.2, -0.375,        // 23

            -0.425, 2.2, -0.375,     // 24
            -0.425, -2.2, -0.375,    // 25
            0.425, -2.2, -0.375,     // 26
            0.425, 2.2, -0.375,      // 27

            -0.375, 1.55, -0.375,    // 28
            -0.375, -1.55, -0.375,   // 29
            0.375, -1.55, -0.375,    // 30
            0.375, 1.55, -0.375,     // 31

        ]), 3));
        horizontalJointGeometry.setIndex([
            // Faces front
            0, 4, 8,
            4, 12, 8,
            4, 0, 5,
            0, 1, 5,
            5, 1, 13,
            13, 1, 9,
            13, 9, 14,
            14, 9, 10,
            14, 10, 6,
            6, 10, 2,
            7, 6, 2,
            2, 3, 7,
            7, 3, 15,
            15, 3, 11,
            11, 12, 15,
            11, 8, 12,

            // Faces back (Indizes front + 16 + reverse)
            24, 20, 16,
            24, 28, 20,
            21, 16, 20,
            21, 17, 16,
            29, 17, 21,
            25, 17, 29,
            30, 25, 29,
            26, 25, 30,
            22, 26, 30,
            18, 26, 22,
            18, 22, 23,
            23, 19, 18,
            31, 19, 23,
            27, 19, 31,
            31, 28, 27,
            28, 24, 27,

            // Faces between inner
            31, 12, 28,
            15, 12, 31,
            20, 12, 4,
            20, 28, 12,
            21, 20, 5,
            4, 5, 20,
            21, 5, 13,
            13, 29, 21,
            29, 13, 14,
            14, 30, 29,
            30, 14, 6,
            6, 22, 30,
            23, 22, 6,
            6, 7, 23,
            7, 15, 31,
            31, 23, 7,

            // Faces between outer (Index inner - 4 + reversed)
            24, 8, 27,
            27, 8, 11,
            0, 8, 16,
            8, 24, 16,
            1, 16, 17,
            16, 1, 0,
            9, 1, 17,
            17, 25, 9,
            10, 9, 25,
            25, 26, 10,
            2, 10, 26,
            26, 18, 2,
            2, 18, 19,
            19, 3, 2,
            27, 11, 3,
            3, 19, 27
        ]);
        horizontalJointGeometry.computeVertexNormals();
        const horizontalJoint = new THREE.Mesh(horizontalJointGeometry, corpusMaterial);
        horizontalJoint.position.set(21.2, 16.655 + 2.2, -12.4);
        horizontalJoint.name = 'horizontalJointWithCylinder';

        const plasticParkPosition = horizontalJoint.rotation;
        const tweenMoveArmPlasticSide1 = new TWEEN.Tween(horizontalJoint.rotation)
            .to({x: 0, y: THREE.MathUtils.degToRad(-25.2), z: 0}, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut);

        const tweenMoveArmPlasticSide2 = new TWEEN.Tween(horizontalJoint.rotation)
            .to({x: plasticParkPosition.x, y: plasticParkPosition.y, z: plasticParkPosition.z}, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .delay(1000);

        const tweenRollingArmPlastic = new TWEEN.Tween(horizontalJoint.rotation)
            .to(new THREE.Vector3(
                horizontalJoint.rotation.x + THREE.MathUtils.degToRad(2.4), horizontalJoint.rotation.y + THREE.MathUtils.degToRad(-46), horizontalJoint.rotation.z
            ), 35000);

        horizontalJoint.userData = {
            tweenMoveArmPlasticSide1: tweenMoveArmPlasticSide1,
            tweenMoveArmPlasticSide2: tweenMoveArmPlasticSide2,
            tweenRollingArmPlastic: tweenRollingArmPlastic
        };

        this.add(horizontalJoint);

            // rotation cylinder (vertical rotation)
            const armRotationGeometry = new THREE.CylinderGeometry(0.8, 0.8, 5.1, 32);
            const armRotation = new THREE.Mesh(armRotationGeometry, metalMaterial);
            armRotation.rotateZ(THREE.MathUtils.degToRad(90));
            //armRotation.position.set(21.2, 18.855, -12.4);
            horizontalJoint.add(armRotation);

        this.rotateAboutPoint(
            horizontalJoint,
            new THREE.Vector3(21.2, 15.075, -12.4),
            new THREE.Vector3(0, 1, 0),
            THREE.MathUtils.degToRad(3),
            false
        );

        // Black Locking for holding arm in place
        // --------------------------------------
        const blackLockingGeometry1 = new THREE.BufferGeometry();
        blackLockingGeometry1.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            // vertices z+
            0, 5.15, 0.5,       // 0
            0, 1.5, 0.5,        // 1
            0, 0, 0.75,         // 2
            2.3, 0, 0.75,       // 3
            2.3, 0.36, 0.75,    // 4
            1.15, 1.5, 0.5,     // 5
            1.15, 5.15, 0.5,    // 6
            4.6, 5.75, 0.5,     // 7
            5.3, 5.75, 0.5,     // 8
            5.3, 6.2, 0.5,      // 9
            1.05, 6.2, 0.5,     // 10
            0.3, 5.85, 0.5,     // 11

            // vertices z-
            0, 5.15, -0.5,       // 12
            0, 1.5, -0.5,        // 13
            0, 0, -0.75,         // 14
            2.3, 0, -0.75,       // 15
            2.3, 0.36, -0.75,    // 16
            1.15, 1.5, -0.5,     // 17
            1.15, 5.15, -0.5,    // 18
            4.6, 5.75, -0.5,     // 19
            5.3, 5.75, -0.5,     // 20
            5.3, 6.2, -0.5,      // 21
            1.05, 6.2, -0.5,     // 22
            0.3, 5.85, -0.5,     // 23


        ]), 3));
        blackLockingGeometry1.setIndex([
            // front
            0, 1, 5,
            0, 5, 6,
            1, 2, 5,
            5, 2, 3,
            5, 3, 4,
            0, 6, 11,
            11, 6, 10,
            10, 6, 7,
            10, 7, 9,
            9, 7, 8,

            // back
            17, 13, 12,
            18, 17, 12,
            17, 14, 13,
            15, 14, 17,
            16, 15, 17,
            23, 18, 12,
            22, 18, 23,
            19, 18, 22,
            21, 19, 22,
            20, 19, 21,

            // sides
            0, 12, 13,
            0, 13, 1,
            1, 13, 14,
            1, 14, 2,
            2, 14, 15,
            2, 15, 3,
            3, 15, 16,
            3, 16, 4,
            4, 16, 5,
            5, 16, 17,
            5, 17, 6,
            6, 17, 18,
            18, 19, 6,
            6, 19, 7,
            7, 19, 8,
            8, 19, 20,
            8, 20, 21,
            21, 9, 8,
            21, 22, 9,
            9, 22, 10,
            22, 11, 10,
            22, 23, 11,
            23, 0, 11,
            23, 12, 0
        ]);
        blackLockingGeometry1.computeVertexNormals();
        const blackLockingGeometry2 = new THREE.CylinderGeometry(0.3, 0.3, 0.45, 16).translate(4.9, 5.75-0.225, 0);
        const blackLockingCSG = CSG.union([blackLockingGeometry1, blackLockingGeometry2]);
        const blackLockingGeometry = CSG.BufferGeometry(blackLockingCSG);
        const blackLocking = new THREE.Mesh(blackLockingGeometry, corpusMaterial);
        blackLocking.position.set(16.3, 16.655 -0.91, -12.4);
        this.rotateAboutPoint(
            blackLocking,                                       // Object to rotate
            new THREE.Vector3(21.2, 15.075, -12.4),    // Pivotpoint for rotation
            new THREE.Vector3(0, 1, 0),                // Axis for rotation
            THREE.MathUtils.degToRad(-57.5),            // rotation angle
            false);                                 // point is local, because object is added to Turntable
        blackLocking.name = 'blackLocking';
        this.add(blackLocking);


        // Arm (Group)
        // -----------

        const arm = new THREE.Group();
        arm.position.set(21.2, 18.855, -12.4);
        arm.name = 'arm';

        const tweenRollingSide = new TWEEN.Tween(arm.rotation)
            .to(new THREE.Vector3(
                arm.rotation.x + THREE.MathUtils.degToRad(2.4), arm.rotation.y + THREE.MathUtils.degToRad(-46), arm.rotation.z
            ), 35000)
            .onStart(() => {
                this.speakerL.soundT.play();
                this.speakerR.soundT.play();
                horizontalJoint.userData.tweenRollingArmPlastic.start();
            })
            .onStop(() => {
                this.speakerL.soundT.pause();
                this.speakerR.soundT.pause();
                horizontalJoint.userData.tweenRollingArmPlastic.stop();
            })
            .onUpdate(() => {
                if (!this.isRotating) {
                    arm.userData.tweenRollingSide.stop();
                    this.speakerL.cracklingT.pause();
                    this.speakerR.cracklingT.pause();
                } else if (this.isRotating && !this.speakerL.soundT.isPlaying && !this.speakerR.soundT.isPlaying && !this.speakerL.cracklingT.isPlaying && !this.speakerR.cracklingT.isPlaying) {
                    this.speakerL.cracklingT.play();
                    this.speakerR.cracklingT.play();
                    this.speakerL.cracklingT.setLoop(true);
                    this.speakerR.cracklingT.setLoop(true);
                }
            })
            .onComplete(() => {
                this.armIsOnEnd = true;
                if (this.isRotating && !this.speakerL.cracklingT.isPlaying && !this.speakerR.cracklingT.isPlaying) {
                    this.speakerL.cracklingT._progress = 0;
                    this.speakerL.cracklingT.play();
                    this.speakerL.cracklingT.setLoop(true);
                    this.speakerR.cracklingT._progress = 0;
                    this.speakerR.cracklingT.play();
                    this.speakerR.cracklingT.setLoop(true);
                }
            });

        const tweenToRecordDown = new TWEEN.Tween(arm.rotation)
            .to(new THREE.Vector3(
                arm.rotation.x + THREE.MathUtils.degToRad(2.4), arm.rotation.y + THREE.MathUtils.degToRad(-25.3), arm.rotation.z
            ), 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                if (this.isRotating){
                    arm.userData.tweenRollingSide.start();
                }
                this.armIsOnRecord = true;
            });
        const tweenToRecordSide = new TWEEN.Tween(arm.rotation)
            .to(new THREE.Vector3(
                arm.rotation.x, arm.rotation.y + THREE.MathUtils.degToRad(-25.3), arm.rotation.z
            ), 1500)
            .chain(tweenToRecordDown)
            .easing(TWEEN.Easing.Quadratic.InOut);

        const tweenFromRecordSide = new TWEEN.Tween(arm.rotation)
            .to(new THREE.Vector3(
                arm.rotation.x, arm.rotation.y, arm.rotation.z
            ), 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                arm.rotation.set(0, 0, 0);
                this.armIsOnRecord = false;
            });

        const tweenFromRecordUpStart = new TWEEN.Tween(arm.rotation)
            .to(new THREE.Vector3(
                arm.rotation.x, arm.rotation.y + THREE.MathUtils.degToRad(-25.3), arm.rotation.z
            ), 1000)
            .chain(tweenFromRecordSide)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onStart(() => {
                this.armIsOnEnd = false;
                arm.userData.tweenRollingSide.stop();
                this.speakerL.soundT._progress = 0;
                this.speakerR.soundT._progress = 0;
                this.speakerL.cracklingT.pause();
                this.speakerL.cracklingT._progress = 0;
                this.speakerR.cracklingT.pause();
                this.speakerR.cracklingT._progress = 0;
            });

        const tweenFromRecordUpEnd = new TWEEN.Tween(arm.rotation)
            .to(new THREE.Vector3(
                arm.rotation.x, arm.rotation.y + THREE.MathUtils.degToRad(-46), arm.rotation.z
            ), 1000)
            .chain(tweenFromRecordSide)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onStart(() => {
                this.armIsOnEnd = false;
                arm.userData.tweenRollingSide.stop();
                this.speakerL.soundT._progress = 0;
                this.speakerR.soundT._progress = 0;
                this.speakerL.cracklingT.pause();
                this.speakerL.cracklingT._progress = 0;
                this.speakerR.cracklingT.pause();
                this.speakerR.cracklingT._progress = 0;
            });

        arm.userData = {
            tweenToRecordSide: tweenToRecordSide,
            tweenToRecordDown: tweenToRecordDown,
            tweenFromRecordSide: tweenFromRecordSide,
            tweenFromRecordUpStart: tweenFromRecordUpStart,
            tweenFromRecordUpEnd: tweenFromRecordUpEnd,
            tweenRollingSide: tweenRollingSide
        };

        this.add(arm);

        this.rotateAboutPoint(
            arm,
            new THREE.Vector3(21.2, 15.075, -12.4),
            new THREE.Vector3(0, 1, 0),
            THREE.MathUtils.degToRad(-5),
            false
        );

            // various cylinders
            const armCylinder1Geometry = new THREE.CylinderGeometry(0.85, 0.85, 6.75, 32);
            const armCylinder1 = new THREE.Mesh(armCylinder1Geometry, metalMaterial);
            armCylinder1.rotateX(THREE.MathUtils.degToRad(90));
            arm.add(armCylinder1);

            const armCylinder2Geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16);
            const armCylinder2 = new THREE.Mesh(armCylinder2Geometry, metalMaterial);
            armCylinder2.rotateX(THREE.MathUtils.degToRad(90));
            armCylinder2.position.set(0, 0, -3.375 - 0.15);
            arm.add(armCylinder2);

            const armCylinder3Geometry = new THREE.CylinderGeometry(0.85, 0.85, 6.75, 32);
            const armCylinder3 = new THREE.Mesh(armCylinder3Geometry, metalMaterial);
            armCylinder3.rotateX(THREE.MathUtils.degToRad(90));
            armCylinder3.position.set(0, 0, -3.675 - 3.375);
            arm.add(armCylinder3);

            // arm weight (group)
            const armWeight = new THREE.Group();
            armWeight.name = "armWeight";
            arm.add(armWeight);
            armWeight.position.set(0, 0, -3.675 - 2.2);

                const armCylinder4_1Geometry = new THREE.CylinderGeometry(0.85, 2,0.4, 32)
                    .rotateX(THREE.MathUtils.degToRad(90));
                const armCylinder4_2Geometry = new THREE.CylinderGeometry(2, 2,0.4, 32)
                    .rotateX(THREE.MathUtils.degToRad(90))
                    .translate(0, 0, -0.4);
                const armCylinder4CSG = CSG.union([armCylinder4_1Geometry, armCylinder4_2Geometry]);
                const armCylinder4Geometry = CSG.BufferGeometry(armCylinder4CSG);
                const armCylinder4 = new THREE.Mesh(armCylinder4Geometry, corpusMaterial);
                armWeight.add(armCylinder4);

                const armCylinder5Geometry = new THREE.CylinderGeometry(2, 2, 2.5, 32)
                    .rotateX(THREE.MathUtils.degToRad(90))
                    .translate(0,0,-0.6 - 2.5/2);
                const armCylinder5 = new THREE.Mesh(armCylinder5Geometry, metalMaterial);
                armWeight.add(armCylinder5);

                const armCylinder6Geometry = new THREE.CylinderGeometry(2, 2,0.4, 32)
                    .rotateX(THREE.MathUtils.degToRad(90))
                    .translate(0,0,-0.6 - 2.5 - 0.2);
                const armCylinder6 = new THREE.Mesh(armCylinder6Geometry, corpusMaterial);
                armWeight.add(armCylinder6);

            // arm curve
            const armProfile = new THREE.Shape().absellipse(0, 0, 0.6, 0.6,
                0, THREE.MathUtils.degToRad(360));
            const armCurveSpline = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1.6, 0, 0),
                new THREE.Vector3(13.6, 0, -2.6),
                new THREE.Vector3(22, 0, -0.5)
            ]);
            armCurveSpline.curveType = 'centripetal';
            const extrudeSettings = {
                steps: 200,
                curveSegments: 100,
                extrudePath: armCurveSpline
            };
            const armCurveGeometry = new THREE.ExtrudeGeometry(armProfile, extrudeSettings).rotateY(THREE.MathUtils.degToRad(-90));
            const armCurve = new THREE.Mesh(armCurveGeometry, metalMaterial);
            armCurve.position.set(0, 0, 6.75/2);
            arm.add(armCurve);

            // needle head (group)
            const needleHead = new THREE.Group();
            needleHead.position.set(0.25, 0, 26);
            needleHead.rotateY(THREE.MathUtils.degToRad(-19));
            needleHead.name = "needleHead";
            arm.add(needleHead);

            const needleHeadCyl1Geo = new THREE.CylinderGeometry(0.7, 0.7, 1.9, 32);
            const needleHeadCyl1 = new THREE.Mesh(needleHeadCyl1Geo, metalMaterial);
            needleHeadCyl1.rotateX(THREE.MathUtils.degToRad(90));
            needleHeadCyl1.position.set(0, 0, 0);
            needleHead.add(needleHeadCyl1);

            const needleHeadCyl2Geo = new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32);
            const needleHeadCyl2 = new THREE.Mesh(needleHeadCyl2Geo, metalMaterial);
            needleHeadCyl2.rotateX(THREE.MathUtils.degToRad(90));
            needleHeadCyl2.position.set(0, 0, -0.3);
            needleHead.add(needleHeadCyl2);

            const needleHeadCyl3Geo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
            const needleHeadCyl3 = new THREE.Mesh(needleHeadCyl3Geo, metalMaterial);
            needleHeadCyl3.rotateX(THREE.MathUtils.degToRad(90));
            needleHeadCyl3.position.set(0, 0, 0.95 + 0.2);
            needleHead.add(needleHeadCyl3);

            const needleHeadCyl4Geo = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
            const needleHeadCyl4 = new THREE.Mesh(needleHeadCyl4Geo, redPlasticMaterial);
            needleHeadCyl4.rotateX(THREE.MathUtils.degToRad(90));
            needleHeadCyl4.position.set(0, 0, 1.35 + 1);
            needleHead.add(needleHeadCyl4);

            const needleHeadCyl5Geo = new THREE.CylinderGeometry(0.85, 0.85, 0.75, 32);
            const needleHeadCyl5 = new THREE.Mesh(needleHeadCyl5Geo, redPlasticMaterial);
            needleHeadCyl5.rotateX(THREE.MathUtils.degToRad(90));
            needleHeadCyl5.position.set(0, 0, 1.8);
            needleHead.add(needleHeadCyl5);

            const needleGrabGeo1 = new THREE.BoxGeometry(1.2, 0.05, 0.5)
                .translate(1.8, 0, 1.8)
                .rotateZ(THREE.MathUtils.degToRad(30));
            const needleGrabGeo2 = new THREE.BoxGeometry(1, 0.05, 0.5)
                .translate(2.555, 1.195, 1.8);
            const needleGrabCSG = CSG.union([needleGrabGeo1, needleGrabGeo2]);
            const needleGrabGeometry = CSG.BufferGeometry(needleGrabCSG);
            const needleGrab = new THREE.Mesh(needleGrabGeometry, redPlasticMaterial);
            needleGrab.position.set(-0.5, 0, 0);
            needleHead.add(needleGrab);

            const needleHeadEndBaseGeo = new THREE.CylinderGeometry(0.4, 0.6, 6, 32)
                .rotateX(THREE.MathUtils.degToRad(90))
                .translate(0, 0, 3.35 + 3);
            const rectEndTopGeo = new THREE.BoxGeometry(7, 0.35, 1)
                .rotateZ(THREE.MathUtils.degToRad(-2))
                .rotateY(THREE.MathUtils.degToRad(90))
                .translate(0, -0.35, 7);
            const rectEndBottomGeo = new THREE.BoxGeometry(7, 0.35, 1)
                .rotateZ(THREE.MathUtils.degToRad(2))
                .rotateY(THREE.MathUtils.degToRad(90))
                .translate(0, 0.35, 7);
            const rectNeedleCutout = new THREE.BoxGeometry(0.4, 2, 0.4).translate(0, 0, 9.2);
            const needleHeadCSG = CSG.subtract([needleHeadEndBaseGeo, rectEndBottomGeo, rectNeedleCutout]);
            const needleHeadEndGeo = CSG.BufferGeometry(needleHeadCSG);
            const needleHeadEnd = new THREE.Mesh(needleHeadEndGeo, redPlasticMaterial);

            const needleGeometry = new THREE.CylinderGeometry(0.005, 0.025, 0.8, 16)
                .rotateX(THREE.MathUtils.degToRad(160))
                .translate(0, -0.53, 9.05);
            const needle = new THREE.Mesh(needleGeometry, metalMaterial);
            needleHeadEnd.add(needle);
            needleHead.add(needleHeadEnd);

        /**
         * calculateUvs
         * -----------------------
         * Calculates UV-coordinates for rectangular texture mapping.
         * It is based on the geometry's information for its position.
         *
         * Requirement: pivotpoint of rectangular object is in the middle of the geometry.
         *
         * @param geometry THREE geometry for which UVs need to be calculated
         * @param width width of geometry (first axis; e.g. 'x')
         * @param height height of geometry (second axis; e.g. 'z')
         * @param axes Array of two Strings that contain the axes of the plane
         * @param stretchX stretch texture in width
         * @param stretchY stretch texture in height
         * @param offsetX move texture in width (ends will be cut off)
         * @param offsetY move texture in height (ends will be cut off)
         * @returns {*[]} an Array of UV-coordinates; every two values result in (u, v)
         */
        function calculateUvs(geometry, width, height, axes, stretchX, stretchY, offsetX, offsetY) {
            width += stretchX;
            height += stretchY;
            let axis1, axis2;
            // define modulo results based on axes; 0 = x, 1 = y, 2 = z
            if (axes[0] === 'x') {
                axis1 = 0;
                if (axes[1] === 'y') {axis2 = 1;} else {axis2 = 2;}
            } else {
                axis1 = 1;
                axis2 = 2;
            }
            const positionInfo = geometry.getAttribute('position');
            const vertices = positionInfo.array;
            let x, y;
            const uvs = [];
            for (let i = 0; i < vertices.length; i++) {
                if (i % 3 === axis1) {                                  // x-coordinate
                    x = vertices[i];
                    if (Math.abs(x + offsetX) > width/2){        // count in offset X
                        x = offsetX/Math.abs(offsetX) * width/2;    // if out of bounds, point = bounds
                    } else {
                        x += offsetX;
                    }
                    uvs.push((width/2 + x)/width); // calculate (x) -> u
                } else if (i % 3 === axis2) { // z-coordinate
                    y = vertices[i];
                    if (Math.abs(y + offsetY) > width/2){ // count in offset Y
                        y = offsetY/Math.abs(offsetY) * width/2; // if out of bounds, point = bounds
                    } else {
                        y += offsetY;
                    }
                    uvs.push((height/2 + y)/height); // calculate (z) -> v
                }
            }
            return uvs;
        }

        /**
         * setVertexUvs
         * ------------
         * Uses function 'calculateUvs' for setting the uv-attributes of a geometry.
         *
         * @param geometry THREE geometry that needs its UVs to be set.
         * @param width width of geometry (first axis; e.g. 'x')
         * @param height height of geometry (second axis; e.g. 'z')
         * @param axes Array of two Strings that contain the axes of the plane
         * @param stretchX stretch texture in width
         * @param stretchY stretch texture in height
         * @param offsetX move texture in width (ends will be cut off)
         * @param offsetY move texture in height (ends will be cut off)
         *
         * Does not return anything.
         */
        function setVertexUvs(geometry, width, height, axes = ['x', 'z'], stretchX = 0, stretchY = 0, offsetX = 0, offsetY = 0) {
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(calculateUvs(geometry, width, height, axes, stretchX, stretchY, offsetX, offsetY), 2));
        }





    }

    /**
     * rotateAboutPoint
     * ----------------
     * @Author TheJim01
     * https://stackoverflow.com/a/42866733 (answered Mar 17 '17 at 20:40; edited Aug 5 '19 at 16:36)
     * _Abruf: 13.01.2022 13:30 Uhr_
     *
     * Rotates an object about a given point for a given angle.
     *
     * @param obj your object (THREE.Object3D or derived)
     * @param point the point of rotation (THREE.Vector3)
     * @param axis the axis of rotation (normalized THREE.Vector3)
     * @param theta radian value of rotation
     * @param pointIsWorld boolean indicating the point is in world coordinates (default = false)
     */
    rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
        pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

        if(pointIsWorld){
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if(pointIsWorld){
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }


    addPhysics() {
        if(this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            const boundingBox = new THREE.Box3().setFromObject(this);
            const boundingBoxSize = new THREE.Vector3();
            boundingBox.getSize(boundingBoxSize);
            window.physics.addBox(this, 10, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 0, boundingBoxSize.y/2, 0, true);
        }
    }

    setWireFrame(){
        this.wireframe = !this.wireframe;
        this.traverse((child => {
            if (child.isMesh) {
                child.material.wireframe = this.wireframe;
                if (child.name === 'rotaryDiscWithRecord') {
                    child.material[0].wireframe = this.wireframe;
                    child.material[1].wireframe = this.wireframe;
                    child.material[2].wireframe = this.wireframe;
                }
                if (child.name === 'armPlateWeightCylinder') {
                    child.material[0].wireframe = this.wireframe;
                    child.material[1].wireframe = this.wireframe;
                    child.material[2].wireframe = this.wireframe;
                }
            }
        }));
    }

}