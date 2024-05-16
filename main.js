//https://codesandbox.io/p/sandbox/basic-threejs-example-with-re-use-dsrvn?file=%2Fsrc%2Findex.js%3A120%2C20-120%2C27

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let fov = 75
let scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 1, 10000)
const loader = new GLTFLoader()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.z = 10

const raycaster = new THREE.Raycaster()
let mousePointer = new THREE.Vector2()
let activeObject = null

const light = new THREE.AmbientLight(0x404040, 50)
scene.add( light )

const modelLoader = (url) => {
  return new Promise((resolve, reject) => {
    loader.load(url, data => resolve(data), null, reject)
  })
}

const spin = (obj) => {
  obj.animationID = requestAnimationFrame(function() {
    spin(obj)
  })
  obj.rotation.y += .005
  renderer.render(scene, camera)
}

const cassette_import = await modelLoader('cassette.gltf')
const cassette = cassette_import.scene
cassette.scale.set(5, 5, 5)

scene.add(cassette)
renderer.render(scene, camera)

const onMouseMove = (event) => {
  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePointer, camera)
  const intersections = raycaster.intersectObjects(scene.children, true)

  if(intersections[0]) {
    const object = intersections[0].object
    activeObject = object
    document.body.style.cursor = 'pointer'
    if(!object.animationID) {
      spin(object)
    }
  }
  else {
    document.body.style.cursor = 'default'
    if(activeObject) {
      cancelAnimationFrame(activeObject.animationID)
      activeObject.animationID = null
      activeObject = null
    }
  }
}

window.addEventListener('click', (event) => {
  intersections.forEach((hit) => {
    if(hit.object.onClick) {
      alert('HIT')
    }
  })
})

document.body.appendChild(renderer.domElement)

document.addEventListener('mousemove', onMouseMove, false)