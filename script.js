window.onload = () => {
  let universe = [];
  let isDrawing;
  let rows = 60;
  let columns = 100;
  let interval;
  let ctx;

  let canvas = document.getElementById('grid');
  let start = document.getElementById('start');
  let random = document.getElementById('random');
  let stop = document.getElementById('stop');
  let step = document.getElementById('step');

  for (let i = 0; i < rows; i++) {
    universe[i] = [];
    for (let j = 0; j < columns; j++) {
      universe[i][j] = 0;
    }
  }

  const drawGrid = (w, h) => {
    ctx = canvas.getContext('2d');
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    for (let x = 0; x <= w; x += 8) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      for (let y = 0; y <= h; y += 8) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();
  };

  drawGrid(800, 480);

  const fillCell = (e) => {
    ctx.fillStyle = "black";
    universe[Math.floor(e.offsetY / 8)][Math.floor(e.offsetX / 8)] = 1;
    ctx.fillRect(Math.floor(e.offsetX / 8) * 8,
      Math.floor(e.offsetY / 8) * 8,
      8, 8);
  }

  const handleClick = (e) => {
    fillCell(e);
  }

  const handleDraw = (e) => {
    if (canvas.isDrawing) {
      fillCell(e);
    }
  }

  const gameOfLife = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        neighbours(universe, i, j);
      }
    }
    nextGeneration();
  }

  const neighbours = (mass, paramI, paramJ) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let y = -1; y <= 1; y++) {
        if (i === 0 && y === 0) continue;
        let indexI = i + paramI;
        let indexJ = y + paramJ;
        if (
          indexI >= 0 && indexI < rows &&
          indexJ >= 0 && indexJ < columns &&
          mass[indexI][indexJ] > 0) {
          count++;
        }
      }
    }
    count = mass[paramI][paramJ] === 1 ? count : count * -1; // -1 dead cell
    mass[paramI][paramJ] = count;
  }

  const nextGeneration = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
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

  const startGame = () => {
    interval = setInterval(() => {
      gameOfLife();
      fillAliveCells();
    }, 600);
  }

  const fillAliveCells = () => {
    ctx.clearRect(0, 0, 800, 480);
    drawGrid(800, 480);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (universe[i][j] === 1) {
          ctx.fillStyle = "black";
          ctx.fillRect(j * 8, i * 8, 8, 8);
        } else {
          ctx.fillStyle = "white";
          ctx.fillRect(j * 8 + 1, i * 8 + 1, 6, 6);
        }
      }
    }
  }

  const fillRandomCells = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
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

  step.addEventListener('click', () => {
    gameOfLife();
    fillAliveCells();
  });

  canvas.addEventListener('click', handleClick);

  canvas.addEventListener('mousemove', handleDraw);

  canvas.addEventListener('mousedown', () => {
    canvas.isDrawing = true;
  });

  canvas.addEventListener('mouseup', () => {
    canvas.isDrawing = false;
  });
}