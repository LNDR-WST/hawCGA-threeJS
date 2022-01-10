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

        const tabletopGeometry = new THREE.BoxGeometry(64, 1.375,49);
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













    }



}
// Quick temporary edit in Browser:
//window.scene.traverse(function(child) {
//   if (child.name === 'powerKnob') {
//     child.position.set(0, child.position.y, -0.7);
//   }
// });