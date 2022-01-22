import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';

window.spaceDown = false;

export function keyDownAction(event) {

    switch (event.keyCode) {
        case 49: // Digit1  TODO: Camera Tweening
            break;
        case 50: // Digit2
            break;
        case 51: // Digit3
            break;


        case 32:
            if (!window.spaceDown) {
                window.spaceDown = true;

                const ballRadius = 2;
                const ballGeometry = new THREE.SphereGeometry(ballRadius, 16, 16);
                const ball = new THREE.Mesh(ballGeometry, new THREE.MeshLambertMaterial({color: 0xff0000}));

                ball.position.set(window.camera.position.x, window.camera.position.y, window.camera.position.z);
                ball.castShadow = true;
                window.scene.add(ball);

                const directionalVectorDC = new THREE.Vector3(0, 0, 1);
                const velocityVectorWC = directionalVectorDC.unproject(window.camera);
                velocityVectorWC.normalize();
                velocityVectorWC.multiplyScalar(800);
                window.physics.addSphereWithVelocity(ball, 1, ballRadius, velocityVectorWC);
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