var cells = [...document.querySelectorAll('.cell')]

var aiTurn = false;
const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ]
    // var fillCount = 0;
cells.map((cell, i) => {
    cell.onclick = () => {
        if (!cell.getAttribute('clicked')) {
            cell.innerText = `O`
            cell.setAttribute('player', 'human')
            cell.setAttribute('clicked', true)
            var win = checkWin(cells, false)
            if (emptySpots(cells).length === 0) {
                document.querySelector('.tictacResult').style.display = 'block'
                cells.map(cell => {
                    cell.setAttribute('clicked', true)
                })
                document.querySelector('.tictacResult').innerText = 'Draw'
            }
            if (!win) {
                var moveIndex = bestMoveAI()

                cells.map(cell => {
                    if (cell.id == moveIndex) {
                        cell.innerText = 'X'
                        cell.setAttribute('player', 'ai');
                        cell.setAttribute('clicked', true)
                    }
                })
                var win = checkWin(cells, true)
                if (win) {

                    document.querySelector('.tictacResult').style.display = 'block'
                    cells.map(cell => {
                        cell.setAttribute('clicked', true)
                    })
                    document.querySelector('.tictacResult').innerText = 'AI WINS'

                }
            } else {
                document.querySelector('.tictacResult').style.display = 'block'
                cells.map(cell => {
                    cell.setAttribute('clicked', true)
                })
                document.querySelector('.tictacResult').innerText = 'Human WINS'
            }

        } else {
            console.log('clicked')
        }
    }
})




function emptySpots(board) {
    var avail = [];
    board.map(cell => {
        if (!cell.getAttribute('player')) {
            avail.push(cell)
        }
    })
    return avail;
}

function checkWin(board, turn) {

    var plays;
    if (turn) {
        plays = board.filter(cell => cell.getAttribute('player') === 'ai')
    } else {
        plays = board.filter(cell => cell.getAttribute('player') === 'human')

    }
    var finalPlays = [];
    plays.forEach(play => {
        finalPlays.push(+play.id)
    })
    for (let i = 0; i < winCombos.length; i++) {
        if (winCombos[i].every(combo => finalPlays.indexOf(combo) > -1)) {
            return turn ? 'ai' : 'human'
        }

    }
    return false;

}

function bestMoveAI() {
    let bestMove;
    let bestScore = 1000
    let alpha = -1000;
    let beta = 1000;
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].getAttribute('player')) {
            cells[i].setAttribute('player', 'ai')
            var score = minmax(cells, true, alpha, beta)
            cells[i].removeAttribute('player')
            if (score < bestScore) {
                bestScore = score;
                bestMove = cells[i].id
                beta = Math.min(beta, bestScore)
            }
        }
    }
    return bestMove
}

function minmax(board, turn, alpha, beta) {
    if (checkWin(board, turn) === 'ai') {
        return -1;
    } else if (checkWin(board, turn) === 'human') {
        return 1;
    } else if (emptySpots(board).length === 0) {
        return 0;
    }
    if (turn) {
        let bestScore = -1000;
        for (let i = 0; i < board.length; i++) {
            if (!board[i].getAttribute('player')) {
                board[i].setAttribute('player', 'human')
                let score = minmax(board, false)
                bestScore = Math.max(score, bestScore)
                alpha = Math.max(alpha, bestScore)

                board[i].removeAttribute('player')
                if (beta <= alpha)
                    break;

            }
        }
        return bestScore

    } else {

        let bestScore = 1000;
        for (let i = 0; i < board.length; i++) {
            if (!board[i].getAttribute('player')) {
                board[i].setAttribute('player', 'ai')
                let score = minmax(board, true)
                bestScore = Math.min(score, bestScore)
                beta = Math.min(beta, bestScore)

                board[i].removeAttribute('player')
                if (beta <= alpha)
                    break;

            }
        }
        return bestScore
    }

}

function reload() {
    location.reload();
}