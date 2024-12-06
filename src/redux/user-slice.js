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
import { appendGameHistory, getUserStats, saveUserStats } from "../utils/firestore";

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

      console.log(state.id)

      // Если есть id пользователя, сохраняем обновленную статистику в Firestore
      if (state.id && typeof state.id === 'string') {
        saveUserStats(state.id, state.stats);
    } else {
        console.error('Invalid user ID:', state.id);
    }
    },

    updateGamesHistory(state, action) {
      const {result} = action.payload
      const winner = result === 'wins' ? 'user' : 'AI'
      const dataTemplate = {
        date: new Date(),
        opponent: 'AI',
        user_id: state.id,
        wins: winner
      }
      appendGameHistory(dataTemplate)
    },

    // Логаут пользователя
    logout(state) {
      state.username = null;
      state.id = null;
      state.stats = { wins: 0, losses: 0, draws: 0 }; // Сбрасываем статистику
    },
  },
});

export const { login, logout, updateStats, updateGamesHistory } = userSlice.actions;
export const userReducer = userSlice.reducer;
