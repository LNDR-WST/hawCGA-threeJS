import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';

window.spaceDown = false;

const textureColor = new THREE.TextureLoader().load('src/images/TennisBallColorMap.jpg');
textureColor.encoding = THREE.sRGBEncoding;
const textureBump = new THREE.TextureLoader().load('src/images/TennisBallBump.jpg');
const geometry = new THREE.SphereGeometry(4, 16, 16);
const material = new THREE.MeshStandardMaterial({
    map	: textureColor,
    bumpMap	: textureBump,
    bumpScale: 0.1,
    roughness: 0.7
});

export function keyDownAction(event) {

    switch (event.keyCode) {
        case 49: // Digit1
            window.camera.tween1.start();
            break;
        case 50: // Digit2
            window.camera.tween2.start();
            break;

        case 32:
            if (!window.spaceDown) {
                window.spaceDown = true;

                const ballRadius = 4;
                const ball = new THREE.Mesh( geometry, material );

                ball.position.set(window.camera.position.x, window.camera.position.y, window.camera.position.z);
                ball.castShadow = true;
                window.scene.add(ball);

                const directionalVectorDC = new THREE.Vector3(window.mousePosition.x, window.mousePosition.y, 1);
                const velocityVectorWC = directionalVectorDC.unproject(window.camera);
                velocityVectorWC.normalize();
                velocityVectorWC.multiplyScalar(1200);
                window.physics.addSphereWithVelocity(ball, 4, ballRadius, velocityVectorWC);
            }
            break;
    }
}

export function keyUpAction(event) {
    switch (event.keyCode) {
        case 32:
            window.spaceDown = false;
            break;
    }
}