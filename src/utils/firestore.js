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
  onSnapshot
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
export async function authenticateUser (username, password) {
  const usersCollection = collection(db, "users");
  const userFilter = query(
    usersCollection,
    where("username", "==", username),
    where("password", "==", password),
    where("isAuthenticated", "==", false)
  );

  const queryQS = await getDocs(userFilter);

  if (queryQS.docs.length > 0) {
    const userDoc = queryQS.docs[0];
    const id = userDoc.id;
    const role = userDoc.data().role;

    // Update the isAuthenticated field to true
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { isAuthenticated: true });

    return { id, role };
  } else {
    return false;
  }
}

export async function deAuthenticateUser () {
  const id = localStorage.getItem("id");
  
  if (!id) {
    console.error("User  ID not found in local storage.");
    return false; // Return false if no user ID is found
  }

  const userRef = doc(db, "users", id); // Reference to the user document

  try {
    // Update the isAuthenticated field to false
    await updateDoc(userRef, { isAuthenticated: false });
    return true; // Return true if the operation was successful
  } catch (error) {
    console.error("Error de-authenticating user: ", error);
    return false; // Return false if there was an error
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
      type: doc.data().type,
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
    const emptyArr = Array(9).fill(null)
      const dataTemplate = {
          messages: [],
          squares: emptyArr,
          player1: username, // host
          player2: '',
          turn: 'p1',
          roomId: generateRoomId(),
          isStarted: false,
          isPlayerLeaved: {status: false, byUsername: ''},
          isPlayerDisconnected: {status: false, byUsername: ''},
          isTabHidden: {status: false, byUsername: ''}
      };
      
      try {
          const usersCollection = collection(db, "online_rooms");
          const querySnapshot = await addDoc(usersCollection, dataTemplate);
          return {roomId: dataTemplate.roomId, docId: querySnapshot.id}
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
          let roomData = null; // Initialize a variable to hold room data
          for (const docSnapshot of querySnapshot.docs) {
              const roomDocRef = docSnapshot.ref; // Get the document reference
              await updateDoc(roomDocRef, { player2: username }); // Update player2 with the username
              
              // Get the updated room data
              roomData = { id: docSnapshot.id, ...docSnapshot.data(), player2: username };
              console.log("Connected to room with ID: ", id);
          }
          return roomData; // Return the room data
      } else {
          console.log("No room found with ID:", id);
          return null; // Return null if no room is found
      }
  } catch (error) {
      console.error("Error connecting to room: ", error);
      throw error; // Optionally rethrow the error for further handling
  }
}

