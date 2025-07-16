import * as THREE from "three";
import { lockerDoors } from "./lockerVars.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS3DRenderer, CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

let camera, scene, renderer;
let scene2, renderer2;
const frustumSize = 800;
const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
const moveMouse = new THREE.Vector2();
let draggable;
let inactivityTimeout;
const initialCameraPosition = new THREE.Vector3(30, 20, 100);
let controls;

function setupEventListeners() {
  window.addEventListener("click", handleWindowClick);
  window.addEventListener("mousemove", resetInactivityTimer);
  window.addEventListener("wheel", resetInactivityTimer);
  window.addEventListener("keydown", resetInactivityTimer);
}

function handleWindowClick(e) {
    console.log("Window clicked", e);
  // Get all class names as an array from the clicked element
  const classList = Array.from(e.target.classList || []);
  // Find the class that starts with 'my-door-class-'
  const doorClass = classList.find((cls) => cls.startsWith("my-door-class-"));
  if (doorClass) {
    const doorNumber = doorClass.split("-").pop();
    const myCLass = `.my-door-class-${doorNumber}`;
    const color = document.querySelector(myCLass).style.background;
    if (color === "red") {
      console.log("Puerta inactiva");
      return;
    }
    if (color === "green") {
      document.querySelector(myCLass).style.background = "orange";
    } else {
      document.querySelector(myCLass).style.background = "green";
    }
  }
  resetInactivityTimer();
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    camera.position.copy(initialCameraPosition);
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, 5000);
}

export function initLocker() {
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  );
  camera.position.set(30, 20, 100);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene2 = new THREE.Scene();
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    wireframeLinewidth: 1,
    side: THREE.DoubleSide,
  });
  const doorColors = { front: "orange", sides: "white", back: "black" };
  const maxColumnHeight = 200;
  const length = 200;
  const width = 90;
  const columns = [...new Set(lockerDoors.map((d) => d.column))].filter(
    (c) => c !== undefined
  );
  const isPairColumns = columns.length % 2 == 0;
  const middleColumn = !isPairColumns ? (columns.length - 1) / 2 + 1 : null;
  for (let c = 0; c < columns.length; c++) {
    const columnDoors = lockerDoors.filter((d) => d.column === columns[c]);
    let acc = 0;
    for (let i = 0; i < columnDoors.length; i++) {
      const door = columnDoors[i];
      const h = parseInt(door.height);
      const column = parseInt(door.column);
      let x = 0;
      if (middleColumn && middleColumn === column) {
        x = 0;
      } else {
        if (column <= columns.length / 2) x = -(column * 100);
        else x = column * width - 150;
      }
      acc = acc + h;
      let y = maxColumnHeight - acc + h / 2;
      drawDoor(door, doorColors, { x, y, z: 0 }, material);
    }
  }
  // floor
  createPlane(
    500,
    400,
    "black",
    new THREE.Vector3(0, -100, 90),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
    undefined,
    undefined,
    undefined,
    material
  );
  // wall
  createPlane(
    500,
    400,
    "gray",
    new THREE.Vector3(0, 100, -110),
    new THREE.Euler(0, 0, 0),
    undefined,
    undefined,
    undefined,
    material
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer2 = new CSS3DRenderer();
  renderer2.setSize(window.innerWidth, window.innerHeight);
  renderer2.domElement.style.position = "absolute";
  renderer2.domElement.style.top = 0;
  document.body.appendChild(renderer2.domElement);
  controls = new OrbitControls(camera, renderer2.domElement);
  controls.minZoom = 0.5;
  controls.maxZoom = 2;
  window.addEventListener("resize", onWindowResize);
  setupEventListeners();
}

function drawDoor(door, doorColors, pos, material) {
  let wh = door.width / 2;
  let hh = door.height / 2;
  // left
  createPlane(
    door.length,
    door.height,
    doorColors.sides,
    new THREE.Vector3(-wh + pos.x, 0 + pos.y, 0 + pos.z),
    new THREE.Euler(0, -90 * THREE.MathUtils.DEG2RAD, 0),
    undefined,
    undefined,
    undefined,
    material
  );
  // back
  createPlane(
    door.height,
    door.width,
    doorColors.back,
    new THREE.Vector3(0 + pos.x, 0 + pos.y, -wh + pos.z - door.length / 4),
    new THREE.Euler(0, 0, -90 * THREE.MathUtils.DEG2RAD),
    undefined,
    undefined,
    undefined,
    material
  );
  // right
  createPlane(
    door.length,
    door.height,
    doorColors.sides,
    new THREE.Vector3(wh + pos.x, 0 + pos.y, 0 + pos.z),
    new THREE.Euler(0, -90 * THREE.MathUtils.DEG2RAD, 0),
    undefined,
    undefined,
    undefined,
    material
  );
  // front
  createPlane(
    door.width,
    door.height,
    doorColors.front,
    new THREE.Vector3(0 + pos.x, 0 + pos.y, wh + pos.z + door.length / 4),
    new THREE.Euler(0, 0, 0),
    door.doorNumber,
    door.status,
    door,
    material
  );
  // top
  createPlane(
    door.width,
    door.length,
    doorColors.sides,
    new THREE.Vector3(0 + pos.x, hh + pos.y, 0 + pos.z),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
    undefined,
    undefined,
    undefined,
    material
  );
  // bottom
  createPlane(
    door.width,
    door.length,
    doorColors.sides,
    new THREE.Vector3(0 + pos.x, -hh + pos.y, 0 + pos.z),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
    undefined,
    undefined,
    undefined,
    material
  );
}

function createPlane(width, height, cssColor, pos, rot, number, status, door, material) {
  const element = document.createElement("div");
  element.style.width = width + "px";
  element.style.height = height + "px";
  element.style.opacity = door ? 1 : 0.75;
  element.style.background = cssColor;
  element.style.border = "1px dotted black";
  if (number && status) {
    var numberText = document.createTextNode(`${number}`);
    element.classList.add(`my-door-class-${number}`);
    element.appendChild(numberText);
    var statusText = document.createTextNode(`${number}`);
    statusText.textContent = status === "active" ? " activa" : " inactiva";
    element.appendChild(statusText);
    if (door.status == "inactive") element.style.background = "red";
    else if (door.open) {
      element.style.background = "green";
    } else {
      element.style.background = "orange";
    }
    element.addEventListener("click", function(event) {
      event.stopPropagation();
      alert(`Puerta ${number} clickeada`);
    });
  }
  const object = new CSS3DObject(element);
  object.position.copy(pos);
  object.rotation.copy(rot);
  scene2.add(object);
  const geometry = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(object.position);
  mesh.rotation.copy(object.rotation);
  scene.add(mesh);
}

export function animateLocker() {
  requestAnimationFrame(animateLocker);
  renderer.render(scene, camera);
  renderer2.render(scene2, camera);
}

function onWindowResize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer2.setSize(window.innerWidth, window.innerHeight);
}
