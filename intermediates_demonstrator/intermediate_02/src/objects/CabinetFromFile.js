import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import {GLTFLoader} from '../../../../lib/three.js-r134/examples/jsm/loaders/GLTFLoader.js';

export default class CabinetFromFile extends THREE.Group {

    constructor() {
        super();
        this.gltfLoader = new GLTFLoader();
        this.loadingDone = false;

        this.load(this);
    }


    load(thisCabinet) {
        this.gltfLoader.load('src/models/cabinet.gltf', function (gltf) {

            gltf.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });

            //let box = new THREE.Box3().setFromObject(thisCabinet);
            //console.log(box.min, box.max);

            thisCabinet.add(gltf.scene);
            thisCabinet.loadingDone = true;
        });
    }


    addPhysics() {
        if(this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            const boundingBox = new THREE.Box3().setFromObject(this);
            const boundingBoxSize = new THREE.Vector3();
            boundingBox.getSize(boundingBoxSize);
            window.physics.addBox(this, 10, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 3.5, boundingBoxSize.y/2 + 0.2, -4.7, true, true);
        }
    }
}