import * as THREE from '/build/three.module.js'
//import * as THREE from 'three';
import { OrbitControls } from '/jsm/controls/OrbitControls.js'
import * as dat from '/jsm/libs/lil-gui.module.min.js'
import { TWEEN } from '/jsm/libs/tween.module.min.js'
/**
 * unreal bloom
 */
import { RenderPass } from '/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from '/jsm/postprocessing/UnrealBloomPass.js'
import { EffectComposer } from '/jsm/postprocessing/EffectComposer.js'
const gui = new dat.GUI()
//const Tween = new tween.TWEEN()
const neptuneFold = gui.addFolder('camera')
const mercuryFold = gui.addFolder('mercury')
const venusFold = gui.addFolder('venus')
const marsFold = gui.addFolder('mars')
const jupiterFold = gui.addFolder('jupiter')
const directional_light_fold = gui.addFolder('directional Light')
const rotationFold = gui.addFolder('rotation')
const bloom_op = gui.addFolder('bloom')
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
	size: 0.01,
	radius: 5,
	branches: 3,
	spin: 2.68,
	randomness: 0.2,
	randomnessPower: 3,
	insideColor: '#ff6030',
	outsideColor: '#1b3984',
}
const star_map = new THREE.TextureLoader().load('./texturas/white-star.png')
let geometry = null
let material = null
let points = null
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
let close = document.getElementById('close')
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

function growTitle() {
	tapButton.style.filter = 'blur(4px)'
	tapButton.style.opacity = '0'
	tapButton.style.pointerEvents = 'none'

	setTimeout(() => {
		svg.style.transform = 'scale(25)'
		svg.style.top = '70%'
		svg.style.opacity = '0'
		text.style.filter = 'blur(4px)'
		mask.style.filter = 'blur(4px)'
		setTimeout(() => {
			svg.remove()
		}, 2000)
	}, 1000)
}

tap.addEventListener('click', growTitle)

// CLOSE BUTTON FUNCTION
function closeInfo(info) {
	info.target.parentElement.parentElement.style.transform =
		'translate3D(-150%,0,0)'
	info.target.parentElement.parentElement.style.opacity = '0'
	close = new TWEEN.Tween(camera.position)
		.to({ x: 3, y: 3, z: 10 }, 1500)
		.easing(TWEEN.Easing.Linear.None)
		.start()
}

close.addEventListener('click', closeInfo)

//

function showInfo(evt) {
	info[evt].style.transform = 'translate3D(0,0,0)'
	info[evt].style.opacity = '1'
}
//neptune
neptuneFold.add(settings, 'x', -12, 12).onChange(function (value) {
	camera.position.x = value
})
neptuneFold.add(settings, 'y', -12, 12).onChange(function (value) {
	camera.position.y = value
})
neptuneFold.add(settings, 'z', -12, 12).onChange(function (value) {
	camera.position.z = value
})
//mercury
mercuryFold.add(settings, 'x', -5, 5).onChange(function (value) {
	mercury.position.x = value
})
mercuryFold.add(settings, 'y', -5, 5).onChange(function (value) {
	mercury.position.y = value
})
mercuryFold.add(settings, 'z', -5, 5).onChange(function (value) {
	mercury.position.z = value
})
//venus
venusFold.add(settings, 'x', -5, 5).onChange(function (value) {
	venus.position.x = value
})
venusFold.add(settings, 'y', -5, 5).onChange(function (value) {
	venus.position.y = value
})
venusFold.add(settings, 'z', -5, 5).onChange(function (value) {
	venus.position.z = value
})
//mars
marsFold.add(settings, 'x', -5, 5).onChange(function (value) {
	mars.position.x = value
})
marsFold.add(settings, 'y', -5, 5).onChange(function (value) {
	mars.position.y = value
})
marsFold.add(settings, 'z', -5, 5).onChange(function (value) {
	mars.position.z = value
})
//jupiter
jupiterFold.add(settings, 'x', -5, 5).onChange(function (value) {
	jupiter.position.x = value
})
jupiterFold.add(settings, 'y', -5, 5).onChange(function (value) {
	jupiter.position.y = value
})
jupiterFold.add(settings, 'z', -5, 5).onChange(function (value) {
	jupiter.position.z = value
})
//rotation fold
rotationFold.add(settings, 'x', -20, 20).onChange(function (value) {
	points.rotation.x = value
})
rotationFold.add(settings, 'y', -20, 20).onChange(function (value) {
	points.rotation.y = value
})
rotationFold.add(settings, 'z', -20, 20).onChange(function (value) {
	points.rotation.z = value
})
///bloom fold
bloom_op.add(bloom_parameters, 'exposure', -10, 10).onChange(function (value) {
	renderer.toneMapping = Math.pow(value, 4.0)
})
bloom_op
	.add(bloom_parameters, 'bloomThreshold', -10, 10)
	.onChange(function (value) {
		bloomPass.threshold = Number(value)
	})
bloom_op
	.add(bloom_parameters, 'bloomStrength', -10, 10)
	.onChange(function (value) {
		bloomPass.strength = Number(value)
	})
bloom_op
	.add(bloom_parameters, 'bloomRadius', -10, 10)
	.onChange(function (value) {
		bloomPass.radius = Number(value)
	})

