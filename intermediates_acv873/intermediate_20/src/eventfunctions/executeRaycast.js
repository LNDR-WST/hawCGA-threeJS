import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {

  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    if (firstHit.name === 'powerKnob' || firstHit.name === 'volumeKnob') {
      if (firstHit.children.length > 0) {
        firstHit.userData.toggleEndPosition();
      } else {
        firstHit.parent.userData.toggleEndPosition();
      }
    } else if (firstHit.name === 'antenna') {
      // If Antenna is up; boolean as first element
      if(firstHit.userData[0]) {
        console.log(THREE.MathUtils.radToDeg(firstHit.rotation.x));
        firstHit.userData[1].stop();
        firstHit.userData[2].start();
        firstHit.userData[0] = false;
      } else {
        console.log(THREE.MathUtils.radToDeg(firstHit.rotation.x));
        firstHit.userData[2].stop();
        firstHit.userData[1].start();
        firstHit.userData[0] = true;
      }
    }
  }
}