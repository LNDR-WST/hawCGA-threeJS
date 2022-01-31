import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';
import {GLTFLoader} from '../../../../lib/three.js-r134/examples/jsm/loaders/GLTFLoader.js';
import * as TWEEN from '../../../../lib/tween.js-18.6.4/dist/tween.esm.js';

export default class TurntableFromFile extends THREE.Group {

    constructor(speakerL, speakerR) {
        super();
        this.gltfLoader = new GLTFLoader();
        this.animationMixer = null;
        this.animations = new Map();

        this.isPoweredOn = false;
        this.isRotating = false;
        this.armIsOnRecord = false;
        this.armIsOnEnd = false;
        this.needleLightIsOn = false;
        this.playbackRpm = 33;

        this.speakerL = speakerL;
        this.speakerR = speakerR;

        this.loadingDone = false;

        this.load(this);
    }


    load(thisTurntable) {

        this.gltfLoader.load('src/models/turntable.gltf', function (gltf) {

            const envMap = new THREE.TextureLoader().load('../../lib/three.js-r134/examples/textures/2294472375_24a3b8ef46_o.jpg');
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            envMap.encoding = THREE.sRGBEncoding;

            gltf.scene.traverse(function(child) {

                //console.log("Name: " + child.name);


                if (child.isMesh) {
                    child.userData = thisTurntable;

                    if (child.name === "armMetal_gltf" ||
                        child.name === "armVertJoint_gltf" ||
                        child.name === "tabletop_gltf" ||
                        child.name === "singlePuk_gltf" ||
                        child.name === "center_gltf" ||
                        child.name === "powerKnob__gltf" ||
                        child.name === "powerSwitch_gltf" ||
                        child.name === "45rpm_gltf" ||
                        child.name === "33rpm_gltf" ||
                        child.name === "polySurface11_metal_mat_0_light" ||
                        child.name === "needleLightOnButton_gltf" ||
                        child.name === "needleLightOffButton_gltf" ||
                        child.name === "speedSlider_gltf" ||
                        child.name === "weightAdjustment_gltf" ||
                        child.name === "rotaryDisc__gltf") {

                        child.material.envMap = envMap;
                        child.material.envMapIntensity = 10.0;
                    }


                    // manually implemented animations
                    if (child.name === 'powerEmission_gltf') {
                        child.userData.emissionOn = new TWEEN.Tween(child.material.emissive).to(new THREE.Color(0xff0000), 125);
                        child.userData.emissionOff = new TWEEN.Tween(child.material.emissive).to(new THREE.Color(0x000000), 125);
                    }
                    if (child.name === 'rotaryDisc__gltf') {
                        const tweenRotate = new TWEEN.Tween(child.rotation)
                            .to({x: '+0',
                                y: '+0',
                                z: `${-2*Math.PI}`}, 1/thisTurntable.playbackRpm * 60 * 1000)
                            .easing(TWEEN.Easing.Linear.None)
                            .repeat(Infinity);

                        const tweenStartRotation = new TWEEN.Tween(child.rotation)
                            .to({x: '+0',
                                y: '+0',
                                z: `${-Math.PI}`}, 1/thisTurntable.playbackRpm * 60 * 1000)
                            .easing(TWEEN.Easing.Quadratic.In)
                            .chain(tweenRotate)
                            .onStart(() => {
                                if (thisTurntable.armIsOnRecord) {
                                    window.scene.getObjectByName('arm_group_gltf').userData.tweenRollingSide.start();
                                }
                            });

                        const tweenEndRotation = new TWEEN.Tween(child.rotation)
                            .to({x: '+0',
                                y: '+0',
                                z: `${-1/8*Math.PI}`}, 1/thisTurntable.playbackRpm * 60 * 1000)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .onStart(() => {
                                thisTurntable.isRotating = false;
                                thisTurntable.speakerL.cracklingTFF.pause();
                                thisTurntable.speakerR.cracklingTFF.pause();
                            });

                        child.animations.rotate = tweenRotate;
                        child.animations.startRotation = tweenStartRotation;
                        child.animations.endRotation = tweenEndRotation;
                    }
                    if (child.name === 'vinyl_gltf') {
                        const tweenRotate = new TWEEN.Tween(child.rotation)
                            .to({x: '+0',
                                y: '+0',
                                z: `${-2*Math.PI}`}, 1/child.userData.playbackRpm * 60 * 1000)
                            .easing(TWEEN.Easing.Linear.None)
                            .repeat(Infinity);

                        const tweenStartRotation = new TWEEN.Tween(child.rotation)
                            .to({x: '+0',
                                y: '+0',
                                z: `${-Math.PI}`}, 1/child.userData.playbackRpm * 60 * 1000)
                            .easing(TWEEN.Easing.Quadratic.In)
                            .chain(tweenRotate);

                        const tweenEndRotation = new TWEEN.Tween(child.rotation)
                            .to({x: '+0',
                                y: '+0',
                                z: `${-1/8*Math.PI}`}, 1/child.userData.playbackRpm * 60 * 1000)
                            .easing(TWEEN.Easing.Quadratic.Out)
                            .onStart(() => {
                                thisTurntable.isRotating = false;
                                thisTurntable.speakerL.cracklingTFF.pause();
                                thisTurntable.speakerR.cracklingTFF.pause();
                            });

                        child.userData.rotate = tweenRotate;
                        child.userData.startRotation = tweenStartRotation;
                        child.userData.endRotation = tweenEndRotation;
                    }

                }

                if( child.name === 'corpus_gltf' || // Korpus oben
                    child.name === 'tabletop_gltf' ||     // Korpus mitte
                    child.name === 'arm_gltf' ||
                    child.name === 'leftBackFoot_gltf' ||     // Fuß
                    child.name === 'rightBackFoot_gltf' ||     // Fuß
                    child.name === 'leftFrontFoot_gltf' ||     // Fuß
                    child.name === 'rightFrontFoot_gltf') {     // Fuß
                    child.castShadow = true;
                }
                if (child.name === 'corpus_gltf') {     // Korpus mitte
                        child.receiveShadow = true;
                }

                if (child.name === 'arm_group_gltf') {
                     const tweenRollingSide = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x + THREE.MathUtils.degToRad(2.4), child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-38)
                        ), 35000)
                        .onStart(() => {
                            thisTurntable.speakerL.soundTFF.play();
                            thisTurntable.speakerR.soundTFF.play();
                            window.scene.getObjectByName('armHorizontalJoint_gltf').userData.tweenRollingArmPlastic.start();
                        })
                        .onStop(() => {
                            thisTurntable.speakerL.soundTFF.pause();
                            thisTurntable.speakerR.soundTFF.pause();
                            window.scene.getObjectByName('armHorizontalJoint_gltf').userData.tweenRollingArmPlastic.stop();
                        })
                        .onUpdate(() => {
                            if (!thisTurntable.isRotating) {
                                child.userData.tweenRollingSide.stop();
                                thisTurntable.speakerL.cracklingTFF.pause();
                                thisTurntable.speakerR.cracklingTFF.pause();
                            } else if (thisTurntable.isRotating && !thisTurntable.speakerL.soundTFF.isPlaying && !thisTurntable.speakerR.soundTFF.isPlaying) {
                                thisTurntable.speakerL.cracklingTFF.play();
                                thisTurntable.speakerR.cracklingTFF.play();
                                thisTurntable.speakerL.cracklingTFF.setLoop(true);
                                thisTurntable.speakerR.cracklingTFF.setLoop(true);
                            }
                        })
                        .onComplete(() => {
                            child.userData.armIsOnEnd = true;
                            if (thisTurntable.isRotating && !thisTurntable.speakerL.cracklingT.isPlaying && !thisTurntable.speakerR.cracklingT.isPlaying) {
                                thisTurntable.speakerL.cracklingTFF.currentTime = 0;
                                thisTurntable.speakerL.cracklingTFF.play();
                                thisTurntable.speakerL.cracklingTFF.setLoop(true);
                                thisTurntable.speakerR.cracklingTFF.currentTime = 0;
                                thisTurntable.speakerR.cracklingTFF.play();
                                thisTurntable.speakerR.cracklingTFF.setLoop(true);
                            }
                        });

                    const tweenToRecordDown = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x + THREE.MathUtils.degToRad(3.65), child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-15.2)
                        ), 1000)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onComplete(() => {
                            if (thisTurntable.isRotating){
                                tweenRollingSide.start();
                            }
                            child.userData.armIsOnRecord = true;
                            thisTurntable.armIsOnRecord = true;
                        });
                    const tweenToRecordSide = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x, child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-15.2)
                        ), 1500)
                        .chain(tweenToRecordDown)
                        .easing(TWEEN.Easing.Quadratic.InOut);

                    const tweenFromRecordSide = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x, child.rotation.y, child.rotation.z
                        ), 1500)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onComplete(() => {
                            child.rotation.set(0, 0, 0);
                            child.userData.armIsOnRecord = false;
                        });

                    const tweenFromRecordUpStart = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x, child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-15.2)
                        ), 1000)
                        .chain(tweenFromRecordSide)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onStart(() => {
                            child.userData.armIsOnEnd = false;
                            thisTurntable.armIsOnRecord = false;
                            child.userData.tweenRollingSide.stop();
                            thisTurntable.speakerL.soundTFF.currentTime = 0;
                            thisTurntable.speakerR.soundT.currentTime = 0;
                            thisTurntable.speakerL.cracklingTFF.pause();
                            thisTurntable.speakerL.cracklingTFF.currentTime = 0;
                            thisTurntable.speakerR.cracklingTFF.pause();
                            thisTurntable.speakerR.cracklingTFF.currentTime = 0;
                        });

                    const tweenFromRecordUpEnd = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x, child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-38)
                        ), 1000)
                        .chain(tweenFromRecordSide)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .onStart(() => {
                            child.userData.armIsOnEnd = false;
                            child.userData.tweenRollingSide.stop();
                            thisTurntable.armIsOnRecord = false;
                            thisTurntable.speakerL.soundTFF.currentTime = 0;
                            thisTurntable.speakerR.soundTFF.currentTime = 0;
                            thisTurntable.speakerL.cracklingTFF.pause();
                            thisTurntable.speakerL.cracklingTFF.currentTime = 0;
                            thisTurntable.speakerR.cracklingTFF.pause();
                            thisTurntable.speakerR.cracklingTFF.currentTime = 0;
                        });

                    child.userData = {
                        tweenToRecordSide: tweenToRecordSide,
                        tweenToRecordDown: tweenToRecordDown,
                        tweenFromRecordSide: tweenFromRecordSide,
                        tweenFromRecordUpStart: tweenFromRecordUpStart,
                        tweenFromRecordUpEnd: tweenFromRecordUpEnd,
                        tweenRollingSide: tweenRollingSide
                    };

                }

                if (child.name === 'armHorizontalJoint_gltf') {
                    const tweenMoveArmPlasticSide1 = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(child.rotation.x, child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-15.2)), 1500)
                        .easing(TWEEN.Easing.Quadratic.InOut);

                    const tweenMoveArmPlasticSide2 = new TWEEN.Tween(child.rotation)
                        .to({x: child.rotation.x, y: child.rotation.y, z: child.rotation.z}, 1500)
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .delay(1000);

                    const tweenRollingArmPlastic = new TWEEN.Tween(child.rotation)
                        .to(new THREE.Vector3(
                            child.rotation.x + THREE.MathUtils.degToRad(2.4), child.rotation.y, child.rotation.z + THREE.MathUtils.degToRad(-38)
                        ), 35000);

                    child.userData = {
                        tweenMoveArmPlasticSide1: tweenMoveArmPlasticSide1,
                        tweenMoveArmPlasticSide2: tweenMoveArmPlasticSide2,
                        tweenRollingArmPlastic: tweenRollingArmPlastic
                    };
                }


            });

            thisTurntable.animationMixer = new THREE.AnimationMixer(gltf.scene);

            for (let i = 0; i < gltf.animations.length; i++) {
                const action = thisTurntable.animationMixer.clipAction(gltf.animations[i]);
                action.clampWhenFinished = true;
                action.setLoop(THREE.LoopOnce);
                thisTurntable.animations.set(gltf.animations[i].name, action);
                //console.log("Animation: " + gltf.animations[i].name);
            }

            thisTurntable.add(gltf.scene);
            thisTurntable.loadingDone = true;
        });
    }

    addPhysics() {
        if(this.loadingDone === false) {
            window.setTimeout(this.addPhysics.bind(this), 100);
        } else {
            const boundingBox = new THREE.Box3().setFromObject(this);
            const boundingBoxSize = new THREE.Vector3();
            boundingBox.getSize(boundingBoxSize);
            window.physics.addBox(this, 10, boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z, 0, boundingBoxSize.y/2, 0, false);
        }
    }
}