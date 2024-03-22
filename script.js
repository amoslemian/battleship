let playerGrid = [];
let computerGrid = [];
const gridSize = 10;
let ships = [{ size: 5, name: 'Carrier' }, { size: 4, name: 'Battleship' }, { size: 3, name: 'Cruiser' }, { size: 3, name: 'Submarine' }, { size: 2, name: 'Destroyer' }];
let currentPlayer = 'player';

function initializeGrids() {
    for (let i = 0; i < gridSize; i++) {
        playerGrid[i] = [];
        computerGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            playerGrid[i][j] = { ship: false, hit: false };
            computerGrid[i][j] = { ship: false, hit: false };
        }
    }
}

function placeShips(grid) {
    for (const ship of ships) {
        let orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        } while (!isValidPosition(grid, x, y, ship.size, orientation));

        for (let i = 0; i < ship.size; i++) {
            if (orientation === 'horizontal') {
                grid[x + i][y].ship = true;
            } else {
                grid[x][y + i].ship = true;
            }
        }
    }
}

function isValidPosition(grid, x, y, size, orientation) {
    if (orientation === 'horizontal') {
        if (x + size > gridSize) return false;
        for (let i = 0; i < size; i++) {
            if (grid[x + i][y].ship) return false;
        }
    } else {
        if (y + size > gridSize) return false;
        for (let i = 0; i < size; i++) {
            if (grid[x][y + i].ship) return false;
        }
    }
    return true;
}

function startGame() {
    initializeGrids();
    placeShips(playerGrid);
    placeShips(computerGrid);
    renderGrid('player');
    renderGrid('computer');
}

function renderGrid(player) {
    const grid = player === 'player' ? playerGrid : computerGrid;
    const container = document.getElementById(player === 'player' ? 'grid' : 'computer-grid');
    container.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (grid[i][j].ship && player === 'player') {
                cell.classList.add('ship');
            } else if (grid[i][j].hit) {
                cell.classList.add(grid[i][j].ship ? 'hit' : 'miss');
            }
            if (player === 'player') {
                cell.addEventListener('click', () => {
                    if (!grid[i][j].hit) {
                        attack(i, j, player);
                    }
                });
            } else {
                cell.addEventListener('click', () => {
                    if (!grid[i][j].hit) {
                        attack(i, j, 'player'); // Attack player's grid
                    }
                });
            }
            container.appendChild(cell);
        }
    }
}

function attack(x, y, player) {
    const grid = player === 'player' ? computerGrid : playerGrid;
    if (grid[x][y].hit) return; // If the cell is already hit, do nothing
    grid[x][y].hit = true;
    renderGrid(player === 'player' ? 'computer' : 'player');
    if (checkWin(player === 'player' ? 'computer' : 'player')) return;
    if (player === 'player') {
        randomlyChooseSpot(); // Choose a spot from player's grid
    }
}

function randomlyChooseSpot() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while (playerGrid[x][y].hit); // Select random cell from player's grid
    attack(x, y, 'computer'); // Attack player's grid
}



function checkWin(player) {
    const grid = player === 'player' ? playerGrid : computerGrid;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j].ship && !grid[i][j].hit) {
                return false;
            }
        }
    }
    alert(player === 'player' ? 'You win!' : 'Computer wins!');
    return true;
}

startGame();
