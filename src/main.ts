import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.domElement.setAttribute('class', 'webgl')

const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  1,
  500
)
camera.position.set(0, 0, 100)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#A04E5D')

const materialYellow = new THREE.LineBasicMaterial({
  color: '#F1EEBA',
  linewidth: 4,
})
const materialOrange = new THREE.LineBasicMaterial({
  color: '#F19877',
  linewidth: 4,
})

const getLineSquare = (material: THREE.Material) => {
  const points = []
  points.push(new THREE.Vector3(-5, 0, 0))
  points.push(new THREE.Vector3(0, 5, 0))
  points.push(new THREE.Vector3(5, 0, 0))
  points.push(new THREE.Vector3(0, -5, 0))
  points.push(new THREE.Vector3(-5, 0, 0))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)

  return line
}

const getSquareColumn = (
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
  animationFn: (item: THREE.Object3D, idx: number) => void
) => {
  const group = new THREE.Group()
  const v2 = new THREE.Vector3(0, 10, 0)

  const squares = []
  for (let i = 0; i < 5; i++) {
    const lineSquare = getLineSquare(material)
    if (i > 0) {
      lineSquare.position.copy(squares[i - 1].position).add(v2)
    }

    group.add(lineSquare)
    squares.push(lineSquare)
  }

  group.children.forEach(animationFn)

  group.position.x = x
  group.position.y = y
  group.position.z = z

  return group
}

const animationRight = (item: THREE.Object3D, idx: number) => {
  gsap.to(item.rotation, {
    y: 2 * Math.PI,
    duration: 5,
    yoyo: true,
    repeat: -1,
    ease: idx > 0 ? `power${idx}` : 'power1',
  })
}

const animationLeft = (item: THREE.Object3D, idx: number) => {
  gsap.fromTo(
    item.rotation,
    { y: Math.PI },
    {
      y: -Math.PI,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: idx > 0 ? `power${idx}` : 'power1',
    }
  )
}

for (let i = 0; i < 8; i++) {
  const x = i * 5 - 20
  const y = i % 2 === 0 ? -20 : -25
  const z = i % 2 === 0 ? 0 : 0.01
  const material = i % 2 === 0 ? materialYellow : materialOrange
  const animationFn = i % 2 === 0 ? animationRight : animationLeft

  scene.add(getSquareColumn(x, y, z, material, animationFn))
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function animate() {
  controls.update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