const mercury_map = new THREE.TextureLoader().load('./texturas/2k_mercury.jpg')
const venus_map = new THREE.TextureLoader().load(
	'./texturas/2k_venus_atmosphere.jpg'
)
const mars_map = new THREE.TextureLoader().load('./texturas/2k_mars.jpg')
const jupiter_map = new THREE.TextureLoader().load('./texturas/2k_jupiter.jpg')
const neptune_map = new THREE.TextureLoader().load('./texturas/2k_neptune.jpg')

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
		map: star_map
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

gui
	.add(parameters, 'count')
	.min(100)
	.max(1000000)
	.step(100)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'size')
	.min(0.001)
	.max(0.1)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'radius')
	.min(0.01)
	.max(20)
	.step(0.01)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'branches')
	.min(2)
	.max(20)
	.step(1)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'spin')
	.min(-5)
	.max(5)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'randomness')
	.min(0)
	.max(2)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui
	.add(parameters, 'randomnessPower')
	.min(1)
	.max(10)
	.step(0.001)
	.onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
gui.addColor(colors, 'modelcolor').onFinishChange(generateGalaxy)

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
camera.position.z = 10
camera.layers.enable(1)
/**Sonido de fondo de la escena */ 
// crea el audio y se lo añade a la camara
const listener = new THREE.AudioListener();
camera.add( listener );

// se crea el source global de audio
const sound = new THREE.Audio( listener );

// se caraga el sonido y se lo almacena en el buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './sonidos/sound_background.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.2 );
	sound.play();
});

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
		switch (currentObj.object) {
			case mars:
				var bloomfade = new TWEEN.Tween(marsbloom.scale)
					.to({ x: 3.3, y: 3.3, z: 3.3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.start()

				var universe_scale = new TWEEN.Tween(currentObj.object.scale)
					.to({ x: 3, y: 3, z: 3 }, 1000)
					.easing(TWEEN.Easing.Circular.Out)
					.onUpdate(function () {
						// mars.layers.enable(1)
					})
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
					.onUpdate(function () {
						// neptune.layers.enable(1)
					})
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
					.onUpdate(function () {
						// venus.layers.enable(1)
					})
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
					.onUpdate(function () {
						// jupiter.layers.enable(1)
					})
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
					.onUpdate(function () {
						// mercury.layers.enable(1)
					})
					.start()
				break
		}
	} else {
		if (currentPlanet) {
			switch (currentPlanet.object) {
				case mars:
					// a
					var bloomfade = new TWEEN.Tween(marsbloom.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.start()

					var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.onComplete(function () {
							// mars.layers.set(0)
						})
						.start()
					break
				case neptune:
					var bloomfade = new TWEEN.Tween(neptunebloom.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.start()
					var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.onComplete(function () {
							// neptune.layers.set(0)
						})
						.start()
					break
				case venus:
					var bloomfade = new TWEEN.Tween(venusbloom.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.start()
					var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.onComplete(function () {
							// venus.layers.set(0)
						})
						.start()
					break
				case jupiter:
					var bloomfade = new TWEEN.Tween(jupiterbloom.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.start()
					var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.onComplete(function () {
							// jupiter.layers.set(0)
						})
						.start()
					break
				case mercury:
					var bloomfade = new TWEEN.Tween(mercurybloom.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.start()
					var universe_scale = new TWEEN.Tween(currentPlanet.object.scale)
						.to({ x: 1, y: 1, z: 1 }, 1000)
						.easing(TWEEN.Easing.Circular.Out)
						.onComplete(function () {
							// mercury.layers.set(0)
						})
						.start()
					break
			}
		}
	}
}
let clickedObj = false

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

			controls.target = new THREE.Vector3(
				mars.position.x,
				mars.position.y,
				mars.position.z
			)
			controls.update()
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

const coordenadas = { x: -55, y: 0 }
function clic() {
	if (currentObj) {
		switch (currentObj.object) {
			case mars:
				clickedObj = true
				var vector = new THREE.Vector3()

				vector.setFromMatrixPosition(mars.matrixWorld)
				console.log(vector.x)

				moveAndLookAt(
					camera,
					new THREE.Vector3(vector.x - 1, vector.y, vector.z - 2),
					new THREE.Vector3(vector.x + 2, vector.y, vector.z),
					{ duration: 1500 }
				)
				break
			case neptune:
				clickedObj = true

				neptune_move = new TWEEN.Tween(camera.position)
					.to({ x: 3.456, y: 1.392, z: 1.08 }, 2000)
					.easing(TWEEN.Easing.Circular.Out)
					.onUpdate(() => {
						controls.target(0, 0, 0)
					})
					.start()
				break
			case venus:
				clickedObj = true

				window.alert('venus')
				break
			case jupiter:
				clickedObj = true

				window.alert('jupiter')
				break
			case mercury:
				clickedObj = true

				window.alert('mercury')
				break
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
	raycaster.setFromCamera(pointer, camera)
	const objetos = [mars, neptune, venus, jupiter, mercury]
	const intersects = raycaster.intersectObjects(objetos)
	if (intersects.length) {
		currentObj = intersects[0]
		currentPlanet = intersects[0]

		// console.log(currentObj)
		// console.log(currentPlanet)
		//currentObj.object.scale.set(4,4,4)
	} else {
		currentObj = null
		if (clickedObj) {
			mars.rotation.y += 0.01
			mars.rotation.x += 0.005
		} else {
			points.rotation.y += 0.002
		}
	}

	TWEEN.update()
	// controls.update()
	// Render
	renderer.clearDepth()
	camera.layers.set(0)
	renderer.render(scene, camera)
	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
