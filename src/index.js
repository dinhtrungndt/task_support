import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/start/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./stores/redux/store";
import "react-toastify/dist/ReactToastify.css";

import "./api/axiosClient";
import { SearchProvider } from "./contexts/search/SearchContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthProvider>
      <BrowserRouter>
        <SearchProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </SearchProvider>
      </BrowserRouter>
    </AuthProvider>
  </Provider>
);

reportWebVitals();
