import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './SizePickerThree.css';

// Necesita que three.js esté disponible en el proyecto
// Si usas Vite, Next.js, etc, importa desde 'three' y 'three/examples/jsm/...'

const SizePickerThree = ({ doors = [], onChange }) => {
  const mountRef = useRef();
  const threeRef = useRef({});

  useEffect(() => {
    let THREE, OrbitControls, CSS3DRenderer, CSS3DObject;
    let renderer, scene, camera, controls, raycaster, cssRenderer, scene2;
    let animationId;
    let doorMeshes = [];

    const init = async () => {
      // Carga dinámica para evitar problemas SSR
      THREE = await import('three');
      OrbitControls = (await import('three/examples/jsm/controls/OrbitControls.js')).OrbitControls;
      CSS3DRenderer = (await import('three/examples/jsm/renderers/CSS3DRenderer.js')).CSS3DRenderer;
      CSS3DObject = (await import('three/examples/jsm/renderers/CSS3DRenderer.js')).CSS3DObject;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const frustumSize = 800;
      const aspect = width / height;
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

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      cssRenderer = new CSS3DRenderer();
      cssRenderer.setSize(width, height);
      cssRenderer.domElement.style.position = 'absolute';
      cssRenderer.domElement.style.top = 0;
      mountRef.current.appendChild(cssRenderer.domElement);

      controls = new OrbitControls(camera, cssRenderer.domElement);
      controls.minZoom = 0.5;
      controls.maxZoom = 2;

      raycaster = new THREE.Raycaster();

      // Dibuja las puertas
      const doorColors = { front: 'orange', sides: 'white', back: 'black' };
      const maxColumnHeight = 200;
      const length = 200;
      const widthDoor = 90;
      const columns = [...new Set(doors.map((d) => d.column))].filter((c) => c !== undefined);
      for (let c = 0; c < columns.length; c++) {
        const columnDoors = doors.filter((d) => d.column === columns[c]);
        let acc = 0;
        for (let i = 0; i < columnDoors.length; i++) {
          const door = columnDoors[i];
          const h = parseInt(door.height);
          const column = parseInt(door.column);
          let x = (column - 1) * (widthDoor + 10) - (columns.length * (widthDoor + 10)) / 2 + widthDoor / 2;
          acc = acc + h;
          let y = maxColumnHeight - acc + h / 2;
          // Crea la puerta (solo el frente clickable)
          const mesh = createDoorMesh(THREE, door, doorColors, { x, y, z: 0 });
          mesh.userData.door = door;
          scene.add(mesh);
          doorMeshes.push(mesh);
        }
      }

      // Luz
      const light = new THREE.DirectionalLight(0xffffff, 0.8);
      light.position.set(0, 200, 200);
      scene.add(light);

      // Floor
      const floorGeo = new THREE.PlaneGeometry(500, 400);
      const floorMat = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.position.set(0, -100, 90);
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);

      // Wall
      const wallGeo = new THREE.PlaneGeometry(500, 400);
      const wallMat = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(0, 100, -110);
      scene.add(wall);

      // Render loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
        cssRenderer.render(scene2, camera);
      };
      animate();

      // Click handler
      const handleClick = (event) => {
        const rect = mountRef.current.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(doorMeshes);
        if (intersects.length > 0) {
          const door = intersects[0].object.userData.door;
          if (door.status !== 'inactive') {
            onChange && onChange(door);
          }
        }
      };
      mountRef.current.addEventListener('click', handleClick);

      // Limpieza
      threeRef.current = { renderer, cssRenderer, animationId };
      return () => {
        mountRef.current.removeEventListener('click', handleClick);
      };
    };
    init();
    return () => {
      const { renderer, cssRenderer, animationId } = threeRef.current;
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode)
          renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (cssRenderer && cssRenderer.domElement && cssRenderer.domElement.parentNode)
        cssRenderer.domElement.parentNode.removeChild(cssRenderer.domElement);
    };
  }, [doors, onChange]);

  return (
    <div className="sizepicker-three-root" ref={mountRef} style={{ width: '100%', height: '400px', position: 'relative' }}>
      {/* El canvas de Three.js se monta aquí */}
    </div>
  );
};

function createDoorMesh(THREE, door, doorColors, pos) {
  // Solo el frente clickable
  const geometry = new THREE.PlaneGeometry(door.width, door.height);
  let color = door.status === 'inactive' ? '#a00' : door.open ? '#0a0' : doorColors.front;
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y, pos.z + door.length / 2);
  return mesh;
}

SizePickerThree.propTypes = {
  doors: PropTypes.array.isRequired,
  onChange: PropTypes.func
};

export default SizePickerThree;
