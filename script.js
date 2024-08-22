const words = [
    {word: 'ELEFANTE', hint: 'Animal grande con trompa'},
    {word: 'MARIPOSA', hint: 'Insecto colorido que vuela'},
    {word: 'DELFIN', hint: 'Mamífero marino inteligente'},
    {word: 'JIRAFA', hint: 'Animal con cuello largo'},
    {word: 'BOSQUE', hint: 'Lugar con muchos árboles'},
    {word: 'TORTUGA', hint: 'Reptil con caparazón'},
    {word: 'FLOR', hint: 'Parte colorida de una planta'},
    {word: 'KOALA', hint: 'Animal australiano que come eucalipto'},
    {word: 'CEBRA', hint: 'Animal con rayas blancas y negras'},
    {word: 'LAGO', hint: 'Cuerpo de agua rodeado de tierra'}
];

const hangmanParts = ['head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];
let currentWord, guessedLetters, wrongGuesses, hintUsed, playerName, playerScore;

const wordDisplay = document.getElementById('word-display');
const alphabetContainer = document.getElementById('alphabet');
const messageDisplay = document.getElementById('message');
const hintDisplay = document.getElementById('hint-display');
const newGameBtn = document.getElementById('new-word-btn');
const hintBtn = document.getElementById('hint-btn');
const scoreboardBody = document.querySelector('#scoreboard tbody');

function initGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    hintUsed = false;
    updateWordDisplay();
    updateAlphabet();
    updateMessage('');
    updateHintDisplay('');
    clearHangman();
    newGameBtn.style.display = 'none'; // Ocultar botón al iniciar
}

function updateWordDisplay() {
    const displayWord = currentWord.word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
    wordDisplay.textContent = displayWord;
    if (!displayWord.includes('_')) {
        updateMessage('¡Ganaste! Adivinaste la palabra.');
        addScore();
        newGameBtn.style.display = 'block'; // Mostrar botón al ganar
    }
}

function updateAlphabet() {
    alphabetContainer.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement('button');
        button.textContent = letter;
        button.classList.add('letter-btn');
        button.disabled = guessedLetters.includes(letter);
        button.addEventListener('click', () => handleLetterClick(letter));
        alphabetContainer.appendChild(button);
    }
}

function handleLetterClick(letter) {
    guessedLetters.push(letter);
    if (!currentWord.word.includes(letter)) {
        wrongGuesses++;
        if (wrongGuesses === hangmanParts.length) {
            updateMessage('Perdiste. La palabra era: ' + currentWord.word);
            endGame();
        } else {
            drawHangman();
        }
    }
    updateWordDisplay();
    updateAlphabet();
}

function drawHangman() {
    const part = hangmanParts[wrongGuesses - 1];
    document.getElementById(part).style.display = 'block';
}

function clearHangman() {
    hangmanParts.forEach(part => {
        document.getElementById(part).style.display = 'none';
    });
}

function addScore() {
    let score = hintUsed ? 50 : 100;
    playerScore += score;
    updateScoreboard();
}

function updateScoreboard() {
    const playerRow = Array.from(scoreboardBody.rows).find(row => row.cells[0].textContent === playerName);
    if (playerRow) {
        playerRow.cells[1].textContent = playerScore; // Actualiza la puntuación
    } else {
        const newRow = scoreboardBody.insertRow();
        newRow.insertCell(0).textContent = playerName;
        newRow.insertCell(1).textContent = playerScore;
    }
}

function updateMessage(message) {
    messageDisplay.textContent = message;
}

function updateHintDisplay(hint) {
    hintDisplay.textContent = hint;
}

function endGame() {
    hintBtn.disabled = true;
    newGameBtn.style.display = 'block';
    resetGame();
}

function resetGame() {
    playerScore = 0; // Reiniciar puntuación
    playerName = prompt("Por favor, ingresa tu nombre (diferente al anterior):");
    // Verificar que el nombre no esté ya en la tabla
    const existingPlayerRow = Array.from(scoreboardBody.rows).find(row => row.cells[0].textContent === playerName);
    while (existingPlayerRow) {
        playerName = prompt("Ese nombre ya existe. Por favor, ingresa un nombre diferente:");
    }
    initGame();
    hintBtn.disabled = false;
    newGameBtn.style.display = 'none';
    updateMessage('');
    updateHintDisplay('');
}

hintBtn.addEventListener('click', () => {
    if (!hintUsed) {
        updateHintDisplay(currentWord.hint);
        hintUsed = true;
    } else {
        updateMessage('Ya usaste la pista.');
    }
});

newGameBtn.addEventListener('click', () => {
    initGame();
    hintBtn.disabled = false;
    newGameBtn.style.display = 'none';
    updateMessage('');
    updateHintDisplay('');
});

document.getElementById('add-word-btn').addEventListener('click', () => {
    const form = document.getElementById('add-word-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('submit-word-btn').addEventListener('click', () => {
    const newWord = document.getElementById('new-word').value.trim().toUpperCase();
    const newHint = document.getElementById('new-hint').value.trim();

    if (newWord && newHint) {
        words.push({ word: newWord, hint: newHint });
        alert('Palabra agregada con éxito');
        document.getElementById('new-word').value = '';
        document.getElementById('new-hint').value = '';
        document.getElementById('add-word-form').style.display = 'none';
    } else {
        alert('Por favor, ingresa una palabra y una pista válidas.');
    }
});

// Solicitar el nombre del jugador al inicio
playerName = prompt("Por favor, ingresa tu nombre:");
playerScore = 0; // Inicializa la puntuación
initGame();
