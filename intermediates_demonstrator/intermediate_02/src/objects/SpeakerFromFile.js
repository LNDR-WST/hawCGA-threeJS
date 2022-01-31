import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import {GLTFLoader} from '../../../../lib/three.js-r134/examples/jsm/loaders/GLTFLoader.js';
import { PositionalAudioHelper } from '../../../../lib/three.js-r134/examples/jsm/helpers/PositionalAudioHelper.js';

export default class SpeakerFromFile extends THREE.Group {

    constructor(soundTurntable, soundTurntableFF, cracklingT, cracklingTFF) {
        super();
        this.gltfLoader = new GLTFLoader();
        this.loadingDone = false;

        this.soundT = soundTurntable;
        this.cracklingT = cracklingT;

        this.soundTFF = soundTurntableFF;
        this.cracklingTFF = cracklingTFF;

        //const helper = new PositionalAudioHelper(soundTurntable, 2 );
        //soundTurntable.add(helper);

        this.load(this);
    }


    load(thisSpeaker) {
        this.gltfLoader.load('src/models/speaker.gltf', function (gltf) {

            //let box = new THREE.Box3().setFromObject(thisSpeaker);
            //console.log(box.min, box.max);

            gltf.scene.traverse((object) => {
               if (object.isMesh) {
                   object.castShadow = true;
                   object.receiveShadow = true;
               }
            });

            const speaker = gltf.scene;
            speaker.add(thisSpeaker.soundT, thisSpeaker.soundTFF, thisSpeaker.cracklingT, thisSpeaker.cracklingTFF);

            thisSpeaker.add(speaker);
            thisSpeaker.loadingDone = true;
        });
    }


    addPhysics() {
        if(this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            const cube = new THREE.Mesh(new THREE.BoxGeometry(31.5, 50, 30), new THREE.MeshLambertMaterial());
            const boundingBox = new THREE.Box3().setFromObject(cube);
            const boundingBoxSize = new THREE.Vector3();
            boundingBox.getSize(boundingBoxSize);
            window.physics.addBox(this, 20, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 0, 0, 0, false);
        }
    }
}