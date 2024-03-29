// import * as THREE from 'node_modules/three/build/three.module.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { TWEEN } from '../node_modules/three/examples/jsm/libs/tween.module.min.js'
// /**
//  * unreal bloom
//  */
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

//const Tween = new tween.TWEEN()

const progressBar = document.getElementById('progress-bar')

const loadingManager = new THREE.LoadingManager()

loadingManager.onProgress = function (url, loaded, total) {
	progressBar.value = (loaded / total) * 100
}
const progressBarContainer = document.querySelector('.progress-bar-container')
loadingManager.onLoad = function () {
	// progressBarContainer.style.display = ' none'
	setTimeout(() => {
		progressBarContainer.classList.add('vanish')
		progressBarContainer.style.pointerEvents = 'none'
	}, 2000)
}
// Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color(0x660a5a)
// Canvas
const canvas = document.querySelector('#can')
const settings = {
	x: 1,
	y: 1,
	z: 1,
}
/**
 * Galaxy
 */
var colors = {
	modelcolor: 0xff0000,
}
const bloom_parameters = {
	/*exposure:1, 
	bloomStrength: -1.96,
	bloomThreshold: 6.06,
	bloomRadius: 1.64 */
	exposure: 1,
	bloomStrength: 3,
	bloomThreshold: -2,
	bloomRadius: 0,
}
const parameters = {
	// count: 100000,
	// size: 0.01,
	// radius: 8,
	// branches: 5,
	// spin: 1.68,
	// randomness: 0.23,
	// randomnessPower: 3.58,
	// insideColor: '#07e5e9',
	// outsideColor: '#2f6cf9',

	count: 100000,
	size: 0.2,
	radius: 5,
	branches: 3,
	spin: 3.68,
	randomness: 0.3,
	randomnessPower: 2,
	insideColor: '#ff6030',
	outsideColor: '#1b3984',
}

const star_map = new THREE.TextureLoader(loadingManager).load(
	'./assets/texturas/white-star.png'
)
let geometry = null
let material = null
let points = null
let pointsBack = null
let ambient_light,
	directional_light,
	spot_lightmarsmercury,
	mercury,
	venus,
	mars,
	jupiter,
	neptune
let neptune_move, mars_move, jupiter_move, venus_move, mercury_move
/**bloom variables */
let composer, renderScene, bloomPass
//**button close */
let close = document.querySelectorAll('.close')
//**informations id */
var mars_info = document.getElementById('mars_info')
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

// FEEL INMERSIVE FUNCTION //
const svg = document.querySelector('svg')
const text = document.querySelector('#text')

const mask = document.querySelector('#mask')
const tapButton = document.querySelector('#tap')

const info = document.querySelectorAll('.info')
let initialize = false
function growTitle() {
	tapButton.style.filter = 'blur(4px)'
	tapButton.style.opacity = '0'
	tapButton.style.pointerEvents = 'none'
	const back = new Audio('./assets/sonidos/enter.mp3')
	back.volume = 0.5
	back.play()
	const background = new Audio('./assets/sonidos/background.mp3')
	background.volume = 0.5
	background.loop = true
	background.play()
	setTimeout(() => {
		back.pause()
	}, 3900)
	setTimeout(() => {
		svg.style.transform = 'scale(25)'
		svg.style.top = '70%'
		svg.style.opacity = '0'
		text.style.filter = 'blur(4px)'
		mask.style.filter = 'blur(4px)'
		initialize = true
		svg.style.pointerEvents = 'none'
		setTimeout(() => {
			svg.remove()
		}, 2000)
	}, 1000)
}

tap.addEventListener('click', growTitle)

const menu = document.querySelector('.menu')
const vr = document.querySelector('.vr')
const ar = document.querySelector('.ar')
const menuIcon = document.querySelector('.menuIcon')
const leftIcon = document.querySelector('.leftIcon')
let clicked = false
// menu.addEventListener('click', function () {
// 	if (!clicked) {
// 		setTimeout(() => {
// 			leftIcon.classList.toggle('clickedIcon')
// 		}, 500)
// 		menuIcon.classList.toggle('clickedIcon')

