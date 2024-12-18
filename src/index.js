import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./components/store/store"; // 수정: persistor 추가
import { PersistGate } from "redux-persist/integration/react"; // PersistGate 추가

export const Context = createContext();

// const host = 'http://localhost:8080';

let host;
if (window.location.hostname === "localhost") {
  host = "http://localhost:8080";
} else {
  host = "/api";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Context.Provider value={{ host }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </Context.Provider>
  </BrowserRouter>
);
