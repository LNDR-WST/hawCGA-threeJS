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
                    //object.material.wireframe = true;
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
            window.physics.addBox(this, 0, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 3.5, boundingBoxSize.y/2 + 0.2, -4.7, true, true);

            const vertices = [
                // Corpus
                [-108.5, 66.7, -29.6],  // 0
                [-108.5, 66.7, 20],     // 1
                [115, 66.7, 20],        // 2
                [115, 66.7, -29.6],     // 3

                [-108.5, 31, -29.6],    // 4
                [-108.5, 31, 20],       // 5
                [115, 31, 20],          // 6
                [115, 31, -29.6],       // 7

                // Left Foot Top
                [-64, 31, -29.6],       // 8
                [-64, 31, 20],          // 9
                [-57, 31, 20],          // 10
                [-57, 31, -29.6],       // 11

                // Right Foot Top
                [63, 31, -29.6],        // 12
                [63, 31, 20],           // 13
                [70, 31, 20],           // 14
                [70, 31, -29.6],        // 15

                // Left Foot Bottom
                [-67, 0, -29.6],        // 16
                [-67, 0, 20],           // 17
                [-63, 0, 20],           // 18
                [-63, 0, -29.6],        // 19

                // Right Foot Bottom
                [69, 0, -29.6],         // 20
                [69, 0, 20],            // 21
                [73, 0, 20],            // 22
                [73, 0, -29.6]          // 23
            ];

            const faces = [
                [0, 1, 3],    // top face corpus 1/2
                [3, 1, 2],    // top face corpus 2/2
                [0, 4, 1],    // left face corpus 1/2
                [1, 4, 5],    // left face corpus 2/2
                [2, 6, 3],    // right face corpus 1/2
                [3, 6, 7],    // right face corpus 2/2
                [1, 5, 2],    // front face corpus 1/2
                [2, 5, 6],    // front face corpus 2/2
                [3, 7, 0],    // back face corpus 1/2
                [0, 7, 4],    // back face corpus 2/2

                [4, 8, 5],   // bottom face corpus
                [5, 8, 9],
                [10, 11, 12],
                [12, 13, 10],
                [14, 15, 7],
                [7, 6, 14],

                [10, 18, 11], // Right
                [11, 18, 19],
                [8, 16, 9],   // Left
                [9, 16, 17],
                [9, 17, 10], // Front
                [10, 17, 18],
                [11, 19, 8], // Back
                [8, 19, 16],
                [17, 16, 19], // Bottom
                [19, 18, 16],

                [14, 22, 15], // Right
                [15, 22, 23],
                [12, 20, 13],   // Left
                [13, 20, 21],
                [13, 21, 14], // Front
                [14, 21, 22],
                [15, 23, 12], // Back
                [12, 23, 20],
                [21, 20, 23], // Bottom
                [23, 22, 20]
            ];
            //window.physics.addConvexPolyhedron(this, 0, vertices, faces, true);
        }
    }
}