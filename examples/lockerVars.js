export const locker = {
  locked: false,
  status: "open",
  ipAdress: "local",
};

const length = 200;
const width = 90;

export const lockerDoors = [
  {
    doorNumber: 1,
    width: width,
    height: "33",
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
    height: "22",
    length: length,
    status: "active",
    column: 1,
    open: true,
  },
  {
    doorNumber: 4,
    width: width,
    height: "23",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 5,
    width: width,
    height: "35",
    length: length,
    status: "inactive",
    column: 1,
  },
  {
    doorNumber: 6,
    width: width,
    height: "23",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 8,
    width: width,
    height: "40",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 9,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 10,
    width: width,
    height: "30",
    length: length,
    status: "active",
    column: 2,
  },
  ,
  {
    doorNumber: 11,
    width: width,
    height: "23",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 12,
    width: width,
    height: "55",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 13,
    width: width,
    height: "55",
    length: length,
    status: "active",
    column: 3,
  },
  {
    doorNumber: 14,
    width: width,
    height: "55",
    length: length,
    status: "active",
    column: 3,
  },
  {
    doorNumber: 15,
    width: width,
    height: "55",
    length: length,
    status: "active",
    column: 3,
  },
  {
    doorNumber: 16,
    width: width,
    height: "55",
    length: length,
    status: "active",
    column: 3,
  },
  {
    doorNumber: 17,
    width: width,
    height: "44",
    length: length,
    status: "active",
    column: 4,
  },
  {
    doorNumber: 18,
    width: width,
    height: "33",
    length: length,
    status: "inactive",
    column: 4,
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
