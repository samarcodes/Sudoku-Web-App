let arr = [[], [], [], [], [], [], [], [], []];
let temp = [[], [], [], [], [], [], [], [], []];

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);

    }
}

function initializeTemp(temp) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            temp[i][j] = false;

        }
    }
}

function setTemp(board, temp) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                temp[i][j] = true;
            }
        }
    }
}

function setColor(temp) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (temp[i][j] == true) {
                arr[i][j].style.color = "#DC3545";
            }

        }
    }
}

function resetColor() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            arr[i][j].style.color = "green";
        }
    }
}

let board = [[], [], [], [], [], [], [], [], []];

let easyButton = document.getElementById('generate-sudoku-easy');
let mediumButton = document.getElementById('generate-sudoku-medium');
let hardButton = document.getElementById('generate-sudoku-hard');
let clearButton = document.getElementById('btn-clear');
let solve = document.getElementById('solve');

function changeBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                arr[i][j].innerText = board[i][j];
            } else
                arr[i][j].innerText = '';
        }
    }
}

async function fetchSudoku(difficultyLevel) {
    const response = await fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficultyLevel}`);
    const data = await response.json();
    initializeTemp(temp);
    resetColor();
    board = data.board;
    setTemp(board, temp);
    setColor(temp);
    changeBoard(board);
}

easyButton.onclick = function (event) {
    fetchSudoku(event.target.value);
}

mediumButton.onclick = function (event) {
    fetchSudoku(event.target.value);
}

hardButton.onclick = function (event) {
    fetchSudoku(event.target.value);
}

clearButton.onclick = function () {
    const lol = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const lol1 = [
        [...lol],
        [...lol],
        [...lol],
        [...lol],
        [...lol],
        [...lol],
        [...lol],
        [...lol],
        [...lol]
    ];
    changeBoard(lol1);
}

//to be completed by student, function should not return anything
// you can make a call to changeboard(board) function to update the state on the screen
//returns a boolean true of false
function isSafe(board, r, c, no) {
    //not repeating in the same row or column
    for (let i = 0; i < 9; i++) {
        if (board[i][c] == no || board[r][i] == no) {
            return false;
        }
    }
    //subgrid
    const sx = r - r % 3;
    const sy = c - c % 3;

    for (let x = sx; x < sx + 3; x++) {
        for (let y = sy; y < sy + 3; y++) {
            if (board[x][y] == no) {
                return false;
            }
        }
    }
    return true;
}

function solveSudokuHelper(board, r, c) {
    //base case 
    if (r == 9) {
        changeBoard(board);
        return true;
    }
    //other cases 
    if (c == 9) {
        return solveSudokuHelper(board, r + 1, 0);
    }
    //pre-filled cell, skip it
    if (board[r][c] != 0) {
        return solveSudokuHelper(board, r, c + 1);
    }

    //there is 0 in the current location
    for (let i = 1; i <= 9; i++) {
        if (isSafe(board, r, c, i)) {
            board[r][c] = i;
            let success = solveSudokuHelper(board, r, c + 1);
            if (success === true) {
                return true;
            }
            //backtracking step
            board[r][c] = 0;
        }
    }
    return false;

}

function solveSudoku(board) {
    solveSudokuHelper(board, 0, 0);
}

solve.onclick = function () {
    solveSudoku(board)
}