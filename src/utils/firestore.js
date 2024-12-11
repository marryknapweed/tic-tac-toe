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
  deleteDoc,
} from "firebase/firestore";
import generateRoomId from "./generateRoomId";

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
  // Remove the "+" character from the phone number
  const cleanedNumber = phoneNumber.replace("+", "");
  
  // Reference to the users collection
  const usersCollection = collection(db, "users");
  
  // Create a query to find the user with the cleaned phone number
  const phoneFilter = query(
    usersCollection,
    where("phone", "==", cleanedNumber)
  );

  // Execute the query
  const queryQS = await getDocs(phoneFilter);

  // Check if any documents were found
  if (queryQS.docs.length > 0) {
    // Map the documents to extract the desired data
    const data = queryQS.docs.map(doc => ({
      id: doc.id,
      role: doc.data().role, // Use doc.data() to access the document data
      username: doc.data().username // Use doc.data() to access the document data
    }));
    return data; // Return the array of user data
  } else {
    return false; // Return false if no user was found
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
export async function fetchGameHistory(specifiedUser  = undefined) {

  const gamesCollection = collection(db, "games_history")
  const userFilter = query(
    gamesCollection,
    where("user_id", "==", specifiedUser),
  );

  try {
    const querySnapshot = specifiedUser ? await getDocs(userFilter) : await getDocs(gamesCollection);
    const gamesData = querySnapshot.docs .map(doc => ({
      id: doc.id,
      opponent: doc.data().opponent,
      wins: doc.data().wins,
      user_id: doc.data().user_id,
      username: doc.data().username,
      date: doc.data().date.seconds // Extracting only the seconds directly
  }));
    
    console.log(gamesData);
    return gamesData;
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
  } catch (error) {
    console.error("Error adding registered user: ", error);
  }
}

export async function roomActions() {
  async function createRoom(username) {
      const dataTemplate = {
          messages: {},
          squares: [],
          player1: username, // host
          p1_role: 'x',
          player2: '',
          p2_role: 'o',
          roomId: generateRoomId()
      };
      
      try {
          const usersCollection = collection(db, "online_rooms");
          const querySnapshot = await addDoc(usersCollection, dataTemplate);
          return dataTemplate.roomId
      } catch (error) {
          console.error("Error adding registered user: ", error);
      }
  }

  async function deleteRoom(id) {
    try {
        const usersCollection = collection(db, "online_rooms");
        const roomFilter = query(usersCollection, where("roomId", "==", id));
        
        // Get the documents that match the query
        const querySnapshot = await getDocs(roomFilter);
        
        // Check if any documents were found
        if (!querySnapshot.empty) {
            // Loop through the documents and delete them
            querySnapshot.forEach(async (docSnapshot) => {
                await deleteDoc(docSnapshot.ref);
                console.log("Room deleted with ID: ", id);
            });
        } else {
            console.log("No room found with ID: ", id);
        }
    } catch (error) {
        console.error("Error deleting room: ", error);
    }
} 

async function connectRoom(id, username) {
  try {
      const usersCollection = collection(db, "online_rooms");
      const roomFilter = query(usersCollection, where("roomId", "==", id));
      
      // Get the documents that match the query
      const querySnapshot = await getDocs(roomFilter);
      
      // Check if any documents were found
      if (!querySnapshot.empty) {
          // Loop through the documents and update player2
          querySnapshot.forEach(async (docSnapshot) => {
              const roomDocRef = docSnapshot.ref; // Get the document reference
              await updateDoc(roomDocRef, { player2: username }); // Update player2 with the username
              console.log("Connected to room with ID: ", id);
          });
      } else {
          console.log("No room found with ID: ", id);
      }
  } catch (error) {
      console.error("Error connecting to room: ", error);
  }
}

  return { createRoom, deleteRoom, connectRoom };
}

// Example usage test rooms functionality
// (async () => {
//   const actions = await roomActions();
//   const roomId = await actions.createRoom('marry123'); // Get the roomId
//   setTimeout(() => {
//     actions.connectRoom(roomId, 'testuser'); // Use the roomId in deleteRoom
// }, 5000);
//   setTimeout(() => {
//       actions.deleteRoom(roomId); // Use the roomId in deleteRoom
//   }, 10000);
// })();


export async function trackUsersActions(roomId) {
  
}