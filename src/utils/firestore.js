import { db } from "../firebase/firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  query,
  where,
  get,
  addDoc,
} from "firebase/firestore";

// // Сохранение статистики пользователя
export async function saveUserStats(id, stats) {
  const userRef = doc(db, "users", id);
  const docUpdate = await updateDoc(userRef, {stats})
}

// Получение статистики конкретного пользователя
export async function getUserStats(id) {
  const userRef = doc(db, "users", id);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data().stats || { wins: 0, losses: 0, draws: 0 };
  }
  return { wins: 0, losses: 0, draws: 0 };
}

// // Получение всех пользователей для таблицы лидеров
export async function getAllUsers() {
  const usersCollection = collection(db, "users");
  const querySnapshot = await getDocs(usersCollection);
  return querySnapshot.docs.map(doc => ({
    username: doc.data().username,
    id: doc.id,
    stats: doc.data().stats || { wins: 0, losses: 0, draws: 0 },
  }));
}

export async function isNumberExistsInDB(phoneNumber) {
  const usersCollection = collection(db, "users");
  const phoneFilter = query(
    usersCollection,
    where("phone", "==", parseInt(phoneNumber))
  );

  const queryQS = await getDocs(phoneFilter);

  if (queryQS.docs.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Аутентификация пользователя
export async function authenticateUser(username, password) {
  const usersCollection = collection(db, "users");
  const userFilter = query(
    usersCollection,
    where("username", "==", username),
    where("password", "==", password)
  );

  const queryQS = await getDocs(userFilter);

  if (queryQS.docs.length > 0) {
    const id = queryQS.docs[0].id
    const role = queryQS.docs[0].data().role
    return {id, role}
  } else {
    return false;
  }
}

// Сохранение результатов игры
// export async function saveGameResult(id, gameData) {
//   const userRef = doc(db, "users", id);
//   const gamesCollection = collection(userRef, "games");

//   await addDoc(gamesCollection, gameData);
// }

// Получение истории игр пользователя
export async function fetchGameHistory(specifiedUser = undefined) {
  let userRef;
  if (specifiedUser != undefined) {
    userRef = doc(db, "games_history");
  } else {
    userRef = doc(db, "games_history", specifiedUser);
  }
  const gamesCollection = collection(userRef, "games_history");

  try {
    const querySnapshot = await getDocs(gamesCollection).docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(querySnapshot)
    return querySnapshot
  } catch (error) {
    console.error("Error fetching game history: ", error);
    return [];
  }
}

export async function appendGameHistory(data) {
  const gamesCollection = collection(db, "games_history"); // Reference to the "games" collection

  try {
    // Add a new document to the "games" collection
    const docRef = await addDoc(gamesCollection, data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Optionally return the ID of the newly added document
  } catch (error) {
    console.error("Error appending game history: ", error);
    return null; // Return null or handle the error as needed
  }
}

export async function addRegisteredUser(username, password, phone) {
  const defaults = {
    wins: 0,
    losses: 0,
    draws: 0,
  };
  const combinedData = {
    username,
    password,
    phone,
    role: "user",
    stats: defaults,
    games: [],
  };

  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await addDoc(usersCollection, combinedData);
    console.log("====================================");
    console.log(querySnapshot);
    console.log("====================================");
  } catch (error) {
    console.error("Error adding registered user: ", error);
  }
}
