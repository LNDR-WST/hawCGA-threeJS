import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';

window.raycaster = new THREE.Raycaster();

export function executeRaycast() {

  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);

  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    console.log(firstHit.name);
    if (firstHit.parent.name === "needleHead" || firstHit.parent.name === "arm") {
      document.getElementById('element').innerText = "Clicked: arm";
    } else if (firstHit.name !== "") {
      document.getElementById('element').innerText = "Clicked: " + firstHit.name;
    }

    if (firstHit.name === 'actualPowerSwitch') {
      window.powerOn = !window.powerOn;
    }

    if (firstHit.name === 'startStopButton') {
      window.isRotating = !window.isRotating;
    }

    if (firstHit.name === '45rpmButton') {
      window.playbackRpm = 45;
    }

    if (firstHit.name === '33rpmButton') {
      window.playbackRpm = 33;
    }

    if (firstHit.name === 'needleLightOnButton') {
      window.needleLightIsOn = !window.needleLightIsOn;
    }

    if (firstHit.name === 'speedSlider') {
      //firstHit.position
    }

    if (firstHit.parent.name === "needleHead" || firstHit.parent.name === "arm") {
      window.armIsOnRecord = !window.armIsOnRecord;
    }







  }
}