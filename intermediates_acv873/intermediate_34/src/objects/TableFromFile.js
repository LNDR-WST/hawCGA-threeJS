import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import {GLTFLoader} from '../../../../lib/three.js-r134/examples/jsm/loaders/GLTFLoader.js';

export default class TelevisionFromFile extends THREE.Group {

    constructor() {
        super();
        this.gltfLoader = new GLTFLoader();
        this.loadingDone = false;

        this.load(this);
    }

    load(thisTable) {

        this.gltfLoader.load('src/models/table.gltf', function (gltf) {

            gltf.scene.traverse(function(child) {

                console.log(child.name);

                if(child.name === 'surface' || child.name === 'legs') {
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
            });

            thisTable.add(gltf.scene);
            thisTable.loadingDone = true;
        });
    }

    addPhysics() {
        if(this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            const boundingBox = new THREE.Box3().setFromObject(this);
            const boundingBoxSize = new THREE.Vector3();
            boundingBox.getSize(boundingBoxSize);
            window.physics.addBox(this, 10, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 0, boundingBoxSize.y/2, 0);
        }
    }
}