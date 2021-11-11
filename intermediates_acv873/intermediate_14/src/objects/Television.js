import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import CSG from '../../../../lib/three-csg-2020/dist/three-csg.js';

export default class Television extends THREE.Group {

  constructor() {
    super();

    this.addParts();
  }

  addParts() {

    const corpusMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4000,
      flatShading: true
    });

    const frontMaterial = new THREE.MeshPhongMaterial({
      color: 0x000000,
      flatShading: true
    });

    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true
    });

    const panelMaterial = new THREE.MeshPhongMaterial({
      color: 0x111111,
      flatShading: true
    });

    const metalMaterial = new THREE.MeshPhongMaterial({
      color: 0xe7e7e7,
      flatShading: true
    });


    // Corpus
    // ------
    const positions = [
      25.0, 18.2, 16.5,     // 0
      -25.0, 18.2, 16.5,    // 1
      -25.0, -14.7, 16.5,   // 2
      25.0, -14.7, 16.5,    // 3
      16.8, 11.0, -18.0,    // 4
      -16.8, 11.0, -18.0,   // 5
      -16.8, -13.0, -18.0,  // 6
      16.8, -13.0, -18.0,   // 7
      17.5, -14.6, 14.0,    // 8
      -17.5, -14.6, 14.0,   // 9
      -17.5, -16.8, 14.0,   // 10
      17.5, -16.8, 14.0,    // 11
      14.8, -13.85, -2.0,   // 12
      -14.8, -13.85, -2.0,  // 13
      -14.8, -16.8, -2.0,   // 14
      14.8, -16.8, -2.0     // 15
    ];

    const indices = [
      0, 1, 2,    // body front 1/2
      0, 2, 3,    // body front 2/2
      1, 5, 6,    // body left 1/2
      1, 6, 2,    // body left 2/2
      4, 0, 3,    // body right 1/2
      4, 3, 7,    // body right 2/2
      4, 5, 1,    // body top 1/2
      4, 1, 0,    // body top 2/2
      3, 2, 6,    // body bottom 1/2
      3, 6, 7,    // body bottom 2/2
      5, 4, 7,    // body back 1/2
      5, 7, 6,    // body back 2/2
      8, 9, 10,   // foot front 1/2
      8, 10, 11,  // foot front 2/2
      9, 13, 14,  // foot left 1/2
      9, 14, 10,  // foot left 2/2
      12, 8, 11,  // foot right 1/2
      12, 11, 15, // foot right 2/2
      11, 10, 14, // foot bottom 1/2
      11, 14, 15, // foot bottom 2/2
      13, 12, 15, // foot back 1/2
      13, 15, 14  // foot back 2/2
    ];

    // Corpus
    const corpusGeometry = new THREE.BufferGeometry();
    corpusGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    corpusGeometry.setIndex(indices);
    corpusGeometry.computeVertexNormals();
    //const corpus = new THREE.Mesh(corpusGeometry, corpusMaterial);

    // Cave out smaller corpus
    const cavityGeometry = new THREE.BufferGeometry();
    cavityGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    cavityGeometry.setIndex(indices.slice(0, 36));
    cavityGeometry.computeVertexNormals();
    cavityGeometry.translate(0, 0.4, 4);
    cavityGeometry.scale(1, 0.98, 1);
    const hollowCorpusGeometryCSG = CSG.subtract([corpusGeometry, cavityGeometry]);
    const hollowCorpusGeometry = CSG.BufferGeometry(hollowCorpusGeometryCSG);
    const corpus = new THREE.Mesh(hollowCorpusGeometry, corpusMaterial);
    corpus.castShadow = true;
    this.add(corpus);

    // Front
    const frontGeometry = new THREE.PlaneGeometry(48, 32);
    const front = new THREE.Mesh(frontGeometry, frontMaterial);
    front.position.set(0, 1.5, 15.5);
    this.add(front);

    // Screen
    const screenGeometry = new THREE.BoxGeometry(26, 22, 1);
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(-5.7, 2, 16);
    this.add(screen);

    // control panel
    const powerKnobGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
    const powerKnob = new THREE.Mesh(powerKnobGeometry, metalMaterial);
    powerKnob.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    const powerKnobGripGeometry = new THREE.BoxGeometry(1, 4, 0.5);
    const powerKnobGrip = new THREE.Mesh(powerKnobGripGeometry, metalMaterial);
    powerKnobGrip.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    powerKnobGrip.position.set(0, -0.5, 0);
    powerKnob.add(powerKnobGrip);
    powerKnob.position.set(0, 6.5, 1);

    const volumeKnobGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32);
    const volumeKnob = new THREE.Mesh(volumeKnobGeometry, metalMaterial);
    volumeKnob.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    const volumeKnobGripGeometry = new THREE.BoxGeometry(1, 4, 0.5);
    const volumeKnobGrip = new THREE.Mesh(volumeKnobGripGeometry, metalMaterial);
    volumeKnobGrip.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    volumeKnobGrip.position.set(0, -0.5, 0);
    volumeKnob.add(volumeKnobGrip);
    volumeKnob.position.set(0, 1, 1);

    const panelGeometry = new THREE.BoxGeometry(8, 22, 1);
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.add(powerKnob, volumeKnob);
    panel.position.set(17.5, 2, 15.5);
    this.add(panel);

  }
}