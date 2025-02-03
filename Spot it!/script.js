// Function to generate the deck
function generateSpotItDeck(n) {
    const numSymbols = n ** 2 + n + 1;
    const symbols = Array.from({ length: numSymbols }, (_, i) => i);
    const deck = [];

    // Use finite projective plane construction to ensure no duplicates in cards and one common symbol between any two cards
    // First card is a reference card to generate the rest
    for (let i = 0; i < n + 1; i++) {
        const card = [];
        card.push(0); // Add a common symbol for all cards
        for (let j = 0; j < n; j++) {
            card.push(i * n + j + 1);
        }
        deck.push(card);
    }

    // Generate the remaining cards
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const card = [];
            card.push(i + 1); // Add a common symbol for this set of cards
            for (let k = 0; k < n; k++) {
                card.push(n + 1 + k * n + (k * i + j) % n);
            }
            deck.push(card);
        }
    }

    // Ensure no duplicates in each card and exactly one common symbol between any two cards
    deck.forEach(card => {
        const uniqueSymbols = new Set(card);
        if (uniqueSymbols.size !== card.length) {
            console.error("Duplicate symbols found in card:", card);
        }
    });

    return deck;
}

// Extended array of symbols, letters, and digits
const miscellaneousSymbols = '★☺✈☂☕♫⚽❄☀☁☘☮☯✨⚡⚔⚖⚙⌛⏳♛♜♝♞♟♠♣♥♦♭♮⚕⚘⚚⚛⚗⚜⚒⚓⛅⛄∆∏∑αβγδεζηθικλμνξ'.split('');
const letters = 'ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZabcçdefghijklmnñopqrstuvwxyz'.split('');
const digits = '0123456789'.split('');

let availableCharacters = [];

// Function to get user preference
function getUserPreference() {
    const preferenceType = prompt("Choose your preference type: Symbols, Letters, or Numbers", "Symbols");

    if (preferenceType === 'Symbols') {
        availableCharacters = miscellaneousSymbols;
    } else if (preferenceType === 'Letters') {
        availableCharacters = letters;
    } else if (preferenceType === 'Numbers') {
        availableCharacters = digits;
    }

    let maxOrder;
    if (preferenceType === 'Symbols') {
        maxOrder = 7; // Miscellaneous symbols
    } else if (preferenceType === 'Letters') {
        maxOrder = 7; // Uppercase or lowercase letters
    } else if (preferenceType === 'Numbers') {
        maxOrder = 4; // Digits (for 10 unique digits)
    }

    let order;
    while (true) {
        order = parseInt(prompt(`Enter the order (between 2 and ${maxOrder}):`), 10);
        if (!isNaN(order) && order >= 2 && order <= maxOrder) {
            break;
        } else {
            alert(`Invalid input. Please enter a number between 2 and ${maxOrder}.`);
        }
    }

    return { preferenceType, order };
}

// Function to render the cards
function renderCard(cardSymbols, containerId) {
    const container = document.getElementById(containerId);
    const frameDiv = document.createElement('div');
    frameDiv.className = 'card-frame';
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    cardSymbols.forEach(symbol => {
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';

        symbolDiv.textContent = availableCharacters[symbol];

        symbolDiv.addEventListener('click', () => handleSymbolClick(symbol, symbolDiv));
        cardDiv.appendChild(symbolDiv);
    });

    frameDiv.appendChild(cardDiv);
    container.appendChild(frameDiv);
}

// Function to display a new set of two cards
function displayNewCards(preferenceType) {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = ''; // Clear previous cards

    const randomIndices = [];
    while (randomIndices.length < 2) {
        const index = Math.floor(Math.random() * deck.length);
        if (!randomIndices.includes(index)) randomIndices.push(index);
    }

    renderCard(deck[randomIndices[0]], 'game-container');
    renderCard(deck[randomIndices[1]], 'game-container');
}

// Sound for correct and incorrect answers
const correctSound = new Audio('correct.mp3'); // Place the correct sound file in the same directory
const incorrectSound = new Audio('incorrect.mp3'); // Place the incorrect sound file in the same directory

let selectedSymbols = [];
let correctCount = 0;
let timer;

function handleSymbolClick(symbol, symbolDiv) {
    selectedSymbols.push({ symbol, symbolDiv });
    symbolDiv.style.backgroundColor = 'yellow'; // Highlight the clicked symbol

    if (selectedSymbols.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [{ symbol: symbol1, symbolDiv: div1 }, { symbol: symbol2, symbolDiv: div2 }] = selectedSymbols;
    if (symbol1 === symbol2) {
        correctCount++;
        correctSound.play();
        div1.style.backgroundColor = 'green';
        div2.style.backgroundColor = 'green';
        document.getElementById('correct-counter').textContent = `Correct: ${correctCount}`;
    } else {
        incorrectSound.play();
        div1.style.backgroundColor = 'red';
        div2.style.backgroundColor = 'red';
    }
    selectedSymbols = [];
    setTimeout(() => {
        displayNewCards(userPreference.preferenceType);
    }, 1000);
}

// Start the game timer
function startTimer() {
    let timeLeft = 60; // 1 minute
    const timerElement = document.getElementById('timer');
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`Time's up! You correctly matched ${correctCount} pairs.`);
        } else {
            timerElement.textContent = `Time Left: ${timeLeft}s`;
            timeLeft--;
        }
    }, 1000);
}

// Main function to initiate the game
function initializeGame() {
    // Ensure only one correct counter exists
    const correctCounter = document.getElementById('correct-counter');
    correctCounter.textContent = 'Correct: 0';
}

// Initialize the game
const userPreference = getUserPreference(); // Get user preference and order
const deck = generateSpotItDeck(userPreference.order); // Generate the deck based on the user's order
initializeGame();
displayNewCards(userPreference.preferenceType); // Render the initial set of two cards with user preference
startTimer(); // Start the 1-minute timer
