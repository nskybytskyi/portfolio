"use strict";

const enWords = ["water", "milk", "bread", "cheese", "meat", "fish", "sugar", "honey"];
const ukWords = ["вода", "молоко", "хліб", "сир", "м'ясо", "риба", "цукор", "мед"];
const enUkPairs = enWords.map((enWord, index) => [enWord, ukWords[index]]);
const ukEnPairs = ukWords.map((ukWord, index) => [ukWord, enWords[index]]);
const pairs = [...enUkPairs, ...ukEnPairs];

const cards = pairs.map((pair) => buildCard(pair[0], pair[1]));
shuffleArray(cards);

const board = document.getElementById("board");
cards.forEach(card => { board.appendChild(card); });

const game = {
    lock: false,
    activeCard: null,
    visitedCount: 0,
    moveCounter: document.getElementById("move-counter"),
};

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function buildCard(word, translation) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-word", word);
    card.setAttribute("data-translation", translation);
    card.addEventListener("click", clickCard);
    return card;
}

function activateCard(card) {
    card.innerText = card.getAttribute("data-word");
}

function deactivateCard(card) {
    card.innerText = "";
}

function disableCard(card) {
    card.removeEventListener("click", clickCard);
}

function clickCard() {
    if (game.lock || this === game.activeCard) return;

    if (!game.activeCard) {
        game.moveCounter.innerText = parseInt(game.moveCounter.innerText) + 1;
        game.activeCard = this;
        activateCard(this);
        return;
    }

    activateCard(this);

    if (game.activeCard.getAttribute("data-translation") == this.getAttribute("data-word")) {
        disableCard(this);
        disableCard(game.activeCard);
        game.activeCard = null;
        game.visitedCount += 2;
        if (game.visitedCount == cards.length) {
            winGame();
        }
    } else {
        game.lock = true;
        setTimeout(() => {
            deactivateCard(this);
            deactivateCard(game.activeCard);
            game.activeCard = null;
            game.lock = false;
        }, 1000);
    }
}

function winGame() {
    game.lock = true;
    setTimeout(() => {
        alert("You won! Refresh the page to play again");
        game.lock = false;
    }, 100);
}
