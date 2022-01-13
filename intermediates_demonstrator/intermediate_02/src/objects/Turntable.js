import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import CSG from '../../../../lib/three-csg-2020/dist/three-csg.js';
import * as TWEEN from '../../../../lib/tween.js-18.6.4/dist/tween.esm.js';

export default class Turntable extends THREE.Group {

    constructor() {
        super();

        this.animations = [];
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

        const footMaterial = new THREE.MeshPhongMaterial({ // wie corpusMaterial, aber Smooth-Shading
            color: 0x111111,
            flatShading: false,
            specular: 0x111111,
            shininess: 30
        });

        const tabletopMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            flatShading: false,
            roughness: 0.4,
            metalness: 1
        });

        const metalMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            flatShading: false,
            roughness: 0.2,
            metalness: 1
        });

        const emissivePowerMaterial = new THREE.MeshStandardMaterial({
            color: 0x2f0000,
            flatShading: false,
            roughness: 0.4,
            metalness: 0,
            emissive: 0x910000 // TODO: turn emissive to 0x000000 when 'power off'
        });


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
        this.add(corpus);

        // Tabletop
        // --------

        const tabletopBase = new THREE.BoxGeometry(64, 1.375,49);
        const tabletopSwitchCutout = new THREE.BoxGeometry(2.7, 0.25, 15.8).translate(27.45, 1.375/2, 9.8);
        const tabletopArmCutout = new THREE.CylinderGeometry(8.2, 8.2,1.3,32).translate(21.2, 1.375/2-0.5, -12.4);
        const tabletopCSG = CSG.subtract([tabletopBase, tabletopSwitchCutout, tabletopArmCutout]);
        const tabletopGeometry = CSG.BufferGeometry(tabletopCSG);

        const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
        tabletop.position.set(0, 14.3875, 0); // Oberes Face bei z = 15.075
        this.add(tabletop);

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
        this.add(footBackLeft);

        // vorne links
        const footFrontLeft = footBackLeft.clone();
        footFrontLeft.position.set(-25, 0, 19.25);
        this.add(footFrontLeft);

        // hinten rechts
        const footBackRight = footBackLeft.clone();
        footBackRight.position.set(25, 0, -19.25);
        this.add(footBackRight);

        // vorne rechts
        const footFrontRight = footBackLeft.clone();
        footFrontRight.position.set(25, 0, 19.25);
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
        this.add(singlePuk);

        // Rotary Disc
        // -----------

        const rotaryDiscGeometry = new THREE.CylinderGeometry(21.3,23.4, 1.82, 64);
        const rotaryDisc = new THREE.Mesh(rotaryDiscGeometry, metalMaterial);
        rotaryDisc.name = 'rotaryDisk';

            // Plattenzentrierung
            const centerCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
            const centerSphere = new THREE.SphereGeometry(0.5, 32, 32).translate(0, 0.75, 0);
            const rotaryDiskCenterCSG = CSG.union([centerCylinder, centerSphere]);

            const rotaryDiskCenterGeometry = CSG.BufferGeometry(rotaryDiskCenterCSG);
            const rotaryDiskCenter = new THREE.Mesh(rotaryDiskCenterGeometry, metalMaterial);
            rotaryDisc.add(rotaryDiskCenter);
            rotaryDisc.children[0].position.set(0, 1.66, 0);

        rotaryDisc.position.set(-6.5, 15.075 + 1.82/2, 0);
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
        const actualSwitchGeometry = new THREE.CylinderGeometry(1.9, 1.9, 0.5, 16);
        const actualSwitch = new THREE.Mesh(actualSwitchGeometry, tabletopMaterial);
        actualSwitch.position.set(0, 1.75 + 0.5/2, 0);
        actualSwitch.name = 'actualSwitch'; // TODO: this needs to be rotated later

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
        const startStopButton = new THREE.Mesh(startStopButtonGeometry, metalMaterial);
        startStopButton.position.set(-27.5, 15.175, 21.2);
        startStopButton.name = 'startStopButton'; // TODO: needs to be pushed later
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
        const fourtyFiveButton = new THREE.Mesh(fourtyFiveButtonGeometry, metalMaterial);
        fourtyFiveButton.position.set(-22, 15.175, 21.2 + 4.5/2 - 1.1/2);
        fourtyFiveButton.name = 'fourtyFiveButton'; // TODO: needs to be pushed later
        this.add(fourtyFiveButton);


        // 33 RPM Button
        const thirtyThreeButtonFrameGeometry = new THREE.BoxGeometry(3.5, 0.1, 1.1);
        const thirtyThreeButtonFrame = new THREE.Mesh(thirtyThreeButtonFrameGeometry, corpusMaterial);
        thirtyThreeButtonFrame.position.set(-22 + 3.5, 15.125, 21.2 + 4.5/2 - 1.1/2);
        this.add(thirtyThreeButtonFrame);

        const thirtyThreeButton = fourtyFiveButton.clone();
        thirtyThreeButton.position.set(-22 + 3.5, 15.175, 21.2 + 4.5/2 - 1.1/2);
        thirtyThreeButton.name = 'thirtyThreeButton'; // TODO: needs to be pushed later
        this.add(thirtyThreeButton);

        // Nadelbeleuchtung
        // ----------------

        const temporaryGroup = new THREE.Group();

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
        needleLight.position.set(-1.2, 0.125 + 1.8, 0);
        needleLight.name = 'needleLight';       // TODO: Needs to go down, when pushed; up, when turned on via button to the right
        needleLightingPlate.add(needleLight);   // child[0]

        const needleLightOnButtonGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
        const needleLightOnButton = new THREE.Mesh(needleLightOnButtonGeometry, metalMaterial);
        needleLightOnButton.position.set(1.2, -0.25, 0);
        needleLight.name = 'needleLightOnButton';   // TODO: Turns on and lifts up needleLight
        needleLightingPlate.add(needleLightOnButton);   // child[1]

        this.add(needleLightingPlate);


        // Speed Slider
        // ------------

        // Rectangle: Kante nach oben drehen, jeweils zwei Zylinder wegschneiden

        const speedSliderCSG = CSG.subtract([
            new THREE.BoxGeometry(2.675, 1.8, 1.8).rotateX(THREE.MathUtils.degToRad(45)),
            new THREE.CylinderGeometry(0.9, 0.9, 2.7, 64).rotateZ(THREE.MathUtils.degToRad(90)).translate(0, 1, -1),
            new THREE.CylinderGeometry(0.9, 0.9, 2.7, 64).rotateZ(THREE.MathUtils.degToRad(90)).translate(0, 1, 1),
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
        const armPlate2cylinder = new THREE.CylinderGeometry(1.5, 1.5, 0.72, 16).translate(5.4, 2.285, 0);
        const armPlate2CSG = CSG.union([armPlate2base, armPlate2extension, armPlate2cylinder]);
        const armPlate2Geometry = CSG.BufferGeometry(armPlate2CSG);
        const armPlate2 = new THREE.Mesh(armPlate2Geometry, corpusMaterial);
        basePlate.add(armPlate2);

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
            2.5, -1.2, 0.375,       // 6
            2.5, 1.2, 0.375,        // 7

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
            2.5, -1.2, -0.375,       // 22
            2.5, 1.2, -0.375,        // 23

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
        horizontalJoint.name = 'horizontalJoint'; // TODO: needs to be rotated later
        this.add(horizontalJoint);


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
        const blackLockingGeometry2 = new THREE.CylinderGeometry(0.3, 0.3, 0.45, 16).translate(4.95, 5.75-0.225, 0);
        const blackLockingCSG = CSG.union([blackLockingGeometry1, blackLockingGeometry2]);
        const blackLockingGeometry = CSG.BufferGeometry(blackLockingCSG);
        const blackLocking = new THREE.Mesh(blackLockingGeometry, corpusMaterial);
        blackLocking.position.set(16.3, 16.655 -0.91, -12.4);
        this.add(blackLocking); // TODO: rotate







    }



}
// Quick temporary edit in Browser:
//window.scene.traverse(function(child) {
//   if (child.name === 'powerKnob') {
//     child.position.set(0, child.position.y, -0.7);
//   }
// });