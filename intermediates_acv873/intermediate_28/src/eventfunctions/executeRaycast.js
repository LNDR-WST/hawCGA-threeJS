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
      firstHit.userData.up = !firstHit.userData.up;
      if (firstHit.userData.up) {
        firstHit.userData.downTween.stop();
        firstHit.userData.upTween.start();
      } else {
        firstHit.userData.upTween.stop();
        firstHit.userData.downTween.start();
      }
    }

    if (firstHit.name === 'powerKnobGLTF') {
      firstHit.userData.state.powerOn = !firstHit.userData.state.powerOn;
      if (firstHit.userData.state.powerOn) {
        firstHit.userData.animations.get('powerKnob_off').stop();
        firstHit.userData.animations.get('powerKnob_on').play();
      } else {
        firstHit.userData.animations.get('powerKnob_on').stop();
        firstHit.userData.animations.get('powerKnob_off').play();
      }
    } else if (firstHit.name === 'volumeKnobGLTF') {
      firstHit.userData.state.volumeHigh = !firstHit.userData.state.volumeHigh;
      if (firstHit.userData.state.volumeHigh) {
        firstHit.userData.animations.get('volumeKnob_low').stop();
        firstHit.userData.animations.get('volumeKnob_high').play();
      } else {
        firstHit.userData.animations.get('volumeKnob_high').stop();
        firstHit.userData.animations.get('volumeKnob_low').play();
      }
    }

  }
}