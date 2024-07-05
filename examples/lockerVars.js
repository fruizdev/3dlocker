export const locker = {
  locked: false,
  status: "open",
  ipAdress: "local",
};

const increment = 2.5;
const length = 150;
const width = 80;

const createDoors = (column, q) => {
  let doors = [];
  for (let i = 0; i < q; i++) {
    doors.push({
      width: 44,
      height: 33,
      length: 80,
      status: "active",
      doorNumber: i + 1,
      column: column,
    });
  }
  return doors;
};

const column0Doors = [
  {
    width: 33,
    height: 33,
    length: 33,
    status: "active",
    doorNumber: 1,
  },
  {
    width: 33,
    height: 33,
    length: 33,
    status: "active",
    doorNumber: 2,
  },
];

const column1Doors = [
  {
    w: 33,
    h: 33,
    l: 33,
    status: "active",
    doorNumber: 3,
  },
  {
    width: 33,
    height: 33,
    length: 33,
    status: "active",
    doorNumber: 4,
  },
];

export const locker2 = {
  bodies: [
    {
      width: 80 * increment,
      height: 185 * increment,
      length: 60 * increment,
      columns: [
        {
          width: 26 * increment,
          height: 180 * increment,
          length: 60 * increment,
          doors: createDoors(1, 12),
        },
        {
          width: 26 * increment,
          height: 180 * increment,
          length: 60 * increment,
          doors: createDoors(2, 12),
        },
        {
          width: 26 * increment,
          height: 180 * increment,
          length: 60 * increment,
          doors: createDoors(3, 12),
        },
      ],
    },
    {
      width: 80 * increment,
      height: 185 * increment,
      length: 60 * increment,
      columns: [
        {
          width: 26 * increment,
          height: 180 * increment,
          length: 60 * increment,
          doors: column0Doors,
        },
        {
          width: 26 * increment,
          height: 180 * increment,
          length: 60 * increment,
          doors: column1Doors,
        },
        {
          width: 26 * increment,
          height: 180 * increment,
          length: 60 * increment,
          doors: column1Doors,
        },
      ],
    },
  ],
};

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
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 3,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
    open: true,
  },
  {
    doorNumber: 4,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 5,
    width: width,
    height: "33",
    length: length,
    status: "inactive",
    column: 1,
  },
  {
    doorNumber: 6,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 7,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 8,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 9,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 10,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  ,
  {
    doorNumber: 11,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 12,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 1,
  },
  {
    doorNumber: 13,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 14,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 15,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 16,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 17,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 18,
    width: width,
    height: "33",
    length: length,
    status: "inactive",
    column: 2,
  },
  {
    doorNumber: 19,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 20,
    width: width,
    height: "33",
    length: length,
    status: "inactive",
    column: 2,
  },
  {
    doorNumber: 21,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 22,
    width: width,
    height: "33",
    length: length,
    status: "inactive",
    column: 2,
  },
  {
    doorNumber: 23,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
  },
  {
    doorNumber: 24,
    width: width,
    height: "33",
    length: length,
    status: "active",
    column: 2,
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
