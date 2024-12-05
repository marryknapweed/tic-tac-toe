import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserStats, saveUserStats } from "../utils/firestore";

const initialState = {
  username: null,
  id: null,
  stats: { wins: 0, losses: 0, draws: 0 },
};

// Create an async thunk for fetching user stats
export const fetchUserStats = createAsyncThunk(
  'user/fetchUserStats',
  async (userId) => {
    const stats = await getUserStats(userId);
    return stats;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      console.log("Logging in with:", action.payload); // Debugging log
      state.username = action.payload.username;
      state.id = action.payload.id;
    },

    updateStats(state, action) {
      const { result } = action.payload;
      state.stats[result]++;
      console.log(state)
      saveUserStats(state.id, state.stats);
    },

    logout(state) {
      console.log("Logging out"); // Debugging log
      state.username = null;
      state.id = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default userSlice.reducer;
export const { login, updateStats, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
