import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
// const textureLoader = new THREE.TextureLoader()

// const waterColorTexture = textureLoader.load('./textures/water/color.jpg')
// const waterAlphaTexture = textureLoader.load('./textures/water/alpha.jpg')
// const waterNormalTexture = textureLoader.load('./textures/water/normal.jpg')
// const waterMetalnessTexture = textureLoader.load('./textures/water/metalness.jpg')
// const waterRoughnessTexture = textureLoader.load('./textures/water/roughness.jpg')
// waterColorTexture.repeat.set(0.6,0.6);

// waterColorTexture.colorSpace = THREE.SRGBColorSpace
// const material = new THREE.MeshBasicMaterial({ map: waterColorTexture })

// Fog
const fog = new THREE.Fog('#9DD8E2', 1, 30)
scene.fog = fog

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    '/models/torii-gate.glb',
    (gltf) => {
        const torii = gltf.scene.children[0];
        scene.add(torii)
        torii.scale.set(20, 20, 20)
        torii.position.y = 4
        torii.castShadow = true
    }
)
gltfLoader.load(
    '/models/lily-pad.glb',
    (gltf) => {
        const lilies = new THREE.Group();
        scene.add(lilies);
        
        for(let i = 0; i < 15; i++)
        {
            const angle = Math.random() * Math.PI * 2
            const radius = 5 + Math.random() * 15
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            const lily = gltf.scene.children[0].clone();
            
            lily.scale.set(0.1, 0.1, 0.1)
            lily.position.set(x, 0, z)

            lilies.add(lily);
            lily.castShadow = true;
        }
    }
)

gltfLoader.load(
    '/models/toro.glb',
    (gltf) => {
        const toros = new THREE.Group();
        scene.add(toros);
        
        for(let i = 0; i < 15; i++)
        {
            const angle = Math.random() * Math.PI * 2
            const radius = 9 + Math.random() * 15
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            const toro = gltf.scene.children[0].clone();
            
            toro.scale.set(0.2, 0.6, 0.2)
            toro.position.set(x, 1.5, z)    

            toros.add(toro);
            toro.castShadow = true;
        }
    }
)

// Water
const water = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    // material
    new THREE.MeshStandardMaterial({color: '#84BFFF'})
)
water.rotation.x = - Math.PI * 0.5,
water.position.y = 0
scene.add(water)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.9)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.26)
moonLight.position.set(4, 5, - 2)
scene.add(moonLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 10
camera.position.y = 10
camera.position.z = -10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#9DD8E2')

// SHADOWS

renderer.shadowMap.enabled = true // on active les ombres
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
water.receiveShadow = true

// OPTIMIZATION
moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()