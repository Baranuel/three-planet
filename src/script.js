import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { AdditiveBlending, Sphere, TetrahedronGeometry } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//loader
const textureLoader = new THREE.TextureLoader()
//textures
const planetTexture = textureLoader.load('textures/2k_venus_surface.jpg')
const rockTexture = textureLoader.load('/textures/rock.jpg')
const earthMap = textureLoader.load('/textures/earthmap1k.jpg')
const earthbump = textureLoader.load('/textures/earthbump1k.jpg')
const earthspec = textureLoader.load('/textures/earthspec1k.jpg')
//Lights
const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)

/**
 * 
 */
const parameters = {
    partCount: 150000,
    backgroundCount:8000,
    size:0.05,
    innerColor:"#ff6030",
    outerColor:"#ff4355"
}
gui.add(parameters,"partCount",1000,10000000,100)

let geometry = null
let material = null
let particleGeometry = null
let particleMaterial = null
let points = null


    // Destroy old galaxy
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    
    //Planet Geometry
    geometry = new THREE.SphereBufferGeometry(4,64,64)
    material = new THREE.PointsMaterial({
        color:"#ff6030",
        size:.025,
        depthWrite: false,
        sizeAttenuation:true,
    })

    const colorMix = {
        color1:"#ff3700",
        color2:"#fc4f05",
    }
    const SpherePositions = []
    const newPositions = new Float32Array(SpherePositions * 3)
    const colorArr = new Float32Array(SpherePositions * 3)
    
    for(let i = 0; i<geometry.attributes.position.array.length;i++){


        SpherePositions.push(i)
    }
    console.log(colorArr)
    const newGeometry  = new THREE.BufferGeometry()
    newGeometry.setAttribute('position',new THREE.BufferAttribute(newPositions,3))
    newGeometry.setAttribute('color',new THREE.BufferAttribute(newPositions,3))
    newGeometry.setAttribute('uv',new THREE.BufferAttribute(newPositions,3))
    const sphereCount = 50000
    const spherePos = new Float32Array(sphereCount * 3)
    
    // geometry.setAttribute('position', new THREE.BufferAttribute(spherePos,3))

    // for(let i = 0; i<sphereCount;i++){
    //     let i3 = i*3
    //     const angle = Math.random() * Math.PI*2
    //     const radius = (Math.random() -.5)*4
    //     const randomness = .5

    //     const randomX = Math.pow(Math.random(), randomness) * (Math.random() < 0.5 ? 1 : - 1) * randomness * radius
    //     const randomY = Math.pow(Math.random(), randomness) * (Math.random() < 0.5 ? 1 :  -1) * randomness * radius
    //     const randomZ = Math.pow(Math.random(), randomness) * (Math.random() < 0.5 ? 1 : - 1) * randomness * radius
        
    //     spherePos[i3] = Math.cos(angle) * radius +randomX
    //     spherePos[i3 + 1] =  (Math.random()-.5) *angle+ randomY 
    //     spherePos[i3 + 2] = Math.sin(angle) * radius  + randomZ

    // }
    
    console.log(geometry)
    const planetSystem = new THREE.Group()
    const planet = new THREE.Points(geometry,material)
    planetSystem.add(planet)



// Particles 

     particleGeometry = new THREE.BufferGeometry()
     particleMaterial = new THREE.PointsMaterial({
         map:rockTexture,
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors:true
    })   

    const positions = new Float32Array(parameters.partCount *3)
    const colors = new Float32Array(parameters.partCount *3)

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    console.log(particleGeometry.attributes)

    for( let i = 0; i< parameters.partCount;i++){
        
    }

  
    
    for(let i = 0; i< parameters.partCount;i++){
        const i3 = i *3
        const ringWidth = (Math.random()) * Math.PI * 2
        const ringRadius = Math.random() * 9 + 7  

        const randomX = (Math.random() - .5) * 3
        const randomY =  (Math.random() - .5) * .4
        const randomZ = (Math.random() - .5) * 5
      
        positions[i3] = Math.cos(ringWidth) * ringRadius + randomX
        positions[i3 + 1] = Math.sin(randomY )  
        positions[i3 + 2 ] = Math.sin( ringWidth) * ringRadius + randomZ

        const innerColor = new THREE.Color(colorMix.color1)
        const outerColor = new THREE.Color(colorMix.color2)
    
        const mixedColor = innerColor.clone()
        mixedColor.lerp(outerColor, ringRadius /7)
      
        colors[i3 ] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }
 
    
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    planetSystem.add(particles)

    const backgroundParticlesPos = new Float32Array(parameters.partCount * 3)
    const backgroundParticlesGeometry = new THREE.BufferGeometry()
    const backgroundParticlesMaterial = new THREE.PointsMaterial({
        color:"white",
        size:.1,
        sizeAttenuation:true,
        blending:AdditiveBlending,
        depthWrite:false
    })
    for(let i = 0 ; i < parameters.backgroundCount;i++){
        let i3 = i*3
        const area = Math.random() * Math.PI*2
        const radius = Math.random()*100 + 20
        backgroundParticlesPos[i3] = Math.sin(area) * radius 
        backgroundParticlesPos[i3 +1] = (Math.random() -.5) * 100 
        backgroundParticlesPos[i3 +2 ] = Math.cos(area) * radius 
    }
    backgroundParticlesGeometry.setAttribute("position", new THREE.BufferAttribute(backgroundParticlesPos,3))
    console.log(backgroundParticlesPos)
    const backgroundParticles = new THREE.Points(backgroundParticlesGeometry,backgroundParticlesMaterial)
    console.log(backgroundParticlesGeometry)
    planetSystem.add(backgroundParticles)




    scene.add(planetSystem)
    const dotsCount = 10
    const dots = new Float32Array(dotsCount * 3)

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(dots,3))
    for(let i = 0; i<dotsCount;i++){

        let i3 = i*3
        const ringWidth = (Math.random()) * Math.PI * 2
        const ringRadius = Math.random() * 9 + 7  
        
    }
    const line = new THREE.Line( lineGeo, material );
    scene.add( line );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const mouse = new THREE.Vector2()
window.addEventListener("mousemove", (e)=>{
    mouse.x = e.clientX / window.innerWidth * 2 - 1
    mouse.y =  -e.clientY / window.innerWidth * 2 + 1
})

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
camera.position.x = 3
camera.position.y = 10
camera.position.z = 10
scene.add(camera)

const rayCaster = new THREE.Raycaster()

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.autoClearColor = true;
console.log(particles)
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    //move starts up


    console.log(backgroundParticles.position.y)
    //rotate particles
    planet.rotation.y = elapsedTime *.4
    particles.rotation.y = elapsedTime * .4
    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()