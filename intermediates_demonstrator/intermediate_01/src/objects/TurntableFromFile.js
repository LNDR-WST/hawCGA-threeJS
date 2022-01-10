import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import {GLTFLoader} from '../../../../lib/three.js-r134/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../../../../lib/three.js-r134/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../../../../lib/three.js-r134/examples/jsm/utils/RoughnessMipmapper.js';

export default class TurntableFromFile extends THREE.Group {

    constructor() {
        super();
        this.gltfLoader = new GLTFLoader();
        this.loadingDone = false;

        this.load(this);
    }


    load(thisTurntable) {

        // TODO: HDR Environment map?

        this.gltfLoader.load('src/models/turntable.glb', function (gltf) {

            gltf.scene.traverse(function(child) {

                //console.log(child.name);

                // TODO: Check if shadows are being casted and received
                if(child.name === 'arm_grp' ||                      // Arm
                    child.name === 'polySurface6_body_top_mat_0' || // Korpus oben
                    child.name === 'polySurface20_phongE4_0' ||     // Korpus mitte
                    child.name === 'polySurface2_foot_mat_0' ||     // Fuß
                    child.name === 'polySurface7_foot_mat_0' ||     // Fuß
                    child.name === 'polySurface8_foot_mat_0' ||     // Fuß
                    child.name === 'polySurface9_foot_mat_0') {     // Fuß
                    child.castShadow = true;
                }
                if (child.name === 'polySurface6_body_top_mat_0' || // Korpus oben
                    child.name === 'polySurface20_phongE4_0' ||     // Korpus mitte
                    child.name === 'table_sm_tt_sp_mat_0' ||        // Vinyl-Platte
                    child.name === 'table_sm_tt_sp_mat_0') {        // Ring
                        child.receiveShadow = true;
                }

            });

            thisTurntable.add(gltf.scene);
            thisTurntable.loadingDone = true;
        });
    }

    // TODO: set physics when physics engine is implemented
    // addPhysics() {
    //     if(this.loadingDone === false) {
    //         window.setTimeout(this.addPhysics.bind(this), 100);
    //     } else {
    //         const boundingBox = new THREE.Box3().setFromObject(this);
    //         const boundingBoxSize = new THREE.Vector3();
    //         boundingBox.getSize(boundingBoxSize);
    //         window.physics.addBox(this, 10, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 0, boundingBoxSize.y/2, 0);
    //     }
    // }
}