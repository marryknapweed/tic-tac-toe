import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "../utils/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async () => {
    const result = await getAllUsers();
    // console.log(result);
    return result;
  }
);

const initialState = {
  leaderboard: [],
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLeaderboard.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setLeaderboard } = leaderboardSlice.actions;
export const leaderboardReducer = leaderboardSlice.reducer;
