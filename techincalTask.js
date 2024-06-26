const mapWidth = 50;
const mapHeight = 10;
const maxRoomSize = 50;
const minRoomSize = 9;
const maxRooms = 4;

function createEmptyMap(width, height) {
  const map = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push("#");
    }
    map.push(row);
  }
  return map;
}

function findSides(area) {
  let sidesArray = [];
  for (let i = 3; i <= Math.sqrt(area); i++) {
    if (area % i === 0) {
      let side1 = i;
      let side2 = area / i;
      sidesArray.push([side1 + 2, side2 + 2]);
    }
  }
  if (sidesArray.length === 0) {
    sidesArray.push([0, 0]);
  }
  const sides = sidesArray[Math.floor(Math.random() * sidesArray.length)];
  return sides;
}

function generateRandomRoom() {
  const roomSize =
    Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
  const sides = findSides(roomSize);
  const roomWidth = sides[0];
  const roomHeight = sides[1];
  const xCord = Math.floor(Math.random() * (mapWidth - roomWidth - 2)) + 1;
  const yCord = Math.floor(Math.random() * (mapHeight - roomHeight - 2)) + 1;
  return { xCord, yCord, width: roomWidth, height: roomHeight };
}

function isRoomValid(room, map) {
  if (room.width === 0 || room.height === 0) return false;
  for (let y = room.yCord - 1; y <= room.yCord + room.height; y++) {
    if (y < 0 || y >= mapHeight) return false;
    for (let x = room.xCord - 1; x <= room.xCord + room.width; x++) {
      if (x < 0 || x >= mapWidth) return false;
      if (map[y][x] !== "#") {
        return false;
      }
    }
  }
  return true;
}

function placeRoom(room, map, roomNumber) {
  for (let y = room.yCord; y < room.yCord + room.height; y++) {
    for (let x = room.xCord; x < room.xCord + room.width; x++) {
      if (y === room.yCord || y === room.yCord + room.height - 1) {
        map[y][x] = "_";
      } else if (x === room.xCord || x === room.xCord + room.width - 1) {
        map[y][x] = "|";
      } else {
        map[y][x] = ".";
      }
    }
  }
  map[room.yCord + 1][room.xCord + 1] = roomNumber;
}

function generateDungeon() {
  const map = createEmptyMap(mapWidth, mapHeight);
  let rooms = [];
  let attempts = 0;

  while (rooms.length < maxRooms && attempts < 1000) {
    const newRoom = generateRandomRoom();
    if (isRoomValid(newRoom, map)) {
      rooms.push(newRoom);
      placeRoom(newRoom, map, rooms.length);
    }
    attempts++;
  }

  rooms.sort((a, b) => a.yCord - b.yCord || a.xCord - b.xCord);

  const mapCleared = createEmptyMap(mapWidth, mapHeight);
  for (let i = 0; i < rooms.length; i++) {
    placeRoom(rooms[i], mapCleared, i + 1);
  }
  return mapCleared;
}

function printMap(map) {
  map.forEach((row) => {
    console.log(row.join(""));
  });
}

const dungeonMap = generateDungeon();
printMap(dungeonMap);
