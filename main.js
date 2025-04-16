document.addEventListener("DOMContentLoaded", function () {
    
    function createCell(id) {
        const cell = document.getElementById(`cell${id}`);
        let checked = "";
        const setChecked = function (value) {
            cell.innerHTML = value;
            checked = value;
        }
        const clear = function () {
            cell.innerHTML = "";
            checked = "";
        }
        const getChecked = function () {
            return checked;
        }
        return function () {
            return {setChecked, clear, getChecked}
        }
    }

    const board = (function gameBoard() {
        let turn = true; // true for player1, false for player2
        
        const cells = [createCell(1)(), createCell(2)(), createCell(3)(),
            createCell(4)(), createCell(5)(), createCell(6)(),
            createCell(7)(), createCell(8)(), createCell(9)()];
        
        const clear = function () {
            cells.forEach(cell => cell.clear());
        }
        
        const switchTurn = function () {
            turn = !turn;
        }

        const getTurn = function () {
            return turn;
        }

        const checkWin = function () {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6] // diagonals
            ];
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (cells[a].getChecked() && cells[a].getChecked() === cells[b].getChecked() && cells[a].getChecked() === cells[c].getChecked()) {
                    return true;
                }
            }
            return false;
        }

        const checkTie = function() {
            return cells.every(cell => cell.getChecked() !== "");
        }

        return function () {
            return {clear, switchTurn, getTurn, cells, checkWin , checkTie}
        }
    })()();
    
    function createPlayer(name, symbol) {
        function makeMove(cellNum) {
            const cell = board.cells[cellNum - 1];
            if (!cell.getChecked()) {
                cell.setChecked(symbol);
                board.switchTurn();
            }
        }
        return function () {
            return {name, symbol, makeMove}
        }
    }


    const player1 = createPlayer("Player 1", "X")();
    const player2 = createPlayer("Player 2", "O")();

    document.querySelectorAll(".game-board__cell").forEach(cell => {
        cell.addEventListener("click", function () {
            const cellNum = parseInt(cell.id.replace("cell", ""));
            if (board.getTurn()) {
                player1.makeMove(cellNum);
            } else {
                player2.makeMove(cellNum);
            }
            console.log(board.checkWin())
            if (board.checkWin()) {
                console.log(`${board.getTurn() ? player2.name : player1.name} wins!`);
                board.clear();
            }
            if (board.checkTie()) {
                console.log("It's a tie!");
                board.clear();
            }
        });
    });


})