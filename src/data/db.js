export const locker = {
  name: "Arturito3D",
  height: 210,
  width: 300,
};

// doors default dimensiona
const length = 200;
const width = 90;

export const doors = [
  {
    doorNumber: 0,
    width: width,
    height: "210",
    length: length,
    status: "inactive",
    column: 3,
  },
  {
    doorNumber: 1,
    width: width,
    height: "60",
    length: length,
    status: "inactive",
    column: 1,
    open: false,
  },
  {
    doorNumber: 2,
    width: width,
    height: "50",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 3,
    width: width,
    height: "50",
    length: length,
    status: "active",
    column: 1,
    open: true,
  },
  {
    doorNumber: 4,
    width: width,
    height: "50",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 5,
    width: width,
    height: "40",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 6,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 7,
    width: width,
    height: "30",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 8,
    width: width,
    height: "23",
    length: length,
    status: "inactive",
    column: 2,
  },
  {
    doorNumber: 9,
    width: width,
    height: "65",
    length: length,
    status: "inactive",
    column: 4,
  },
  {
    doorNumber: 10,
    width: width,
    height: "45",
    length: length,
    status: "active",
    column: 4,
  },
  {
    doorNumber: 11,
    width: width,
    height: "75",
    length: length,
    status: "active",
    column: 4,
  },
  {
    doorNumber: 12,
    width: width,
    height: "25",
    length: length,
    status: "active",
    column: 4,
  },
  {
    doorNumber: 13,
    width: width,
    height: "55",
    length: length,
    status: "active",
    column: 5,
  },
  {
    doorNumber: 14,
    width: width,
    height: "44",
    length: length,
    status: "active",
    column: 5,
  },
  {
    doorNumber: 15,
    width: width,
    height: "33",
    length: length,
    status: "inactive",
    column: 5,
  },
];


export const createBox = () => {
  let scale = { x: 6, y: 6, z: 6 };
  let pos = { x: 15, y: scale.y / 2, z: 15 };

  let box = new THREE.Mesh(
    new THREE.BoxBufferGeometry(),
    new THREE.MeshPhongMaterial({ color: 0xdc143c })
  );

  box.position.set(pos.x, pos.y, pos.z);
  box.scale.set(scale.x, scale.y, scale.z);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  box.userData.draggable = true;
};
