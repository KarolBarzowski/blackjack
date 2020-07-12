export const createDeck = () => {
  const deck = [];
  const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  const suits = ["♠︎", "♥︎", "♣︎", "♦︎"];

  values.forEach((value) => {
    suits.forEach((suit, i) => {
      deck.push({ value, suit, color: i % 2 ? "red" : "black" });
    });
  });

  return deck;
};

export const shuffleDeck = (cards) => {
  for (let i = 0; i < cards.length; i++) {
    const rnd = (Math.random() * i) | 0;
    const tmp = cards[i];

    cards[i] = cards[rnd];
    cards[rnd] = tmp;
  }

  return cards;
};

export const deal = (deck) => {
  if (!deck.length) {
    const newDeck = shuffleDeck(createDeck());
    return deal(newDeck);
  }

  const card = deck.pop();

  return card;
};

export const getCardValue = (value, score) => {
  if (value === "A") {
    score += score + 11 > 21 ? 1 : 11;
  } else if (typeof value === "string") {
    score += 10;
  } else {
    score += value;
  }

  return score;
};
