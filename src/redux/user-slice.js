// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getUserStats, saveUserStats } from "../utils/firestore";

// const initialState = {
//   username: null,
//   id: null,
//   stats: { wins: 0, losses: 0, draws: 0 },
// };

// // Create an async thunk for fetching user stats
// export const fetchUserStats = createAsyncThunk(
//   "user/fetchUserStats",
//   async userId => {
//     const stats = await getUserStats(userId);
//     return stats;
//   }
// );

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     login(state, action) {
//       state.username = action.payload.username;
//       state.id = action.payload.id;
//     },

//     updateStats(state, action) {
//       const { result } = action.payload;
//       state.stats[result]++;
//       console.log("Updated stats:", state.stats); // Логируем
//       saveUserStats(state.id, state.stats);
//     },

//     logout(state) {
//       state.username = null;
//       state.id = null;
//     },
//   },
//   extraReducers: builder => {
//     builder.addCase(fetchUserStats.fulfilled, (state, action) => {
//       console.log("Fetched stats:", action.payload); // Логируем
//       if (action.payload) {
//         state.stats = action.payload;
//       } else {
//         state.stats = { wins: 0, losses: 0, draws: 0 }; // Если данных нет
//       }
//     });
//   },
// });

// export const { login, logout, updateStats } = userSlice.actions;
// export const userReducer = userSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { appendGameHistory, deAuthenticateUser, getUserStats, saveUserStats, trackUsersActions } from "../utils/firestore";

// Исходное состояние пользователя
const initialState = {
  username: null,
  id: null,
  stats: { wins: 0, losses: 0, draws: 0 },
};

// Асинхронный thunk для получения статистики пользователя
export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async userId => {
    const stats = await getUserStats(userId);
    return stats || { wins: 0, losses: 0, draws: 0 }; // Если статистика не найдена, возвращаем дефолтные значения
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Логин пользователя
    login(state, action) {
      state.username = action.payload.username;
      state.id = action.payload.id;
    },

    // Обновление статистики
    updateStats(state, action) {
      const { result } = action.payload;

      // Обновляем статистику, увеличивая нужный показатель
      if (state.stats[result] !== undefined) {
        state.stats = {
          ...state.stats,
          [result]: state.stats[result] + 1, // Увеличиваем счетчик на 1
        };
      }
      // Если есть id пользователя, сохраняем обновленную статистику в Firestore
      const userId = localStorage.getItem("id")
      if (userId) {
        // saveUserStats(state.id, state.stats);
        saveUserStats(userId, state.stats)
    } else {
        console.error('Invalid user ID:', userId);
    }
    },

    updateGamesHistory(state, action) {
      const { result, opponent, isAutomaticWin, type } = action.payload;
      const user = localStorage.getItem("username");
      const userId = localStorage.getItem("id");
  
      // Check if user and userId are available
      if (!user || !userId) {
          console.error("User  or User ID not found in local storage.");
          return;
      }
  
      const winner = result === 'wins' ? user : opponent;
      const opposite = !isAutomaticWin ? user : (opponent !== 'AI' ? opponent : 'AI');
      const currentData = new Date()
  
      const dataTemplate = {
          date: new Date(),
          opponent: opposite,
          user_id: userId,
          username: user,
          wins: winner,
          type: type || 'offline' // Default to 'offline' if type is not provided
      };
  
      console.log(dataTemplate);
      appendGameHistory(dataTemplate);
  },

    // Логаут пользователя
    logout(state) {
        deAuthenticateUser()
        state.username = null;
        state.id = null;
        state.stats = { wins: 0, losses: 0, draws: 0 }; // Сбрасываем статистику
    },
  },
});

export const { login, logout, updateStats, updateGamesHistory } = userSlice.actions;
export const userReducer = userSlice.reducer;
