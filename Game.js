import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAZAV3GyV2_64_8-dfTOqciZgLG98f4Efk",
    authDomain: "js-project-551d5.firebaseapp.com",
    projectId: "js-project-551d5",
    storageBucket: "js-project-551d5.firebasestorage.app",
    messagingSenderId: "238206019067",
    appId: "1:238206019067:web:cb23d8febe4e62165dd75e",
    measurementId: "G-QZ5JY8FFMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// RECHECK : Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        document.getElementById("navbar").style.display = "none";
        document.getElementById("gameContainer").style.display = "none";
        Swal.fire({
            title: "Login Required!",
            text: "Please log in to play the game.",
            icon: "warning",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = "index.html";
        });
    } else {
        fetchScores(user.uid);
    }
});

// RECHECK : Logout Button Event Listener
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        await signOut(auth);
        Swal.fire({
            title: "Login Required!",
            text: "Please log in to play the game.",
            icon: "warning",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = "index.html";
        });
    } catch (error) {
        console.error("Error logging out:", error);
    }
});

// Game Logic
let attempts = 0;
let matches = 0;
let timer = 0;
let interval;
let gamePaused = false;

const attemptsText = document.getElementById("attempts");
const matchesText = document.getElementById("matches");
const timeText = document.getElementById("time");
const highScoreText = document.getElementById("highScore");
const previousScoresText = document.getElementById("previousScores");
const pauseGameButton = document.getElementById("pauseGame");
const resetGameButton = document.getElementById("resetGame");
const gameBoard = document.querySelector(".game-board");

let cards = [
    "🐶", "🐶", "🐱", "🐱", "🦊", "🦊", "🐸", "🐸",
    "🐵", "🐵", "🐼", "🐼", "🐯", "🐯", "🦁", "🦁",
    "🐰", "🐰", "🐨", "🐨"
];
let shuffledCards = shuffleArray(cards);
let flippedCards = [];

// RECHECK : Shuffle Array Function
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// RECHECK : Create Board Function
function createBoard() {
    gameBoard.innerHTML = "";
    shuffledCards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-emoji", emoji);
        card.setAttribute("data-index", index);
        card.innerHTML = "?";
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
    resetTimer();
}

// RECHECK : Flip Card Function
function flipCard(event) {
    if (gamePaused) return;
    const clickedCard = event.target;
    if (flippedCards.length < 2 && !clickedCard.classList.contains("flipped")) {
        clickedCard.innerHTML = clickedCard.getAttribute("data-emoji");
        clickedCard.classList.add("flipped");
        flippedCards.push(clickedCard);
    }
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

// RECHECK : Check Match Function
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.getAttribute("data-emoji") === card2.getAttribute("data-emoji")) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matches++;
        matchesText.textContent = `Matches: ${matches}`;
    } else {
        card1.innerHTML = "?";
        card2.innerHTML = "?";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
    }
    flippedCards = [];
    attempts++;
    attemptsText.textContent = `Attempts: ${attempts}`;
    checkWin();
}

// RECHECK : Store score in Firestore
async function storeScore(userId) {
    await addDoc(collection(db, "scores"), {
        userId,
        attempts,
        timestamp: new Date()
    });
}

// RECHECK : Fetch last three scores from Firestore
async function fetchScores(userId) {
    try {
        const q = query(
            collection(db, "scores"),
            orderBy("timestamp", "desc"),
            limit(3)
        );

        // Filter scores to only show scores for the logged-in user
        const querySnapshot = await getDocs(q);

        let scoresHtml = "<strong>Last Scores:</strong><br>";
        let count = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId && count < 3) {  // Check if score belongs to the logged-in user
                scoresHtml += `🕹️ Attempts: ${data.attempts} <br>`;
                count++;
            }
        });

        if (count === 0) {
            scoresHtml = "<p>No previous scores found.</p>";
        }

        previousScoresText.innerHTML = scoresHtml;

    } catch (error) {
        console.error("Error fetching scores:", error);
        previousScoresText.innerHTML = "<p>Error loading scores.</p>";
    }
}


// RECHECK : Check Win Condition
function checkWin() {
    if (document.querySelectorAll(".matched").length === cards.length) {
        clearInterval(interval);
        storeScore(auth.currentUser.uid);
        setTimeout(() => Swal.fire("Congratulations! You won!"), 300);
    }
}

// RECHECK : Reset Timer Function
function resetTimer() {
    clearInterval(interval);
    timer = 0;
    timeText.textContent = `Time: ${timer}`;
    interval = setInterval(() => {
        timer++;
        timeText.textContent = `Time: ${timer}`;
    }, 1000);
}

// RECHECK : Pause Button Event Listener
pauseGameButton.addEventListener("click", () => {
    if (!gamePaused) {
        clearInterval(interval);
        pauseGameButton.textContent = "Resume Game";
    } else {
        interval = setInterval(() => {
            timer++;
            timeText.textContent = `Time: ${timer}`;
        }, 1000);
        pauseGameButton.textContent = "Pause Game";
    }
    gamePaused = !gamePaused;
});

// RECHECK : Reset Button Event Listener
resetGameButton.addEventListener("click", () => {
    clearInterval(interval);

    attempts = 0;
    matches = 0;
    timer = 0;
    gamePaused = false;

    attemptsText.textContent = "Attempts: 0";
    matchesText.textContent = "Matches: 0";
    timeText.textContent = "Time: 0";
    pauseGameButton.textContent = "Pause Game";

    shuffledCards = shuffleArray(cards);
    createBoard();
});


createBoard();