import * as THREE from '../../../../lib/three.js-r134/build/three.module.js';

export default class Floor extends THREE.Group {

    constructor() {
        super();
        const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
        const floorMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa, roughness: 0.7});
        floorMaterial.color.setHex(0xffffff).convertSRGBToLinear();

        // Texture
        // ---

        const floorTexture = new THREE.TextureLoader().load('src/images/wood_base.jpg');
        floorTexture.encoding = THREE.sRGBEncoding;
        floorTexture.repeat.set(4, 4);
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorMaterial.map = floorTexture;

        const floorNormal = new THREE.TextureLoader().load('src/images/wood_normal.jpg');
        floorNormal.encoding = THREE.sRGBEncoding;
        floorNormal.repeat.set(4, 4);
        floorNormal.wrapS = THREE.RepeatWrapping;
        floorNormal.wrapT = THREE.RepeatWrapping;
        floorMaterial.normalMap = floorNormal;

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
        floor.receiveShadow = true;

        this.add(floor);
    }

}