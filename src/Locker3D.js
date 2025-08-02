import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { locker, doors } from './data/db.js';
import './main.css';

const frustumSize = 800;
const initialCameraPosition = new THREE.Vector3(30, 20, 100);

function Locker3D() {
  // Store frontal meshes for raycaster
  const frontalMeshesRef = useRef([]);

  // Add raycaster click detection for frontal faces only
  useEffect(() => {
    function onWebGLClick(event) {
      // Use the latest renderer and camera from threeRef
      const renderer = threeRef.current.renderer;
      const camera = threeRef.current.camera;
      if (!renderer || !camera) return;
      // Get mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      // Raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      // Only check frontal meshes
      const frontalMeshes = frontalMeshesRef.current || [];
      if (frontalMeshes.length === 0) return;
      const intersects = raycaster.intersectObjects(frontalMeshes, false);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        if (mesh.userData && mesh.userData.door) {
          alert('Frontal face clicked! Door data: ' + JSON.stringify(mesh.userData.door));
          console.log('Frontal face clicked, door data:', mesh.userData.door);
        } else {
          alert('Frontal face mesh clicked!');
          console.log('Frontal face mesh clicked:', mesh);
        }
      }
    }
    // Attach listener after renderer is created
    const interval = setInterval(() => {
      if (threeRef.current.renderer && threeRef.current.renderer.domElement) {
        threeRef.current.renderer.domElement.addEventListener('click', onWebGLClick);
        clearInterval(interval);
      }
    }, 100);
    return () => {
      if (threeRef.current.renderer && threeRef.current.renderer.domElement) {
        threeRef.current.renderer.domElement.removeEventListener('click', onWebGLClick);
      }
      clearInterval(interval);
    };
  }, []);
  const mountRef = useRef();
  const threeRef = useRef({});
  const inactivityTimeout = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    let camera, scene, renderer, scene2, renderer2, controls;
    let doorMeshes = [];
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    );
    camera.position.copy(initialCameraPosition);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene2 = new THREE.Scene();
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      wireframeLinewidth: 1,
      side: THREE.DoubleSide,
    });
    const doorColors = { front: 'orange', sides: 'white', back: 'black' };

    const length = 200;
    const width = 90;
    const columns = [...new Set(doors.map((d) => d.column))].filter(
      (c) => c !== undefined
    );
    // order columns by number
    columns.sort((a, b) => a - b);

    // Validate sum of door heights per column
    columns.forEach((col) => {
      const columnDoors = doors.filter((d) => d.column === col);
      const sumHeights = columnDoors.reduce((acc, d) => acc + parseInt(d.height), 0);
      const doorIndexes = columnDoors.map((d) => d.doorNumber);

      if (sumHeights === locker.height && col !== 0) {
        doorIndexes.forEach(i => {
          doors[i] ? doors[i].match = true : null;
        });
      }
      else console.error(`Column ${col} does not match locker height: ${sumHeights} != ${locker.height}`);
    });

    for (let c = 0; c < columns.length; c++) {
      // Draw all columns except column 0, one next to the other
      const columnDoors = doors.filter((d) => d.column === columns[c]);
      let acc = 0;
      // Position columns in a row, left to right
      let x = (c - (columns.includes(0) ? 1 : 0)) * (width + 2); // 2px gap, skip 0
      // Move all columns left by 50% of total width and down by 10% of locker.height
      let xOffset = -0.5 * columns.length * (width + 2);
      let yOffset = -0.1 * locker.height;
      for (let i = 0; i < columnDoors.length; i++) {
        const door = columnDoors[i];
        const h = parseInt(door.height);
        acc = acc + h;
        let y = locker.height - acc + h / 2 + yOffset;
        // Use a special color for door number 0
        const isDoorZero = door.doorNumber === 0;
        const customDoorColors = isDoorZero
          ? { ...doorColors, front: '#87cefa' } // light blue
          : doorColors;
        drawDoor(door, customDoorColors, { x: x + xOffset, y, z: 0 }, material, scene, scene2);
      }
    }

    // floor
    createPlane(
      500,
      400,
      'black',
      new THREE.Vector3(0, -100, 90),
      new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
      undefined,
      material,
      scene,
      scene2
    );
    // wall
    createPlane(
      500,
      400,
      'gray',
      new THREE.Vector3(0, 100, -110),
      new THREE.Euler(0, 0, 0),
      undefined,
      material,
      scene,
      scene2
    );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    renderer2 = new CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    mountRef.current.appendChild(renderer2.domElement);
    controls = new OrbitControls(camera, renderer2.domElement);
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controlsRef.current = controls;
    function animate() {
      renderer.render(scene, camera);
      renderer2.render(scene2, camera);
      threeRef.current.animationId = requestAnimationFrame(animate);
    }
    animate();
    function handleWindowClick(e) {
      const classList = Array.from(e.target.classList || []);
      const doorClass = classList.find((cls) => cls.startsWith('my-door-class-'));
      if (doorClass) {
        const doorNumber = doorClass.split('-').pop();
        const myCLass = `.my-door-class-${doorNumber}`;
        const color = document.querySelector(myCLass).style.background;
        if (color === 'red') {
          // Inactive
          return;
        }
        if (color === 'green') {
          document.querySelector(myCLass).style.background = 'orange';
        } else {
          document.querySelector(myCLass).style.background = 'green';
        }
      }
      resetInactivityTimer();
    }
    function resetInactivityTimer() {
      clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => {
        camera.position.copy(initialCameraPosition);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      }, 5000);
    }
    window.addEventListener('click', handleWindowClick);
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('wheel', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
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
    window.addEventListener('resize', onWindowResize);
    threeRef.current = { renderer, renderer2, camera, animationId: threeRef.current.animationId };
    return () => {
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('wheel', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('resize', onWindowResize);
      if (threeRef.current.animationId) cancelAnimationFrame(threeRef.current.animationId);
      if (renderer && renderer.domElement && renderer.domElement.parentNode)
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      if (renderer2 && renderer2.domElement && renderer2.domElement.parentNode)
        renderer2.domElement.parentNode.removeChild(renderer2.domElement);
    };
  }, []);
  return <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'relative' }} />;
}

