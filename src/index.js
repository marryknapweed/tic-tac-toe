// import React from "react";
// import ReactDOM from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store, persistor } from "./redux/store"; // Импортируем persistor
// import { PersistGate } from "redux-persist/integration/react";
// import { router } from "./router";
// import "./styles.css";

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <RouterProvider router={router}></RouterProvider>
//     </PersistGate>
//   </Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Только store
import { router } from "./router";
import { useEffect } from "react";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));



root.render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
