var canvas = document.getElementById('mazeCanvas')
var ctx = canvas.getContext('2d')
var blocks = 0;
var pieceDimension;
var grid = [];
var bl = 0;
canvas.width = 500;
canvas.height = 500;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandom10(min, max) {
    return getRandomInt(min / 10, max / 10) * 10;
  }

if(window.innerHeight<500){
    canvas.height = getRandom10(window.innerHeight-10, window.innerHeight-5);
}
if(window.innerWidth<500){
    canvas.width = getRandom10(window.innerWidth-10, window.innerWidth-5);
}



document.querySelector('#dimensionText').textContent = document.getElementById('vol').value;
document.getElementById('vol').addEventListener("change", function(e){
    document.querySelector('#dimensionText').textContent =e.target.value;
})
document.getElementById('submit').onclick = (e) => {
    e.preventDefault();
    blocks = document.getElementById('vol').value
   
    pieceDimension = canvas.width / blocks;
    start()
}

function findIndex(i, j) {

    if (j < 0 || i < 0 || j > (blocks - 1) || i > (blocks - 1)) {
        return -1;
    }

    return j + i * blocks
}
class Cell {
    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.walls = [true, true, true, true]
        this.visited = false;
    }

    draw = () => {
        ctx.clearRect(this.x, this.y, this.d, this.d)
        if (this.walls[0]) {

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.d, this.y);
            ctx.stroke();
            ctx.closePath();
        }
        if (this.walls[1]) {

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.moveTo(this.x + this.d, this.y);
            ctx.lineTo(this.x + this.d, this.y + this.d);
            ctx.stroke();
            ctx.closePath();
        }
        if (this.walls[2]) {

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.moveTo(this.x + this.d, this.y + this.d);
            ctx.lineTo(this.x, this.y + this.d);
            ctx.stroke();
            ctx.closePath();
        }
        if (this.walls[3]) {

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.moveTo(this.x, this.y + this.d);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
            ctx.closePath();
        }
        if (this.visited) {
            var color = '#add8e6'
            this.highlight(color, this.x, this.y, this.d)
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#666666';


    }
    highlight = (color, x, y, d) => {
        ctx.strokeStyle = "rgba(1, 1, 1, 0)";
        ctx.fillStyle = color
        ctx.fillRect(x, y, d, d)
    }
    findNeighbors = (specified = '') => {
        let i = this.y / pieceDimension;
        let j = this.x / pieceDimension
        if (specified === '') {
            var neighbors = [];
            var top = grid[findIndex(i - 1, j)]
            var right = grid[findIndex(i, j + 1)]
            var bottom = grid[findIndex(i + 1, j)]
            var left = grid[findIndex(i, j - 1)]
            if (top && !top.visited) {
                neighbors.push(top)
            }
            if (right && !right.visited) {
                neighbors.push(right)
            }
            if (bottom && !bottom.visited) {
                neighbors.push(bottom)
            }
            if (left && !left.visited) {
                neighbors.push(left)
            }

            if (neighbors.length > 0) {

                var randomIndex = Math.floor(Math.random() * (neighbors.length - 0) + 0);
                return neighbors[randomIndex]
            }
            return undefined;
        } else {

            if (specified === 'up') {
                return grid[findIndex(i - 1, j)]
            }
            if (specified === 'right') {
                return grid[findIndex(i, j + 1)]
            }
            if (specified === 'down') {
                return grid[findIndex(i + 1, j)]
            }
            if (specified === 'left') {
                return grid[findIndex(i, j - 1)]
            }
        }

    }
}

var gameInterval;
var current;
var stack;
document.querySelector('.reload').onclick = () => {
    location.reload();
}


function start() {
    document.querySelector('.selectDimension').style.display = 'none'
    document.querySelector('.reload').style.display = 'block'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    grid = [];
    for (let i = 0; i < blocks; i++) {
        let x = 0;
        let y = pieceDimension * i;
        for (let j = 0; j < blocks; j++) {
            x = pieceDimension * j;
            let newCell = new Cell(x, y, pieceDimension)
            grid.push(newCell)
            newCell.draw();
        }
    }
    generator();
}




function generator() {
    stack = [];
    current = grid[0];
    current.visited = true;
    grid[0] = current
    var visitedLength = 1;
    gameInterval = setInterval(() => {
        startExploring()
    }, 0)
}