function drawDoor(door, doorColors, pos, material, scene, scene2) {
  let wh = door.width / 2;
  let hh = door.height / 2;
  const borderColor = !door.match ? 'red' : 'white';

  // left
  createPlane(
    door.length,
    door.height,
    doorColors.sides,
    new THREE.Vector3(-wh + pos.x, 0 + pos.y, 0 + pos.z),
    new THREE.Euler(0, -90 * THREE.MathUtils.DEG2RAD, 0),
    undefined,
    material,
    scene,
    scene2,
    borderColor
  );
  // back
  createPlane(
    door.height,
    door.width,
    doorColors.back,
    new THREE.Vector3(0 + pos.x, 0 + pos.y, -wh + pos.z - door.length / 4),
    new THREE.Euler(0, 0, -90 * THREE.MathUtils.DEG2RAD),
    undefined,
    material,
    scene,
    scene2,
    borderColor
  );
  // right
  createPlane(
    door.length,
    door.height,
    doorColors.sides,
    new THREE.Vector3(wh + pos.x, 0 + pos.y, 0 + pos.z),
    new THREE.Euler(0, -90 * THREE.MathUtils.DEG2RAD, 0),
    undefined,
    material,
    scene,
    scene2,
    borderColor
  );
  // front (store mesh for raycaster)
  const frontalMesh = createPlane(
    door.width,
    door.height,
    doorColors.front,
    new THREE.Vector3(0 + pos.x, 0 + pos.y, wh + pos.z + door.length / 4),
    new THREE.Euler(0, 0, 0),
    door,
    material,
    scene,
    scene2,
    borderColor,
    true // isFrontal
  );
  if (frontalMesh) {
    frontalMeshesRef.current.push(frontalMesh);
  }
  // top
  createPlane(
    door.width,
    door.length,
    doorColors.sides,
    new THREE.Vector3(0 + pos.x, hh + pos.y, 0 + pos.z),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
    undefined,
    material,
    scene,
    scene2,
    borderColor
  );
  // bottom
  createPlane(
    door.width,
    door.length,
    doorColors.sides,
    new THREE.Vector3(0 + pos.x, -hh + pos.y, 0 + pos.z),
    new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
    undefined,
    material,
    scene,
    scene2,
    borderColor
  );
}

function createPlane(
  width,
  height,
  cssColor,
  pos,
  rot,
  door,
  material,
  scene,
  scene2,
  borderColor,
  isFrontal = false) {

  const element = document.createElement('div');
  element.style.width = width + 'px';
  element.style.height = height + 'px';
  element.style.opacity = door ? 1 : 0.75;
  element.style.background = cssColor;
  element.style.border = `4px solid ${borderColor}`;
  if (door && door.doorNumber && door.status) {
    var numberText = document.createTextNode(`${door.doorNumber}`);
    element.classList.add(`my-door-class-${door.doorNumber}`);
    element.appendChild(numberText);
    var statusText = document.createTextNode(`${door.doorNumber}`);
    statusText.textContent = door.status === 'active' ? ' activa' : ' inactiva';
    element.appendChild(statusText);
    if (door.status === 'inactive') element.style.background = 'red';
    else if (door.open) {
      element.style.background = 'green';
    } else {
      element.style.background = 'orange';
    }
  }
  const object = new CSS3DObject(element);
  object.position.copy(pos);
  object.rotation.copy(rot);
  scene2.add(object);
  const geometry = new THREE.PlaneGeometry(width, height);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(object.position);
  mesh.rotation.copy(object.rotation);
  // Attach door data for raycaster click detection
  if (door && door.doorNumber && door.status) {
    mesh.userData.door = door;
  }
  scene.add(mesh);
  // Return mesh only if this is the frontal face
  if (isFrontal) {
    return mesh;
  }
  // Always return undefined for non-frontal faces
  return undefined;
}

export default Locker3D;