// 		vr.style.transform = 'translate3d(1rem,-11rem,0)'
// 		ar.style.transform = 'translate3d(11rem,-1rem,0)'
// 	} else {
// 		setTimeout(() => {
// 			menuIcon.classList.toggle('clickedIcon')
// 		}, 500)

// 		leftIcon.classList.toggle('clickedIcon')
// 		vr.style.transform = 'translate3d(0,0,0)'
// 		ar.style.transform = 'translate3d(0,0,0)'
// 	}
// 	clicked = !clicked
// })
// CLOSE BUTTON FUNCTION
close.forEach((e) => {
	e.addEventListener('click', closeInfo)
})

function closeInfo(info) {
	const back = new Audio('./assets/sonidos/backwardsclick.mp3')

	back.volume = 0.5
	back.play()
	info.target.parentElement.parentElement.style.transform =
		'translate3D(-150%,0,0)'
	info.target.parentElement.parentElement.style.opacity = '0'

	moveAndLookAt(
		camera,
		new THREE.Vector3(3, 3, 7),
		new THREE.Vector3(0, 0, 0),
		{ duration: 1000 }
	)
	var starGrow = new TWEEN.Tween(points.material)
		.to({ size: 0.2 }, 1000)
		.easing(TWEEN.Easing.Bounce.InOut)
		.start()
	var starGrow = new TWEEN.Tween(pointsBack.material)
		.to({ size: 0.15 }, 1000)
		.easing(TWEEN.Easing.Bounce.InOut)
		.start()
	controls.enabled = true
	controls.minDistance = 6
	controls.maxDistance = 10
	prevPlanet = ''

	clickedObj = null

	var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
	var universe_scale = new TWEEN.Tween(mars.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
	var universe_scale = new TWEEN.Tween(neptune.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
	var universe_scale = new TWEEN.Tween(venus.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
	var universe_scale = new TWEEN.Tween(jupiter.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
	var universe_scale = new TWEEN.Tween(mercury.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()

	var bloomfade = new TWEEN.Tween(marsbloom.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
	var bloomfade = new TWEEN.Tween(neptunebloom.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()

	var bloomfade = new TWEEN.Tween(venusbloom.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()

	var bloomfade = new TWEEN.Tween(jupiterbloom.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()

	var bloomfade = new TWEEN.Tween(mercurybloom.scale)
		.to({ x: 1, y: 1, z: 1 }, 1000)
		.easing(TWEEN.Easing.Circular.Out)
		.start()
}

//

function showInfo(evt) {
	info[evt].style.transform = 'translate3D(0,0,0)'
	info[evt].style.opacity = '1'
}
const mercury_map = new THREE.TextureLoader(loadingManager).load(
	'./assets/texturas/2k_mercury.jpg'
)
const venus_map = new THREE.TextureLoader(loadingManager).load(
	'./assets/texturas/2k_venus_atmosphere.jpg'
)
const mars_map = new THREE.TextureLoader(loadingManager).load(
	'./assets/texturas/2k_mars.jpg'
)
const jupiter_map = new THREE.TextureLoader(loadingManager).load(
	'./assets/texturas/2k_jupiter.jpg'
)
const neptune_map = new THREE.TextureLoader(loadingManager).load(
	'./assets/texturas/2k_neptune.jpg'
)

const geometry_1 = new THREE.SphereGeometry(0.2, 64, 32)
const material_1 = new THREE.MeshPhongMaterial({
	map: mercury_map,
	// color: 0xb8babb,
})
mercury = new THREE.Mesh(geometry_1, material_1)
//mercury.layers.enable(1)
mercury.castShadow = true

const geometry_bloommercury = new THREE.SphereGeometry(0.18, 64, 32)
const material_bloommercury = new THREE.MeshBasicMaterial({
	color: 0xb8babb,
})
var mercurybloom = new THREE.Mesh(geometry_bloommercury, material_bloommercury)
mercurybloom.layers.enable(1)

const geometry_2 = new THREE.SphereGeometry(0.2, 64, 32)
const material_2 = new THREE.MeshPhongMaterial({
	map: venus_map,
	// color: 0xddc9b7,
})
venus = new THREE.Mesh(geometry_2, material_2)
venus.castShadow = true
//venus.layers.enable(1)

const geometry_bloomvenus = new THREE.SphereGeometry(0.18, 64, 32)
const material_bloomvenus = new THREE.MeshBasicMaterial({
	color: 0xddc9b7,
})
var venusbloom = new THREE.Mesh(geometry_bloomvenus, material_bloomvenus)
venusbloom.layers.enable(1)

const geometry_3 = new THREE.SphereGeometry(0.2, 64, 32)
const material_3 = new THREE.MeshPhongMaterial({
	map: mars_map,
	// color: 0xde7f56,
})
mars = new THREE.Mesh(geometry_3, material_3)
mars.castShadow = true
//mars.layers.enable(1)

const geometry_bloommars = new THREE.SphereGeometry(0.18, 64, 32)
const material_bloommars = new THREE.MeshBasicMaterial({
	color: 0xde7f56,
})
var marsbloom = new THREE.Mesh(geometry_bloommars, material_bloommars)
marsbloom.layers.enable(1)

const geometry_4 = new THREE.SphereGeometry(0.2, 64, 32)
const material_4 = new THREE.MeshPhongMaterial({
	map: jupiter_map,
	// color: 0xf0e0bf,
	// reflectivity: 0.8,
})
jupiter = new THREE.Mesh(geometry_4, material_4)
jupiter.castShadow = true
//jupiter.layers.enable(1)

const geometry_bloomjupiter = new THREE.SphereGeometry(0.18, 64, 32)
const material_bloomjupiter = new THREE.MeshBasicMaterial({
	color: 0xf0e0bf,
})
var jupiterbloom = new THREE.Mesh(geometry_bloomjupiter, material_bloomjupiter)
jupiterbloom.layers.enable(1)

const geometry_5 = new THREE.SphereGeometry(0.2, 64, 32)
const material_5 = new THREE.MeshPhongMaterial({
	map: neptune_map,
	// color: 0x73bed6,
})
neptune = new THREE.Mesh(geometry_5, material_5)
neptune.castShadow = true
//neptune.layers.enable(1)

const geometry_bloomneptune = new THREE.SphereGeometry(0.18, 64, 32)
const material_bloomneptune = new THREE.MeshBasicMaterial({
	color: 0x73bed6,
})
var neptunebloom = new THREE.Mesh(geometry_bloomneptune, material_bloomneptune)
neptunebloom.layers.enable(1)

const generateGalaxy = () => {
	// Destroy old galaxy
	if (points !== null) {
		geometry.dispose()
		material.dispose()
		scene.remove(points)
	}

	/**
	 * Geometry
	 */
	geometry = new THREE.BufferGeometry()

	const positions = new Float32Array(parameters.count * 3)
	const colors = new Float32Array(parameters.count * 3)

	const colorInside = new THREE.Color(parameters.insideColor)
	const colorOutside = new THREE.Color(parameters.outsideColor)

	for (let i = 0; i < parameters.count; i++) {
		// Position
		const i3 = i * 3

		const radius = Math.random() * parameters.radius

		const spinAngle = radius * parameters.spin
		const branchAngle =
			((i % parameters.branches) / parameters.branches) * Math.PI * 2

		const randomX =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius
		const randomY =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius
		const randomZ =
			Math.pow(Math.random(), parameters.randomnessPower) *
			(Math.random() < 0.5 ? 1 : -1) *
			parameters.randomness *
			radius

		positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
		positions[i3 + 1] = randomY
		positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

		// Color
		const mixedColor = colorInside.clone()
		mixedColor.lerp(colorOutside, radius / parameters.radius)

		colors[i3] = mixedColor.r
		colors[i3 + 1] = mixedColor.g
		colors[i3 + 2] = mixedColor.b
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	/**
	 * Material
	 */
	material = new THREE.PointsMaterial({
		size: parameters.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		opacity: 0.8,
		map: star_map,
	})

	/**
	 * Points
	 */
	points = new THREE.Points(geometry, material)
	scene.add(points)

	/**
	 * planetas
	 */

	/* const geo = new THREE.BoxGeometry( 1, 1, 1 ); 
	 const mat = new THREE.MeshPhongMaterial({color:0x049ef4, flatShading: true, side: THREE.DoubleSide}) 
	 const caja = new THREE.Mesh(geo, mat)
     caja.position.set(0,0,0)*/
	neptune.position.set(1.93, -0.04, 0.94)
	neptunebloom.position.set(1.93, -0.04, 0.94)
	venus.position.set(1.07, 0.45, -2.37)
	venusbloom.position.set(1.07, 0.45, -2.37)
	mercury.position.set(-0.16, -0.65, -1.64)
	mercurybloom.position.set(-0.16, -0.65, -1.64)
	mars.position.set(1.31, 0.21, 3.65)
	marsbloom.position.set(1.31, 0.21, 3.65)
	jupiter.position.set(-2.62, 0.08, 1.07)
	jupiterbloom.position.set(-2.62, 0.08, 1.07)
	points.add(
		mercury,
		venus,
		mars,
		jupiter,
		neptune,
		marsbloom,
		neptunebloom,
		venusbloom,
		mercurybloom,
		jupiterbloom
	)
}

const generateBackgroundGalaxy = () => {
	// Destroy old galaxy
	if (pointsBack !== null) {
		geometry.dispose()
		material.dispose()
		scene.remove(pointsBack)
	}

	/**
	 * Geometry
	 */
	geometry = new THREE.BufferGeometry()

	const positions = new Float32Array(100000 * 3)
	const colors = new Float32Array(100000 * 3)

	const colorInside = new THREE.Color('#297fcf')
	const colorOutside = new THREE.Color('#297fcf')

	for (let i = 0; i < parameters.count; i++) {
		// Position
		const i3 = i * 3

		const radius = Math.random() * 6

		const spinAngle = radius * parameters.spin
		const branchAngle =
			((i % parameters.branches) / parameters.branches) * Math.PI * 2

		const randomX =
			Math.pow(Math.random(), 1) * (Math.random() < 0.5 ? 1 : -1) * 2 * radius
		const randomY =
			Math.pow(Math.random(), 1) * (Math.random() < 0.5 ? 1 : -1) * 2 * radius
		const randomZ =
			Math.pow(Math.random(), 1) * (Math.random() < 0.5 ? 1 : -1) * 2 * radius

		positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
		positions[i3 + 1] = randomY
		positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

		// Color
		const mixedColor = colorInside.clone()
		mixedColor.lerp(colorOutside, radius / parameters.radius)

		colors[i3] = mixedColor.r
		colors[i3 + 1] = mixedColor.g
		colors[i3 + 2] = mixedColor.b
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	/**
	 * Material
	 */
	material = new THREE.PointsMaterial({
		size: 0.15,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		vertexColors: true,
		opacity: 1,
		map: star_map,
	})

	/**
	 * Points
	 */
	pointsBack = new THREE.Points(geometry, material)
	scene.add(pointsBack)
}

generateBackgroundGalaxy()
generateGalaxy()

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener('resize', () => {
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
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 7
camera.layers.enable(1)
/**Sonido de fondo de la escena */
// crea el audio y se lo añade a la camara
// const listener = new THREE.AudioListener()
// camera.add(listener)

// // se crea el source global de audio
// const sound = new THREE.Audio(listener)

// // se caraga el sonido y se lo almacena en el buffer
// const audioLoader = new THREE.AudioLoader()
// audioLoader.load('./assets/sonidos/background.mp3', function (buffer) {
// 	sound.setBuffer(buffer)
// 	sound.setLoop(true)
// 	sound.setVolume(0.8)
// 	sound.play()
// })

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 6
controls.maxDistance = 10

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.shadowMap.enabled = true

/**
  *  
  scroll animation
  */
/*document.addEventListener('mousemove', onDocumentMouseMove) 
 let mouseX=0; 
 let mouseY=0; 
 
 let targetX=0; 
 let targetY=0; 
 const windowX= window.innerWidth/2; 
 const windowY = window.innerHeight/2;  
 function onDocumentMouseMove(event){ 
mouseX = (event.clientX - windowX) 
mouseY = (event.clientY - windowY)
 }*/
/**
 * lights
 */
let color_dir = new THREE.Color(colors.modelcolor)
ambient_light = new THREE.AmbientLight(0xb26c9f, 1)
scene.add(ambient_light)
const light = new THREE.PointLight(0xb26c9f, 2, 0, 2)
light.position.set(0, 0, 0)
scene.add(light)
/**
 * bloom effects
 */
renderScene = new RenderPass(scene, camera)

bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	1.5,
	0.4,
	0.85
)
bloomPass.threshold = bloom_parameters.bloomThreshold
bloomPass.strength = bloom_parameters.bloomStrength
bloomPass.radius = bloom_parameters.bloomRadius

composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)
//**EVENTOS DE RAYCASTER CON ANIMACIONES TWEEN */
function onPointerMove(event) {
	pointer.x = (event.clientX / sizes.width) * 2 - 1
	pointer.y = -(event.clientY / sizes.height) * 2 + 1

	if (currentObj) {
		console.log('currentObj')
		switch (currentObj.object) {
			case mars:
				var bloomfade = new TWEEN.Tween(marsbloom.scale)
					.to({ x: 3.3, y: 3.3, z: 3.3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()

				var universe_scale = new TWEEN.Tween(currentObj.object.scale)
					.to({ x: 3, y: 3, z: 3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()

				break
			case neptune:
				var bloomfade = new TWEEN.Tween(neptunebloom.scale)
					.to({ x: 3.3, y: 3.3, z: 3.3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				var universe_scale = new TWEEN.Tween(currentObj.object.scale)
					.to({ x: 3, y: 3, z: 3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				break
			case venus:
				var bloomfade = new TWEEN.Tween(venusbloom.scale)
					.to({ x: 3.3, y: 3.3, z: 3.3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				var universe_scale = new TWEEN.Tween(currentObj.object.scale)
					.to({ x: 3, y: 3, z: 3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				break
			case jupiter:
				var bloomfade = new TWEEN.Tween(jupiterbloom.scale)
					.to({ x: 3.3, y: 3.3, z: 3.3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				var universe_scale = new TWEEN.Tween(currentObj.object.scale)
					.to({ x: 3, y: 3, z: 3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				break
			case mercury:
				var bloomfade = new TWEEN.Tween(mercurybloom.scale)
					.to({ x: 3.3, y: 3.3, z: 3.3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				var universe_scale = new TWEEN.Tween(currentObj.object.scale)
					.to({ x: 3, y: 3, z: 3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()
				break
		}
	} else {
		console.log('nocurrentObj')
		if (currentPlanet) {
			console.log(clickedObj)
			switch (currentPlanet.object) {
				case mars:
					if (clickedObj === 'mars') {
					} else {
						var bloomfade = new TWEEN.Tween(marsbloom.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()

						var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
					}
					break
				case neptune:
					if (clickedObj === 'neptune') {
					} else {
						var bloomfade = new TWEEN.Tween(neptunebloom.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
						var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
					}
					break
				case venus:
					if (clickedObj === 'venus') {
					} else {
						var bloomfade = new TWEEN.Tween(venusbloom.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
						var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
					}
					break
				case jupiter:
					if (clickedObj === 'jupiter') {
					} else {
						var bloomfade = new TWEEN.Tween(jupiterbloom.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
						var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
					}
					break
				case mercury:
					if (clickedObj === 'mercury') {
					} else {
						var bloomfade = new TWEEN.Tween(mercurybloom.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
						var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
							.to({ x: 1, y: 1, z: 1 }, 1000)
							.easing(TWEEN.Easing.Circular.Out)
							.start()
					}
					break
			}
		}
	}
}
let clickedObj = null

function moveAndLookAt(camera, dstpos, dstlookat, options) {
	options || (options = { duration: 300 })

	controls.enabled = false

	var origpos = new THREE.Vector3().copy(camera.position) // original position
	var origrot = new THREE.Euler().copy(camera.rotation) // original rotation

	camera.position.set(dstpos.x, dstpos.y, dstpos.z)
	camera.lookAt(dstlookat)
	var dstrot = new THREE.Euler().copy(camera.rotation)

	// reset original position and rotation
	camera.position.set(origpos.x, origpos.y, origpos.z)
	camera.rotation.set(origrot.x, origrot.y, origrot.z)

	//
	// Tweening
	//

	// position
	new TWEEN.Tween(camera.position)
		.to(
			{
				x: dstpos.x,
				y: dstpos.y,
				z: dstpos.z,
			},
			options.duration
		)

		.onComplete(() => {
			// controls.enabled = true
			if (clickedObj === 'mars') {
				controls.target = new THREE.Vector3(
					mars.position.x,
					mars.position.y,
					mars.position.z
				)
			} else if (clickedObj === 'neptune') {
				controls.target = new THREE.Vector3(
					neptune.position.x,
					neptune.position.y,
					neptune.position.z
				)
			} else if (clickedObj === 'venus') {
				controls.target = new THREE.Vector3(
					venus.position.x,
					venus.position.y,
					venus.position.z
				)
			} else if (clickedObj === 'jupiter') {
				controls.target = new THREE.Vector3(
					jupiter.position.x,
					jupiter.position.y,
					jupiter.position.z
				)
			} else if (clickedObj === 'mercury') {
				controls.target = new THREE.Vector3(
					mercury.position.x,
					mercury.position.y,
					mercury.position.z
				)
			} else if (clickedObj === null) {
				controls.target = new THREE.Vector3(0, 0, 0)
			}
			controls.update()
			console.log(controls.target)
			console.log('skere')
		})
		.start()

	// rotation (using slerp)
	;(function () {
		var qa = (qa = new THREE.Quaternion().copy(camera.quaternion)) // src quaternion
		var qb = new THREE.Quaternion().setFromEuler(dstrot) // dst quaternion
		var qm = new THREE.Quaternion()
		camera.quaternion.copy(qm)

		var o = { t: 0 }
		new TWEEN.Tween(o)
			.to({ t: 1 }, options.duration)
			.onUpdate(function () {
				qm.slerpQuaternions(qa, qb, o.t)
				camera.quaternion.set(qm.x, qm.y, qm.z, qm.w)
			})
			.start()
	}.call(this))
}
const click = new Audio('./assets/sonidos/click1.mp3')
click.volume = 0.5
let prevPlanet = ''
const coordenadas = { x: -55, y: 0 }
function clic() {
	if (currentObj) {
		if (currentObj.object.uuid !== prevPlanet) {
			if (currentObj && initialize) {
				click.play()
				var starShrink = new TWEEN.Tween(points.material)
					.to({ size: 0.05 }, 1000)
					.easing(TWEEN.Easing.Bounce.InOut)
					.start()
				var starShrink = new TWEEN.Tween(pointsBack.material)
					.to({ size: 0.08 }, 1000)
					.easing(TWEEN.Easing.Bounce.InOut)
					.start()
				info.forEach((e) => {
					e.style.transform = 'translate3D(-150%,0,0)'
					e.opacity = '0'
				})
				controls.minDistance = 0
				controls.maxDistance = 100
				switch (currentObj.object) {
					case mars:
						console.log(currentObj.object)
						clickedObj = 'mars'
						var vector = new THREE.Vector3()
						vector.setFromMatrixPosition(mars.matrixWorld)

						showInfo(0)

						moveAndLookAt(
							camera,
							new THREE.Vector3(vector.x, vector.y + 0.5, vector.z + 0.9),
							new THREE.Vector3(vector.x - 1, vector.y, vector.z),
							{ duration: 1500 }
						)

						break
					case neptune:
						clickedObj = 'neptune'
						var vector = new THREE.Vector3()
						vector.setFromMatrixPosition(neptune.matrixWorld)

						showInfo(1)

						moveAndLookAt(
							camera,
							new THREE.Vector3(vector.x, vector.y + 0.5, vector.z + 0.9),
							new THREE.Vector3(vector.x - 1, vector.y, vector.z),
							{ duration: 1500 }
						)

						break
					case venus:
						clickedObj = 'venus'
						var vector = new THREE.Vector3()
						vector.setFromMatrixPosition(venus.matrixWorld)

						showInfo(2)

						moveAndLookAt(
							camera,
							new THREE.Vector3(vector.x, vector.y + 0.5, vector.z + 0.9),
							new THREE.Vector3(vector.x - 1, vector.y, vector.z),
							{ duration: 1500 }
						)

						break
					case jupiter:
						clickedObj = 'jupiter'
						var vector = new THREE.Vector3()
						vector.setFromMatrixPosition(jupiter.matrixWorld)

						showInfo(3)

						moveAndLookAt(
							camera,
							new THREE.Vector3(vector.x, vector.y + 0.5, vector.z + 0.9),
							new THREE.Vector3(vector.x - 1, vector.y, vector.z),
							{ duration: 1500 }
						)

						break
					case mercury:
						clickedObj = 'mercury'
						var vector = new THREE.Vector3()
						vector.setFromMatrixPosition(mercury.matrixWorld)

						showInfo(4)

						moveAndLookAt(
							camera,
							new THREE.Vector3(vector.x, vector.y + 0.5, vector.z + 0.9),
							new THREE.Vector3(vector.x - 1, vector.y, vector.z),
							{ duration: 1500 }
						)

						break
				}
				prevPlanet = currentObj.object.uuid
			}
		}
	}
}
window.addEventListener('click', clic)
window.addEventListener('pointermove', onPointerMove)
/**
 * botones de informacion
 */
var coordenadas_reverse = {
	x: 15,
	y: 0,
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let currentObj = null
let currentPlanet = null

const tick = () => {
	//bloom efect animation
	renderer.autoClear = false
	renderer.clear()
	camera.layers.set(1)
	composer.render()
	const elapsedTime = clock.getElapsedTime()
	if (initialize) {
		raycaster.setFromCamera(pointer, camera)
	}
	if (!clickedObj) {
		controls.update()
	}

	const objetos = [mars, neptune, venus, jupiter, mercury]
	const intersects = raycaster.intersectObjects(objetos)
	if (intersects.length) {
		currentObj = intersects[0]
		currentPlanet = intersects[0]

		canvas.style.cursor = 'pointer'

		// console.log(mars.rotation.y)

		if (clickedObj) {
			// canvas.style.cursor = 'auto'
			// mars.rotation.y += 0.01
			// mars.rotation.x += 0.005
			mars.rotation.y += 0.005
			mars.rotation.x += 0.003
			neptune.rotation.y += 0.005
			neptune.rotation.x += 0.003

			venus.rotation.y += 0.005
			venus.rotation.x += 0.003

			jupiter.rotation.y += 0.005
			jupiter.rotation.x += 0.003

			mercury.rotation.y += 0.005
			mercury.rotation.x += 0.003
		} else {
			points.rotation.y += 0.001
			pointsBack.rotation.y += 0.001
		}
	} else {
		canvas.style.cursor = 'auto'
		currentObj = null

		// if (clickedObj === 'mars') {
		// 	console.log('test mars')
		// 	mars.rotation.y += 0.005
		// 	mars.rotation.x += 0.003
		// } else if (clickedObj === 'neptune') {
		// 	neptune.rotation.y += 0.01
		// 	neptune.rotation.x += 0.005
		// } else if (clickedObj === 'venus') {
		// 	venus.rotation.y += 0.01
		// 	venus.rotation.x += 0.005
		// } else if (clickedObj === 'jupiter') {
		// 	jupiter.rotation.y += 0.01
		// 	jupiter.rotation.x += 0.005
		// } else if (clickedObj === 'mercury') {
		// 	mercury.rotation.y += 0.01
		// 	mercury.rotation.x += 0.005
		// }
		if (clickedObj) {
			mars.rotation.y += 0.005
			mars.rotation.x += 0.003
			neptune.rotation.y += 0.005
			neptune.rotation.x += 0.003

			venus.rotation.y += 0.005
			venus.rotation.x += 0.003

			jupiter.rotation.y += 0.005
			jupiter.rotation.x += 0.003

			mercury.rotation.y += 0.005
			mercury.rotation.x += 0.003
		} else {
			// console.log(clickedObj)
			// ESTO HACE GIRAR LA GALAXIA *
			points.rotation.y += 0.002
			pointsBack.rotation.y += 0.002
			////////////
			canvas.style.cursor = 'auto'
			mars.rotation.y += 0.005
			mars.rotation.x += 0.003
			neptune.rotation.y += 0.005
			neptune.rotation.x += 0.003

			venus.rotation.y += 0.005
			venus.rotation.x += 0.003

			jupiter.rotation.y += 0.005
			jupiter.rotation.x += 0.003

			mercury.rotation.y += 0.005
			mercury.rotation.x += 0.003
		}
	}

	TWEEN.update()

	// Render
	renderer.clearDepth()
	camera.layers.set(0)
	renderer.render(scene, camera)
	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
