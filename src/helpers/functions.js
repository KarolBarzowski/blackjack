import React from "react";
import { ReactComponent as Avatar0 } from "assets/avatars/0.svg";
import { ReactComponent as Avatar1 } from "assets/avatars/1.svg";

export const createDeck = () => {
  const deck = [];
  const values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
  const suits = ["♠︎", "♥︎", "♣︎", "♦︎"];

  for (let i = 0; i < 6; i++) {
    values.forEach((value) => {
      suits.forEach((suit, i) => {
        deck.push({ value, suit, color: i % 2 ? "red" : "black" });
      });
    });
  }

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

export const getAvatar = (id) => {
  switch (id) {
    case 0:
      return <Avatar0 />;
    case 1:
      return <Avatar1 />;

    default:
      break;
  }
};
