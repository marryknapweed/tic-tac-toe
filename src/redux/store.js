// import { configureStore } from "@reduxjs/toolkit";
// import { userReducer } from "./user-slice";
// import { persistStore, persistReducer } from "redux-persist";
// import { leaderboardReducer } from "./leaderboard-slice";
// import { gameHistoryReducer } from "./game-history-slice";
// import storage from "redux-persist/lib/storage";

// // Конфигурация persist для сохранения в localStorage
// const persistConfig = {
//   key: "root",
//   storage,
// };

// // Обертка для редьюсера с persist
// const persistedReducer = persistReducer(persistConfig, userReducer);

// export const store = configureStore({
//   reducer: {
//     user: persistedReducer,
//     leaderboard: leaderboardReducer,
//     // gameHistory: gameHistoryReducer,
//   },

//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST"], // Игнорируем ошибки сериализации для экшенов persist
//         ignoredPaths: ["register"], // Игнорируем путь "register"
//       },
//     }),
// });

// // Создание persistor для работы с persist
// export const persistor = persistStore(store); // Экспортируем persistor

// export default { store, persistor };

import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./user-slice";
import { leaderboardReducer } from "./leaderboard-slice";
import { gameHistoryReducer } from "./game-history-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    leaderboard: leaderboardReducer,
    gameHistory: gameHistoryReducer,
  },
});
