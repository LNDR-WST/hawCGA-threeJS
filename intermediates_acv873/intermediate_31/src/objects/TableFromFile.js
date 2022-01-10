import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import {GLTFLoader} from '../../../../lib/three.js-r134/examples/jsm/loaders/GLTFLoader.js';

export default class TelevisionFromFile extends THREE.Group {

    constructor() {
        super();
        this.gltfLoader = new GLTFLoader();

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
        });
    }
}