const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "⭐": 2,
    "🟪": 4,
    "🟢": 6,
    "🔷": 8,
};

const SYMBOL_VALUES = {
    "⭐": 5,
    "🟪": 4,
    "🟢": 3,
    "🔷": 2,
};

const getStartingPoints = () => {
    while (true) {
        const pointsAmount = prompt("Enter the starting points: ");
        const numberPointsAmount = parseInt(pointsAmount);

        if (isNaN(numberPointsAmount) || numberPointsAmount <= 0) {
            console.log("Invalid points amount, try again. \n");
        } else {
            return numberPointsAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines to match (1-3): ");
        const numberOfLines = parseInt(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again. \n");
        } else {
            return numberOfLines;
        }
    }
};

const getInvestmentPerLine = (pointsBalance, lines) => {
    while (true) {
        const investment = prompt("Enter the points to invest per line: ");
        const numberInvestment = parseFloat(investment);

        if (isNaN(numberInvestment) || numberInvestment <= 0 || numberInvestment > pointsBalance / lines) {
            console.log("Invalid investment points, try again. \n");
        } else {
            return numberInvestment;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const calculateEarnings = (rows, investmentPerLine, lines) => {
    let earnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            earnings += investmentPerLine * SYMBOL_VALUES[symbols[0]];
        }
    }

    return earnings;
};

const game = () => {
    let pointsBalance = getStartingPoints();

    while (true) {
        const numberOfLines = getNumberOfLines();
        const investmentPerLine = getInvestmentPerLine(pointsBalance, numberOfLines);
        pointsBalance -= investmentPerLine * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const earnings = calculateEarnings(rows, investmentPerLine, numberOfLines);
        pointsBalance += earnings;
        console.log("You earned " + earnings.toString() + " points!");

        console.log("Current points: " + pointsBalance.toString() + "\n");

        if (pointsBalance <= 0) {
            console.log("No more points left!");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)? ");

        if (playAgain != "y") break;
    }
};

game();
