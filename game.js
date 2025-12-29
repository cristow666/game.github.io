const board = document.getElementById("board");
const msg = document.getElementById("message");
const pScore = document.getElementById("playerScore");
const aScore = document.getElementById("aiScore");

let selected = [];
let player = 0;
let ai = 0;

const shapes = ["●", "■", "▲"];
const colors = ["red", "lime", "cyan"];
const numbers = [1, 2, 3];

let deck = [];
let cards = [];

// CREATE DECK
function createDeck() {
  deck = [];
  for (let s of shapes)
    for (let c of colors)
      for (let n of numbers)
        deck.push({ s, c, n });

  deck.sort(() => Math.random() - 0.5);
}

// DRAW CARDS
function draw() {
  board.innerHTML = "";
  selected = [];

  cards.forEach((card, i) => {
    const d = document.createElement("div");
    d.className = "card";
    d.style.color = card.c;
    d.textContent = card.s.repeat(card.n);
    d.onclick = () => toggle(i, d);
    board.appendChild(d);
  });
}

// SELECT
function toggle(i, div) {
  if (selected.includes(i)) {
    selected = selected.filter(x => x !== i);
    div.classList.remove("selected");
  } else if (selected.length < 3) {
    selected.push(i);
    div.classList.add("selected");
  }
}

// SET RULE
function isSet(a, b, c) {
  const props = ["s", "c", "n"];
  return props.every(p => {
    const v = new Set([a[p], b[p], c[p]]);
    return v.size === 1 || v.size === 3;
  });
}

// PLAYER CHECK
document.getElementById("checkSet").onclick = () => {
  if (selected.length !== 3) {
    msg.textContent = "Pick 3 cards";
    return;
  }

  const [a, b, c] = selected.map(i => cards[i]);

  if (isSet(a, b, c)) {
    player++;
    pScore.textContent = player;
    msg.textContent = "✅ YOU FOUND A SET";

    selected.sort((a, b) => b - a).forEach(i => {
      cards.splice(i, 1);
      if (deck.length) cards.push(deck.pop());
    });
  } else {
    msg.textContent = "❌ NOT A SET";
  }

  draw();
};

// AI MOVE (SAFE)
function aiMove() {
  for (let i = 0; i < cards.length; i++)
    for (let j = i + 1; j < cards.length; j++)
      for (let k = j + 1; k < cards.length; k++) {
        if (isSet(cards[i], cards[j], cards[k])) {
          ai++;
          aScore.textContent = ai;
          msg.textContent = "🤖 AI FOUND A SET";

          [k, j, i].forEach(x => {
            cards.splice(x, 1);
            if (deck.length) cards.push(deck.pop());
          });

          draw();
          return;
        }
      }
}

// START
createDeck();
cards = deck.splice(0, 12);
draw();
setInterval(aiMove, 7000);
