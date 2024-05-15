import * as THREE from 'three'

let fov = 75
let scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth/window.innerHeight, 1, 10000)

camera.position.z = 15

const raycaster = new THREE.Raycaster()
let mousePointer = new THREE.Vector2()
let activeObject = null

const geometry = new THREE.BoxGeometry(6, 3, .6)
let material = new THREE.MeshBasicMaterial({ color: 0xfffff, wireframe: false })
let tape = new THREE.Mesh(geometry, material)

scene.add(tape)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

const spin = () => {
  requestAnimationFrame(spin)
  tape.rotation.y += .003
  renderer.render(scene, camera)
}

spin()

const onMouseMove = (event) => {
  mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mousePointer, camera)
  const intersections = raycaster.intersectObjects(scene.children, true)
  if(intersections[0]) {
    const object = intersections[0].object
    object.material.color.set(0xffffff)
    activeObject = object
  }
  else if(activeObject) {
    activeObject.material.color.set(0xfffff)
    activeObject = null
  }
}

document.body.appendChild(renderer.domElement)

document.addEventListener('mousemove', onMouseMove, false)