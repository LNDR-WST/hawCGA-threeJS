import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';


window.raycaster = new THREE.Raycaster();

export function executeRaycast() {

  window.raycaster.setFromCamera(window.mousePosition, window.camera);
  let intersects = window.raycaster.intersectObject(window.scene, true);


  if (intersects.length > 0) {
    let firstHit = intersects[0].object;

    // -----------------------------------------------------------------------------
    // TURNTABLE
    // -----------------------------------------------------------------------------

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
        powerSwitch.userData.tweenOn.start();
      } else {
        powerSwitch.userData.tweenOn.stop();
        powerSwitch.userData.tweenOff.start();

        // Turn off rotation, when power is off.
        if (turntable.isRotating){
          turntable.getObjectByName('rotaryDiscWithRecord').userData.tweenStart.stop();
          turntable.getObjectByName('rotaryDiscWithRecord').userData.tweenRotate.stop();
          turntable.getObjectByName('rotaryDiscWithRecord').userData.tweenStop.start();
          turntable.isRotating = false;
        }
      }
    }

    else if (firstHit.name === 'startStopButton') {
      const startStopButton = firstHit;
      const turntable = startStopButton.parent;
      const rotaryDisc = turntable.getObjectByName('rotaryDiscWithRecord');
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
      if (!turntable.needleLightIsOn) {
        turntable.needleLightIsOn = true;
        needleLightOnButton.userData.tweenUp.stop();
        needleLightOnButton.userData.tweenDown.start();
      }
    }

    else if (firstHit.name === 'needleLightOffButton') {
      const needleLightOffButton = firstHit;
      const turntable = needleLightOffButton.parent.parent;
      if (turntable.needleLightIsOn) {
        turntable.needleLightIsOn = false;
        needleLightOffButton.userData.tweenUp.stop();
        needleLightOffButton.userData.tweenDown.start();
      }
    }

    else if (firstHit.name === 'speedSlider') {
      const speedSlider = firstHit;
      // window.onmousedown = () => {
      //
      //   window.orbitControls.enabled = false;
      // };
    }

    else if (firstHit.parent.name === 'needleHead' || firstHit.parent.name === 'arm') {
      const arm = window.scene.getObjectByName('arm');
      const horizontalJoint = window.scene.getObjectByName('horizontalJointWithCylinder');
      const turntable = arm.parent;
      if (!(arm.userData.tweenFromRecordSide.isPlaying() ||
          arm.userData.tweenToRecordSide.isPlaying() ||
          arm.userData.tweenFromRecordUpStart.isPlaying() ||
          arm.userData.tweenFromRecordUpEnd.isPlaying() ||
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
          if (turntable.armIsOnEnd) {
            arm.userData.tweenFromRecordUpEnd.start();
          } else {
            arm.userData.tweenFromRecordUpStart.start();
          }
          horizontalJoint.userData.tweenMoveArmPlasticSide2.start();
        }
      }

    }

    // -----------------------------------------------------------------------------
    // TURNTABLE FROM FILE
    // -----------------------------------------------------------------------------

    if (firstHit.name === 'powerSwitch_gltf') {
      const powerSwitch = firstHit.userData;
      const emission = firstHit.parent.children[0];
      const rotaryDisc = firstHit.parent.parent.parent.parent.getObjectByName('rotaryDisc__gltf');
      const record = firstHit.parent.parent.parent.getObjectByName('vinyl_gltf');

      powerSwitch.isPoweredOn = !powerSwitch.isPoweredOn;

      if (powerSwitch.isPoweredOn) {
        powerSwitch.animations.get('powerSwitchOff').stop();
        powerSwitch.animations.get('powerSwitchOn').play();
        emission.userData.emissionOff.stop();
        emission.userData.emissionOn.start();
      } else {
        powerSwitch.animations.get('powerSwitchOn').stop();
        powerSwitch.animations.get('powerSwitchOff').play();
        emission.userData.emissionOn.stop();
        emission.userData.emissionOff.start();


        if (powerSwitch.isRotating){
          rotaryDisc.animations.startRotation.stop();
          rotaryDisc.animations.rotate.stop();
          rotaryDisc.animations.endRotation.start();
          record.userData.startRotation.stop();
          record.userData.rotate.stop();
          record.userData.endRotation.start();
          powerSwitch.isRotating = false;
        }
      }
    }
    else if (firstHit.name === 'startStop_gltf') {
      const startStopButton = firstHit.userData;
      const rotaryDisc = firstHit.parent.parent.parent.parent.getObjectByName('rotaryDisc__gltf');
      const record = firstHit.parent.parent.parent.getObjectByName('vinyl_gltf');
      const arm = window.scene.getObjectByName('arm_group_gltf');

      startStopButton.animations.get('pushStartStop').stop(); // interrupt first
      startStopButton.animations.get('pushStartStop').play();

      if (startStopButton.isPoweredOn) {
        startStopButton.isRotating = !startStopButton.isRotating;

        if (startStopButton.isRotating) {
          rotaryDisc.animations.rotate.stop();
          rotaryDisc.animations.endRotation.stop();
          rotaryDisc.animations.startRotation.start();
          record.userData.rotate.stop();
          record.userData.endRotation.stop();
          record.userData.startRotation.start();

          if (record.userData.armIsOnRecord && !arm.userData.tweenToRecordSide.isPlaying()) {
            arm.userData.tweenRollingSide.start();
          }
        } else {
          rotaryDisc.animations.startRotation.stop();
          rotaryDisc.animations.rotate.stop();
          rotaryDisc.animations.endRotation.start();
          record.userData.startRotation.stop();
          record.userData.rotate.stop();
          record.userData.endRotation.start();

          if (record.userData.armIsOnRecord && arm.userData.tweenToRecordSide.isPlaying()) {
            arm.userData.tweenRollingSide.stop();
          }


        }
      }
    }

    else if (firstHit.name === '45rpm_gltf') {
      firstHit.userData.animations.get('push45rpm').stop(); // interrupt first
      firstHit.userData.animations.get('push45rpm').play();
      window.scene.getObjectByName('turntableFromFile').speakerL.soundTFF.setPlaybackRate(1.36);
      window.scene.getObjectByName('turntableFromFile').speakerR.soundTFF.setPlaybackRate(1.36);

    }

    else if (firstHit.name === '33rpm_gltf') {
      firstHit.userData.animations.get('push33rpm').stop(); // interrupt first
      firstHit.userData.animations.get('push33rpm').play();
      window.scene.getObjectByName('turntableFromFile').speakerL.soundTFF.setPlaybackRate(1);
      window.scene.getObjectByName('turntableFromFile').speakerR.soundTFF.setPlaybackRate(1);
    }

    else if (firstHit.name === 'needleLightOnButton_gltf') {
      const needleLightOnButton = firstHit.userData;
      if (!needleLightOnButton.needleLightIsOn) {
        needleLightOnButton.needleLightIsOn = true;
        needleLightOnButton.animations.get('buttonUp').stop();
        needleLightOnButton.animations.get('buttonDown').play();
        needleLightOnButton.animations.get('lightDown').stop();
        needleLightOnButton.animations.get('lightUp').play();
      }
    }

    else if (firstHit.name === 'needleLightOffButton_gltf') {
      const needleLightOffButton = firstHit.userData;
      if (needleLightOffButton.needleLightIsOn) {
        needleLightOffButton.needleLightIsOn = false;
        needleLightOffButton.animations.get('buttonDown').stop();
        needleLightOffButton.animations.get('buttonUp').play();
        needleLightOffButton.animations.get('lightUp').stop();
        needleLightOffButton.animations.get('lightDown').play();
      }
    }

    else if (firstHit.name === 'needle_msh_metal_mat1_0' ||
        firstHit.name === 'needle_system_msh_needle_mat_0' ||
        firstHit.name === 'armMetal_gltf' ||
        firstHit.name === 'armWeightPlastic_gltf') {

      const arm = window.scene.getObjectByName('arm_group_gltf');
      const horizontalJoint = window.scene.getObjectByName('armHorizontalJoint_gltf');

      if (!(arm.userData.tweenFromRecordSide.isPlaying() ||
          arm.userData.tweenToRecordSide.isPlaying() ||
          arm.userData.tweenFromRecordUpStart.isPlaying() ||
          arm.userData.tweenFromRecordUpEnd.isPlaying() ||
          arm.userData.tweenToRecordDown.isPlaying() ||
          arm.userData.tweenRollingSide.isPlaying())){

        if (!arm.userData.armIsOnRecord) {
          arm.userData.tweenFromRecordSide.stop();
          horizontalJoint.userData.tweenMoveArmPlasticSide2.stop();
          arm.userData.tweenToRecordSide.start();
          horizontalJoint.userData.tweenMoveArmPlasticSide1.start();
        } else {
          arm.userData.tweenToRecordSide.stop();
          horizontalJoint.userData.tweenMoveArmPlasticSide1.stop();
          if (arm.userData.armIsOnEnd) {
            arm.userData.tweenFromRecordUpEnd.start();
          } else {
            arm.userData.tweenFromRecordUpStart.start();
          }
          horizontalJoint.userData.tweenMoveArmPlasticSide2.start();
        }
      }

    }

  }
}