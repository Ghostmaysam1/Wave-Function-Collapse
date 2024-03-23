const tiles = [];
const tileImages = [];
let grid = [];
var DIM = parseInt(prompt("Enter board Size:")) || 10;
if(DIM > 80)
  DIM = 80;


function preload() {
  // let path = 'circuit';
  // let path = 'img';
  let path = 'circuit';
  for (let i = 0; i < 13; i++) {
    tileImages[i] = loadImage(path + '/' + i + '.png');
  }
}

function setup() {
  size = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
  size -= 15;
  createCanvas(size, size);
  background(27, 27, 27);

  tiles.push(new Tile(tileImages[0], ["AAA", "AAA", "AAA", "AAA"], 0));
  tiles.push(new Tile(tileImages[1], ["BBB", "BBB", "BBB", "BBB"], 0));
  tiles.push(new Tile(tileImages[2], ["BBB", "BCB", "BBB", "BBB"], 3));
  tiles.push(new Tile(tileImages[3], ["BBB", "BDB", "BBB", "BDB"], 1));
  tiles.push(new Tile(tileImages[4], ["ABB", "BCB", "BBA", "AAA"], 3));
  tiles.push(new Tile(tileImages[5], ["ABB", "BBB", "BBB", "BBA"], 3));
  tiles.push(new Tile(tileImages[6], ["BBB", "BCB", "BBB", "BCB"], 1));
  tiles.push(new Tile(tileImages[7], ["BDB", "BCB", "BDB", "BCB"], 1));
  tiles.push(new Tile(tileImages[8], ["BDB", "BBB", "BCB", "BBB"], 3));
  tiles.push(new Tile(tileImages[9], ["BCB", "BCB", "BBB", "BCB"], 3));
  tiles.push(new Tile(tileImages[10], ["BCB", "BCB", "BCB", "BCB"], 1));
  tiles.push(new Tile(tileImages[11], ["BCB", "BCB", "BBB", "BBB"], 3));
  tiles.push(new Tile(tileImages[12], ["BBB", "BCB", "BBB", "BCB"], 1));

  let len = tiles.length;

  for (let i = 0; i < len; i++) {
    for (let j = 1; j < tiles[i].r + 1; j++) {
      tiles.push(tiles[i].rotate(j));
    }
  }

  console.log(tiles.length);

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startOver() {
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(tiles.length);
  }
  w = width / DIM;
  h = height / DIM;

  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      fill(27);
      stroke(70);
      rect(i * w, j * h, w, h)
    }
  }
}

function checkValid(arr, valid) {
  for (let i = arr.length - 1; i >= 0; i--) {

    let element = arr[i];
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
}

function draw() {
  // Pick cell with least entropy
  var gridCopy = grid.slice();
  gridCopy = gridCopy.filter(a => !a.collapsed);

  if (gridCopy.length == 0) {
    noLoop();
    return;
  }

  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length
  })

  let len = gridCopy[0].options.length;
  let stopIndex = 0;

  for (let i = 0; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }

  stopIndex && gridCopy.splice(stopIndex);

  const cell = random(gridCopy);
  cell.collapsed = true;

  const pick = random(cell.options);
  if (pick === undefined) {
    startOver()
    return;
  }

  cell.options = [pick];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * w, j * h, w, h);
      }
    }
  }


  const nextGrid = [];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);

        //* look up
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }

        //* look right
        if (i < DIM - 1) {
          let right = grid[i + 1 + j * DIM];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        //* look down
        if (j < DIM - 1) {
          let down = grid[i + (j + 1) * DIM];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }

        //* look left
        if (i > 0) {
          let left = grid[i - 1 + j * DIM];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions)
        }
        nextGrid[index] = new Cell(options);
      }
    }
  }
  grid = nextGrid;
  // noLoop();
  textAlign(CENTER, CENTER);
  textSize((size / DIM) - (size / DIM) / 2);
  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      if (!grid[i + j * DIM].collapsed) {
        fill(27);
        rect(i * w, j * h, w, h);
        fill(0);
        if(grid[i + j * DIM].options.length < tiles.length) {
          fill(255);
        }
        text(grid[i + j * DIM].options.length, (i * w) + (w / 2), (j * h) + (h / 2));
      }
    }
  }
}