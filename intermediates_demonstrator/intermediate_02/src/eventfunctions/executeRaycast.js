import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';


window.raycaster = new THREE.Raycaster();

export function executeRaycast() {

  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);


  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    if (firstHit.parent.name === "needleHead" || firstHit.parent.name === "arm") {
      document.getElementById('element').innerText = "Clicked last: arm";
    } else if (firstHit.name !== "") {
      document.getElementById('element').innerText = "Clicked last: " + firstHit.name;
    }

    if (firstHit.name === 'actualPowerSwitch') {
      const powerSwitch = firstHit;
      const turntable = powerSwitch.parent.parent;
      turntable.isPoweredOn = !turntable.isPoweredOn;
      if (turntable.isPoweredOn) {
        powerSwitch.userData.tweenOff.stop();
        powerSwitch.userData.tweenLightOff.stop();
        powerSwitch.userData.tweenOn.start();
        powerSwitch.userData.tweenLightOn.start();
      } else {
        powerSwitch.userData.tweenOn.stop();
        powerSwitch.userData.tweenLightOn.stop();
        powerSwitch.userData.tweenOff.start();
        powerSwitch.userData.tweenLightOff.start();

        // Turn off rotation, when power is off.
        if (turntable.isRotating){
          turntable.getObjectByName('rotaryDiskWithRecord').userData.tweenStart.stop();
          turntable.getObjectByName('rotaryDiskWithRecord').userData.tweenRotate.stop();
          turntable.getObjectByName('rotaryDiskWithRecord').userData.tweenStop.start();
          turntable.isRotating = false;
        }
      }
    }

    else if (firstHit.name === 'startStopButton') {
      const startStopButton = firstHit;
      const turntable = startStopButton.parent;
      const rotaryDisc = turntable.getObjectByName('rotaryDiskWithRecord');
      startStopButton.userData.tweenPush.stop(); // interrupt first
      startStopButton.userData.tweenPush.start();
      if (turntable.isPoweredOn === true) {
        turntable.isRotating = !startStopButton.parent.isRotating;

        if (turntable.isRotating) {
          rotaryDisc.userData.tweenStop.stop();
          rotaryDisc.userData.tweenStart.start();
        } else {
          rotaryDisc.userData.tweenStart.stop();
          rotaryDisc.userData.tweenRotate.stop();
          rotaryDisc.userData.tweenStop.start();
        }


      }
    }

    else if (firstHit.name === '45rpmButton') {
      const fourtyFiveRpmButton = firstHit;
      fourtyFiveRpmButton.userData.tweenPush.stop(); // interrupt first
      fourtyFiveRpmButton.userData.tweenPush.start();
      fourtyFiveRpmButton.parent.playbackRpm = 45;
    }

    else if (firstHit.name === '33rpmButton') {
      const thirtyThreeRpmButton = firstHit;
      thirtyThreeRpmButton.userData.tweenPush.stop(); // interrupt first
      thirtyThreeRpmButton.userData.tweenPush.start();
      thirtyThreeRpmButton.parent.playbackRpm = 33;
    }

    else if (firstHit.name === 'needleLightOnButton') {
      const needleLightOnButton = firstHit;
      const turntable = needleLightOnButton.parent.parent;
      const needleLightOffButton = turntable.getObjectByName('needleLightOffButton');
      if (!turntable.needleLightIsOn) {
        turntable.needleLightIsOn = true;
        needleLightOffButton.userData.tweenDown.stop();
        needleLightOnButton.userData.tweenUp.stop();
        needleLightOffButton.userData.tweenUp.start();
        needleLightOnButton.userData.tweenDown.start();
      }
    }

    else if (firstHit.name === 'needleLightOffButton') {
      const needleLightOffButton = firstHit;
      const turntable = needleLightOffButton.parent.parent;
      const needleLightOnButton = turntable.getObjectByName('needleLightOnButton');
      if (turntable.needleLightIsOn) {
        turntable.needleLightIsOn = false;
        needleLightOffButton.userData.tweenUp.stop();
        needleLightOnButton.userData.tweenDown.stop();
        needleLightOffButton.userData.tweenDown.start();
        needleLightOnButton.userData.tweenUp.start();
      }
    }

    else if (firstHit.name === 'speedSlider') {
      const speedSlider = firstHit;
      //firstHit.position
    }

    else if (firstHit.parent.name === 'needleHead' || firstHit.parent.name === 'arm') {
      const arm = window.scene.getObjectByName('arm');
      const horizontalJoint = window.scene.getObjectByName('horizontalJointWithCylinder');
      const turntable = arm.parent;
      if (!(arm.userData.tweenFromRecordSide.isPlaying() ||
          arm.userData.tweenToRecordSide.isPlaying() ||
          arm.userData.tweenFromRecordUp.isPlaying() ||
          arm.userData.tweenToRecordDown.isPlaying() ||
          arm.userData.tweenRollingSide.isPlaying())){

        if (!turntable.armIsOnRecord) {
          arm.userData.tweenFromRecordSide.stop();
          horizontalJoint.userData.tweenMoveArmPlasticSide2.stop();
          arm.userData.tweenToRecordSide.start();
          horizontalJoint.userData.tweenMoveArmPlasticSide1.start();
        } else {
          arm.userData.tweenToRecordSide.stop();
          horizontalJoint.userData.tweenMoveArmPlasticSide1.stop();
          arm.userData.tweenFromRecordUp.start();
          horizontalJoint.userData.tweenMoveArmPlasticSide2.start();
        }
        setTimeout(() => {
          turntable.armIsOnRecord = !turntable.armIsOnRecord;
        }, 2500);
      }

    }

  }
}