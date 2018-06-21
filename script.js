window.onload = () => {
  let universe = [];
  let isDrawing;
  let rows = 100;
  let column = 200;
  let interval;

  let grid = document.getElementById('grid');
  let start = document.getElementById('start');
  let random = document.getElementById('random');
  let stop = document.getElementById('stop');

  // create grid
  for (let i = 0; i < rows; i++) {
    universe[i] = [];
    tr = grid.appendChild(document.createElement("tr"));
    for (let j = 0; j < column; j++) {
      universe[i][j] = 0;
      th = document.createElement("th");
      th.setAttribute('id', `${i},${j}`);
      tr.appendChild(th);
    }
  }

  const gameOfLife = () => {
    let rowLen = universe.length;
    let colLen = universe[0].length;

    for (let i = 0; i < rowLen; i++) {
      for (let j = 0; j < colLen; j++) {
        neighbours(universe, i, j);
      }
    }

    for (let i = 0; i < rowLen; i++) {
      for (let j = 0; j < colLen; j++) {
        let count = Math.abs(universe[i][j]);
        if ((count < 2 || count > 3) && universe[i][j] > 0) {
          universe[i][j] = 0;
        } else if (count === 3 && universe[i][j] < 0) {
          universe[i][j] = 1;
        } else if ((count === 2 || count === 3) && universe[i][j] > 0) {
          universe[i][j] = 1;
        }
      }
    }
  }

  const neighbours = (mass, paramI, paramJ) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let y = -1; y <= 1; y++) {
        if (i === 0 && y === 0) continue;
        let indexI = i + paramI;
        let indexJ = y + paramJ;
        if (
          indexI >= 0 && indexI < mass.length &&
          indexJ >= 0 && indexJ < mass[0].length &&
          mass[indexI][indexJ] === 1) {
          count++;
        }
      }
    }
    count = mass[paramI][paramJ] === 1 ? count : count * -1; // -1 dead cell
    mass[paramI][paramJ] = count;
  }

  const startGame = () => {
    interval = setInterval(() => {
      gameOfLife();
      fillAliveCells();
    }, 600);
  }

  const fillAliveCells = () => {
    for (let i = 0; i < universe.length; i++) {
      for (let j = 0; j < universe[0].length; j++) {
        if (universe[i][j] === 1) {
          document.getElementById(i + ',' + j).style.backgroundColor = 'black';
        } else {
          document.getElementById(i + ',' + j).style.backgroundColor = 'white';
        }
      }
    }
  }

  const fillRandomCells = () => {
    for (let i = 0; i < universe.length; i++) {
      for (let j = 0; j < universe[0].length; j++) {
        universe[i][j] = Math.floor(Math.random() * 2);
      }
    }
    fillAliveCells();
  }

  start.addEventListener('click', startGame);

  random.addEventListener('click', fillRandomCells);

  stop.addEventListener('click', () => {
    clearInterval(interval);
  });

  grid.addEventListener('click', (e) => {
    let id = e.target.id;
    let coor = id.split(',');
    if (!isNaN(parseInt(coor[0], 10)) && !isNaN(parseInt(coor[1], 10))) {
      universe[parseInt(coor[0], 10)][parseInt(coor[1], 10)] = 1;
      document.getElementById(id.toString()).style.backgroundColor = 'black';
    }
  })

  grid.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      let id = e.target.id;
      let coor = id.split(',');
      if (isNaN(parseInt(coor[0], 10)) || isNaN(parseInt(coor[1], 10))) {
        isDrawing = false;
      } else {
        universe[parseInt(coor[0], 10)][parseInt(coor[1], 10)] = 1;
        document.getElementById(id.toString()).style.backgroundColor = 'black';
      }
    }
  })

  grid.addEventListener('mousedown', () => {
    isDrawing = true;
  })

  grid.addEventListener('mouseup', () => {
    isDrawing = false;
  })
}