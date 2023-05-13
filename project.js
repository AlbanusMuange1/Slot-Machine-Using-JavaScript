// Spin Bet Machine
const prompt = require("prompt-sync")();

const ROWS = 5;
const COLS = 5;

const SYMBOLS_COUNT = {
    Z : 10,
    Y : 10,
    X : 10,
    W : 10,
    V : 15
}

const SYMBOLS_VALUES = {
    Z : 5,
    Y : 4,
    X : 3,
    W : 2,
    V : 1,
}


// 1. Deposit some money
const deposit = () =>{

    while(true){
        const depositAmount = prompt("Enter a deposit amount. Minimum is $20: $");
        const numberDepositAmount = parseFloat(depositAmount);
        
        if(isNaN(numberDepositAmount) || numberDepositAmount < 20){
            console.log("You entered invalid deposit amount. Try again.");
        }
        else{
         return numberDepositAmount; 
        }
    }
};

// 2. Determine number of lines to bet on 

const getNumberOfLines = () =>{

    while(true){
        const lines = prompt("Enter number of lines to bet on. (1-5): ");
        let numberOfLines = parseFloat(lines);
        
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 5){
            console.log("Invalid number of lines. Try again.");
        }
        else{
         return numberOfLines; 
        }
    }
}

// 3. Collect a bet amount
const getBet = (balance, lines) =>{

    while(true){
        const bet = prompt("Enter the amount to bet on per line. Minimun $5: $");
        let numberBet = parseFloat(bet);
        
        if(isNaN(numberBet) || numberBet < 5 || numberBet > balance / lines){
            console.log("Invalid bet amount. Try again.");
        }
        else{
         return numberBet; 
        }
    }
}
// 4. Spin the slot machine
const spin = () => {
    const symbols = [];
    for( const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let a = 0; a < COLS; a++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let b = 0; b < ROWS; b++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[a].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

// Transposing the arrays
const transpose = (reels) =>{
    const rows = [];
    for(let x = 0; x < ROWS; x++){
        rows.push([]);
        for(let y = 0; y < COLS; y++){
            rows[x].push(reels[y][x])
        }
    }
    return rows
};

// Printing out the rows
const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}
// 5. Check if the user won and give the user their win
const getWinnings = (rows, bet, lines) =>{
    let winnings = 0;
    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame){
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }

    return winnings;
}
// 7. Play again

const game = () => {
    let balance = deposit();
    console.log(`Deposit of $ ${balance} was successful.`);
    while (true){ 
        console.log("You have a balance of $" + balance)
        const numberOfLines = getNumberOfLines();
        console.log(`You will bet on ${numberOfLines} lines`);
        const bet = getBet(balance, numberOfLines);
        console.log(`You have placed bet of $ ${bet} for each of your ${numberOfLines} lines. The total bet amount is ${bet*numberOfLines}`);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings
        console.log(`You won, $ ${winnings}`);
        if (balance <= 0) {
            console.log("You ran out of money!. Deposit again");
            break;
        }
        const playAgain = prompt("Do you want to play again? (Y/N)")
        if(playAgain != "Y"){
            console.log("Successfully exited");
            break;
        }
    }
};

game()