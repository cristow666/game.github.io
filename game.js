const board = document.getElementById("board");
const message = document.getElementById("message");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");

let cards = [];
let selected = [];
let playerScore = 0;
let aiScore = 0;

const shapes = ["●", "■", "▲"];
const colors = ["red", "lime", "cyan"];
const numbers = [1, 2, 3];
const patterns = ["solid", "outline", "striped"];

// CREATE DECK
function createDeck() {
  let deck = [];
  for (let s of shapes)
    for (let c of colors)
      for (let n of numbers)
        for (let p of patterns)
          deck.push({ shape: s, color: c, number: n, pattern: p });
  return deck;
}

// DRAW BOARD
function drawBoard() {
  board.innerHTML = "";
  cards.forEach((card, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.color = card.color;
    div.innerText = card.shape.repeat(card.number);
    div.onclick = () => selectCard(i, div);
    board.appendChild(div);
  });
}

// SELECT CARD
function selectCard(index, div) {
  if (selected.includes(index)) {
    selected = selected.filter(i => i !== index);
    div.classList.remove("selected");
  } else if (selected.length < 3) {
    selected.push(index);
    div.classList.add("selected");
  }
}

// CHECK SET RULE
function isSet(a, b, c) {
  const props = ["shape", "color", "number", "pattern"];
  return props.every(p => {
    const vals = new Set([a[p], b[p], c[p]]);
    return vals.size === 1 || vals.size === 3;
  });
}

// PLAYER CHECK
document.getElementById("checkSet").onclick = () => {
  if (selected.length !== 3) {
    message.innerText = "Select 3 cards!";
    return;
  }

  const [a, b, c] = selected.map(i => cards[i]);
  if (isSet(a, b, c)) {
    playerScore++;
    playerScoreEl.innerText = playerScore;
    message.innerText = "✅ SET FOUND!";
    replaceCards(selected);
  } else {
    message.innerText = "❌ Not a set!";
  }
  selected = [];
  drawBoard();
};

// REPLACE CARDS
function replaceCards(indexes) {
  indexes.forEach(i => {
    cards[i] = deck.pop();
  });
}

// AI TURN
function aiPlay() {
  for (let i = 0; i < cards.length; i++)
    for (let j = i + 1; j < cards.length; j++)
      for (let k = j + 1; k < cards.length; k++) {
        if (isSet(cards[i], cards[j], cards[k])) {
          aiScore++;
          aiScoreEl.innerText = aiScore;
          message.innerText = "🤖 AI found a SET!";
          replaceCards([i, j, k]);
          drawBoard();
          return;
        }
      }
}

// START GAME
let deck = createDeck().sort(() => Math.random() - 0.5);
cards = deck.splice(0, 12);
drawBoard();

// AI every 6 seconds
setInterval(aiPlay, 6000);

#message {
  margin-top: 10px;
  font-size: 16px;
}
