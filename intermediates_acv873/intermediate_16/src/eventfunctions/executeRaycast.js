import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {

    window.raycaster.setFromCamera(window.mousePosition, window.camera);
    let intersects = window.raycaster.intersectObject(window.scene, true);

    console.log(intersects.length);

}