import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  games: [],
};

const gameHistorySlice = createSlice({
  name: "gameHistory",
  initialState,
  reducers: {
    setGameHistory(state, action) {
      state.games = action.payload;
    },
    addGameHistory(state, action) {
      state.games.push(action.payload);
    },
  },
});

export const { setGameHistory, addGameHistory } = gameHistorySlice.actions;
export const gameHistoryReducer = gameHistorySlice.reducer;
