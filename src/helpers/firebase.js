import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6jZZDbHpgQlO_mDJL2jWBduM4HLDY3d0",
  authDomain: "blackjack-1ab41.firebaseapp.com",
  databaseURL: "https://blackjack-1ab41.firebaseio.com",
  projectId: "blackjack-1ab41",
  storageBucket: "blackjack-1ab41.appspot.com",
  messagingSenderId: "806711457765",
  appId: "1:806711457765:web:b8f4fc7efce5265c64e10c",
  measurementId: "G-6CKQ8R6Z46",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.firestore();
export const session = firebase.auth.Auth.Persistence.SESSION;
