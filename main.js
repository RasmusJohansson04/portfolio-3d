//https://codesandbox.io/p/sandbox/basic-threejs-example-with-re-use-dsrvn?file=%2Fsrc%2Findex.js%3A120%2C20-120%2C27

import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

class Interactible extends THREE.Mesh {
	constructor() {
		super()
		this.geometry = new THREE.BoxGeometry()
		this.material = new THREE.MeshStandardMaterial({ color: new THREE.Color('orange').convertSRGBToLinear() })
		this.interactibleSize = 0
		this.interactibleActive = false
		this.rotationDirection = .01
	}

	render() {
		this.rotation.x = this.rotation.y += this.rotationDirection
	}

	onResize(width, height, aspect) {
		this.interactibleSize = width / 5
	}

	onPointerOver(e) {
		this.material.color.set('hotpink')
		this.material.color.convertSRGBToLinear()
	}

	onPointerOut(e) {
		this.material.color.set('orange')
		this.material.color.convertSRGBToLinear()
	}

	onClick(e) {
		this.interactibleActive = !this.interactibleActive
	}
}

let width = 0
let height = 0
let intersects = []
let hovered = {}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000)
camera.position.z = 5
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(Math.max(1, window.devicePixelRatio), 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputEncoding = THREE.sRGBEncoding
document.getElementById('root').appendChild(renderer.domElement)
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const obj1 = new Interactible()
obj1.position.set(-1.5, 0, 0)
obj1.scale.set(.75, .75, .75)
obj1.rotationDirection = -.1
const obj2 = new Interactible()
obj2.position.set(1.5, 0, 0)
scene.add(obj1)
scene.add(obj2)

const ambientLight = new THREE.AmbientLight()
const pointLight = new THREE.PointLight()
pointLight.position.set(10, 10, 10)
scene.add(ambientLight)
scene.add(pointLight)

function resize() {
	width = window.innerWidth
	height = window.innerHeight
	camera.aspect = width / height
	const target = new THREE.Vector3(0, 0, 0)
	const distance = camera.position.distanceTo(target)
	const fov = (camera.fov * Math.PI) / 180
	const viewportHeight = 2 * Math.tan(fov / 2) * distance
	const viewportWidth = viewportHeight * (width / height)
	camera.updateProjectionMatrix()
	renderer.setSize(width, height)
	scene.traverse((obj) => {
		if (obj.onResize) obj.onResize(viewportWidth, viewportHeight, camera.aspect)
	})
}

window.addEventListener('resize', resize)
resize()

window.addEventListener('pointermove', (e) => {
	mouse.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1)
	raycaster.setFromCamera(mouse, camera)
	intersects = raycaster.intersectObjects(scene.children, true)
	Object.keys(hovered).forEach((key) => {
		const hit = intersects.find((hit) => hit.object.uuid === key)
		if (hit === undefined) {
			const hoveredItem = hovered[key]
			if (hoveredItem.object.onPointerOver) hoveredItem.object.onPointerOut(hoveredItem)
			delete hovered[key]
		}
	})

	intersects.forEach((hit) => {
		if (!hovered[hit.object.uuid]) {
			hovered[hit.object.uuid] = hit
			if (hit.object.onPointerOver) hit.object.onPointerOver(hit)
		}
		if (hit.object.onPointerMove) hit.object.onPointerMove(hit)
	})
})

window.addEventListener('click', (e) => {
	intersects.forEach((hit) => {
		if (hit.object.onClick) hit.object.onClick(hit)
	})
})

function animate(t) {
	requestAnimationFrame(animate)
	scene.traverse((obj) => {
		if (obj.render) obj.render(t)
	})
	renderer.render(scene, camera)
}

animate()

// import * as THREE from 'three'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import TWEEN from '@tweenjs/tween.js'

// let fov = 75
// let scene = new THREE.Scene()

// const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 10000)
// const loader = new GLTFLoader()
// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
// renderer.setSize(window.innerWidth, window.innerHeight)

// camera.position.z = 10

// const raycaster = new THREE.Raycaster()
// let mousePointer = new THREE.Vector2()
// let activeObject = null

// const light = new THREE.AmbientLight(0x404040, 50)
// scene.add(light)

// const modelLoader = (url) => {
//   return new Promise((resolve, reject) => {
//     loader.load(url, data => resolve(data), null, reject)
//   })
// }

// const spin = (obj) => {
//   obj.animationID = requestAnimationFrame(function () {
//     spin(obj)
//   })
//   obj.rotation.y += .005
//   renderer.render(scene, camera)
// }

// const cassette_import = await modelLoader('cassette.gltf')
// const cassette = cassette_import.scene
// cassette.scale.set(5, 5, 5)

// scene.add(cassette)
// renderer.render(scene, camera)

// const onMouseMove = (event) => {
//   mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1

//   raycaster.setFromCamera(mousePointer, camera)
//   const intersections = raycaster.intersectObjects(scene.children, true)

//   if (intersections[0]) {
//     const object = intersections[0].object
//     activeObject = object
//     document.body.style.cursor = 'pointer'
//     if (!object.animationID) {
//       spin(object)
//     }
//   }
//   else {
//     document.body.style.cursor = 'default'
//     if (activeObject) {
//       cancelAnimationFrame(activeObject.animationID)
//       activeObject.animationID = null
//       activeObject = null
//     }
//   }
// }

// window.addEventListener('click', (event) => {
//   if (activeObject) {
//     document.getElementById('test').textContent = 'PROJECTS'
//   }
// })

// document.body.appendChild(renderer.domElement)

// document.addEventListener('mousemove', onMouseMove, false)