const getRoomData = async (id) => {
  try {
    const q = query(collection(db, "online_rooms"), where("roomId", "==", id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      return querySnapshot.docs[0].data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting room data: ", error);
    return null;
  }
};

const updateRoomSquares = async (id, squaresData) => {
  try {
    // Create a query to find the document with the specified roomId
    const q = query(collection(db, "online_rooms"), where("roomId", "==", id));
    
    // Get the documents that match the query
    const querySnapshot = await getDocs(q);
    
    // Check if any documents were found
    if (!querySnapshot.empty) {
      // Get the first document (assuming roomId is unique)
      const docRef = querySnapshot.docs[0].ref; // Get the document reference
      
      // Update the squares field
      await updateDoc(docRef, {
        squares: squaresData // Update the squares field with the new data
      });
      
      console.log("Squares updated successfully");
    } else {
      console.error("No document found with the specified roomId");
    }
  } catch (error) {
    console.error("Error updating room squares: ", error);
    return null;
  }
};

const updatePlayerTurn = async (id, currentrole) => {
  try {
    // Create a query to find the document with the specified roomId
    const q = query(collection(db, "online_rooms"), where("roomId", "==", id));
    
    // Get the documents that match the query
    const querySnapshot = await getDocs(q);
    
    // Check if any documents were found
    if (!querySnapshot.empty) {
      // Get the first document (assuming roomId is unique)
      const docRef = querySnapshot.docs[0].ref; // Get the document reference
      
      // Update the squares field
      await updateDoc(docRef, {
        turn: currentrole === "p1" ? "p2" : "p1" // Update the squares field with the new data
      });
      
      console.log("Squares updated successfully");
    } else {
      console.error("No document found with the specified roomId");
    }
  } catch (error) {
    console.error("Error updating room squares: ", error);
    return null;
  }
};

const updateLobbyMessages = async (id, message) => {
  try {
    // Create a query to find the document with the specified roomId
    const q = query(collection(db, "online_rooms"), where("roomId", "==", id));
    
    // Get the documents that match the query
    const querySnapshot = await getDocs(q);
    
    // Check if any documents were found
    if (!querySnapshot.empty) {
      // Get the first document (assuming roomId is unique)
      const docRef = querySnapshot.docs[0].ref; // Get the document reference
      const currentDocData = querySnapshot.docs[0].data()
      const currentMessages = currentDocData.messages || {}
      const messageData = {username: localStorage.getItem("username"), timestamp: Date.now(), content: message}
      const updated_MessagesData = [
        ...currentMessages, messageData
      ]
      
      // Update the squares field
      await updateDoc(docRef, {
        messages: updated_MessagesData // Update the squares field with the new data
      });
      
      console.log("Squares updated successfully");
    } else {
      console.error("No document found with the specified roomId");
    }
  } catch (error) {
    console.error("Error updating room squares: ", error);
    return null;
  }
};

  return { createRoom, deleteRoom, connectRoom, getRoomData, updateRoomSquares, updatePlayerTurn, updateLobbyMessages};
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


export async function trackUsersActions() {
  const trackDocument = async (roomId, field, updateState, isReqToFind = false) => {
    let roomRef;

    if (isReqToFind) {
        const coll = collection(db, "online_rooms");
        const q = query(coll, where("roomId", "==", roomId.toString()));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Document exists, proceed to update the first matching document
                const docRef = querySnapshot.docs[0].ref; // Get the reference of the first matching document
                roomRef = doc(db, "online_rooms", docRef.id);
            } else {
                console.log("No such document with the specified roomId!");
                return null; // Return null or handle the case as needed
            }
        } catch (error) {
            console.error("Error finding document: ", error);
            return null; // Return null or handle the error as needed
        }
    } else {
        roomRef = doc(db, "online_rooms", roomId);
    }

    const unsubscribe = onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
            const result = doc.data();
            if (result) {
                updateState(result[field]);
            }
        } else {
          console.log("No such document!");
          return null
        }
    }, (error) => {
        console.error("Error listening to document: ", error);
        return null
    });

    return unsubscribe; // Return the unsubscribe function
};

  const updateDocument = async (roomId, field, value, isReqToFind = false) => {
    let roomRef;
    if (isReqToFind) {
      const coll = collection(db, "online_rooms");
      const q = query(coll, where("roomId", "==", roomId.toString()));
      try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
              // Document exists, proceed to update the first matching document
              const docRef = querySnapshot.docs[0].ref; // Get the reference of the first matching document
              roomRef = doc(db, "online_rooms", docRef.id);
          } else {
              console.log("No such document with the specified roomId!");
              return null; // Return null or handle the case as needed
          }
      } catch (error) {
          console.error("Error finding document: ", error);
          return null; // Return null or handle the error as needed
      }
  } else {
      roomRef = doc(db, "online_rooms", roomId);
  }
  try {
    await updateDoc(roomRef, { [field]: value });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

  return {
    awaitForConnect: (roomId, updateState) => trackDocument(roomId, "player2", updateState),
    awaitForMessages: (roomId, updateState, bool) => trackDocument(roomId, "messages", updateState, bool),
    checkForSquares: (roomId, updateState, bool) => trackDocument(roomId, "squares", updateState, bool),
    checkForPlayerTurn: (roomId, updateState, bool) => trackDocument(roomId, "turn", updateState, bool),
    awaitForGameStart: (roomId, updateState, isReqToFind) => trackDocument(roomId, "isStarted", updateState, isReqToFind),
    startGame: async (roomId) => updateDocument(roomId, "isStarted", true),
    hideTabSet: async (roomId, value, isReqToFind) => updateDocument(roomId, "isTabHidden", value, isReqToFind),
    setPlayerLeave: async (roomId, value, isReqToFind) => updateDocument(roomId, "isPlayerLeaved", value, isReqToFind),
    getPlayerLeaveStatus: (roomId, updateState, bool) => trackDocument(roomId, "isPlayerLeaved", updateState, bool),
    getHiddenTabStatus: (roomId, updateState, bool) => trackDocument(roomId, "isTabHidden", updateState, bool),
    setDisconnected: async (roomId, value, isReqToFind) => updateDocument(roomId, "isPlayerDisconnected", value, isReqToFind),
    getIfDisconnected: (roomId, updateState, bool) => trackDocument(roomId, "isPlayerDisconnected", updateState, bool),
  };
}

// async function clearCollection(collectionName) {
//   const collectionRef = collection(db, collectionName);
//   const querySnapshot = await getDocs(collectionRef);

//   const deletePromises = [];
//   querySnapshot.forEach((doc) => {
//       // Push the delete promise to the array
//       deletePromises.push(deleteDoc(doc.ref));
//   });

//   // Wait for all delete operations to complete
//   await Promise.all(deletePromises);
//   console.log(`Collection ${collectionName} cleared successfully.`);
// }

// // Usage
// clearCollection("games_history")
//   .then(() => console.log("Collection cleared"))
//   .catch((error) => console.error("Error clearing collection: ", error));