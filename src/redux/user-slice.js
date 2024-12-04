import { createSlice } from "@reduxjs/toolkit";
import { getUserStats, saveUserStats } from "../utils/firestore";

const initialState = {
  id: null,
  stats: { wins: 0, losses: 0, draws: 0 },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.id = action.payload;
      getUserStats(action.payload).then(stats => {
        state.stats = stats;
      });
    },

    logout(state) {
      state.id = null;
      state.stats = { wins: 0, losses: 0, draws: 0 };
    },

    updateStats(state, action) {
      const { result } = action.payload;
      state.stats[result]++;
      saveUserStats(state.id, state.stats);
    },
  },
});

export const { login, updateStats, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