function startExploring() {
    var neighbor = current.findNeighbors()
    if (neighbor) {
        neighbor.visited = true
        stack.push(current)
        removeWall(neighbor, current)
        var currentIndex = findIndex(current.y / pieceDimension, current.x / pieceDimension)
        grid[currentIndex] = current
        var neighborIndex = findIndex(neighbor.y / pieceDimension, neighbor.x / pieceDimension)
        grid[neighborIndex] = neighbor
        current.draw();
        neighbor.draw();
        current = neighbor
    } else if (stack.length > 0) {
        current = stack.pop();
    } else if (stack.length === 0) {
        grid[0].highlight('green', grid[0].x + 5, grid[0].y + 5, grid[0].d -10)
        grid[grid.length - 1].highlight('red', grid[grid.length - 1].x + 5, grid[grid.length - 1].y + 5, grid[grid.length - 1].d - 10)
        clearInterval(gameInterval)
        current = grid[0];
        document.querySelector('.downloadPuzzle').style.display = 'block'
        userPlay();
    }
}

function removeWall(a, b) {
    var i1 = a.y / pieceDimension;
    var i2 = b.y / pieceDimension;
    var x = i1 - i2;
    if (x === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (x === -1) {
        a.walls[2] = false;
        b.walls[0] = false
    }
    var j1 = a.x / pieceDimension;
    var j2 = b.x / pieceDimension;
    var y = j1 - j2;
    if (y === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (y === -1) {
        a.walls[1] = false;
        b.walls[3] = false
    }
}

var keyPressed = {
    left: false,
    right: false,
    down: false,
    up: false
}
var req;

function showResult() {
    var resultDiv = document.querySelector('.mazeResult')
    resultDiv.style.display = 'block'
    resultDiv.style.top = canvas.offsetTop + 'px';
    var h1 = document.createElement('h1');
    h1.className = 'resultText'
    h1.innerText = 'Hoorah! You found a way'
    resultDiv.appendChild(h1);

}


function userPlay() {
    req = requestAnimationFrame(userPlay)
    if (current === grid[grid.length - 1]) {
        current = grid[grid.length - 1]
        cancelAnimationFrame(req)
        showResult()

    }
    current.highlight('green', current.x + 5, current.y + 5, current.d - 10)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'ArrowUp') {
            keyPressed['up'] = true
        }
        if (e.code === 'ArrowLeft') {
            keyPressed['left'] = true
        }
        if (e.code === 'ArrowRight') {
            keyPressed['right'] = true
        }
        if (e.code === 'ArrowDown') {
            keyPressed['down'] = true
        }
        setTimeout(()=>{
            keyPressed['left'] = false;
            keyPressed['right'] = false;
            keyPressed['up'] = false;
            keyPressed['down'] = false;
        }, 20)
    }, {
        once:true
    })
    document.addEventListener('keyup', () => {
        keyPressed['left'] = false;
        keyPressed['right'] = false;
        keyPressed['up'] = false;
        keyPressed['down'] = false;
    })
    if (keyPressed['up']) {
        if (!current.walls[0]) {
            var neighbor = current.findNeighbors('up')


            if (neighbor) {
                current.highlight('blue', current.x + 5, current.y + 5, current.d - 10)
                current = neighbor
            }
        } else {
            console.log('cannot move')
        }

    } else if (keyPressed['right']) {
        if (!current.walls[1]) {
            var neighbor = current.findNeighbors('right')
            if (neighbor) {
                current.highlight('blue', current.x + 5, current.y + 5, current.d - 10)
                current = neighbor

            }
        } else {
            console.log('cannot move')
        }

    } else if (keyPressed['down']) {
        if (!current.walls[2]) {
            var neighbor = current.findNeighbors('down')
            if (neighbor) {
                current.highlight('blue', current.x + 5, current.y + 5, current.d - 10)
                current = neighbor

            }
        } else {
            console.log('cannot move')
        }

    } else if (keyPressed['left']) {
        if (!current.walls[3]) {
            var neighbor = current.findNeighbors('left')
            if (neighbor) {
                current.highlight('blue', current.x + 5, current.y + 5, current.d - 10)
                current = neighbor

            }
        } else {
            console.log('cannot move')
        }

    }


}


function download(){
    var link = document.createElement('a');
    link.download = 'mazePuzzle.png';
    link.href = canvas.toDataURL()
    link.click();

}